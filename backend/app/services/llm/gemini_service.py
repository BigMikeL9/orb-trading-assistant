import base64
import json
from typing import Any

import httpx

from app.schemas.chart_analysis import CHART_ANALYSIS_SCHEMA
from app.services.llm.base import (
    ChartAnalysisLLMProvider,
    ChartImageInput,
    LLMConfigurationError,
    LLMServiceError,
)

GEMINI_API_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
)


class GeminiChartAnalysisService(ChartAnalysisLLMProvider):
    def __init__(
        self,
        *,
        api_key: str | None,
        model: str,
        timeout_seconds: float = 60.0,
    ) -> None:
        self.api_key = api_key
        self.model = model
        self.timeout_seconds = timeout_seconds

    def analyze_chart_set(self, images: list[ChartImageInput]) -> dict[str, Any]:
        if not self.api_key:
            raise LLMConfigurationError("GEMINI_API_KEY is not configured.")

        try:
            response = httpx.post(
                GEMINI_API_URL.format(model=self.model),
                params={"key": self.api_key},
                json=self._build_payload(images),
                timeout=self.timeout_seconds,
            )
            response.raise_for_status()
        except httpx.HTTPStatusError as exc:
            detail = _safe_response_detail(exc.response)
            raise LLMServiceError(
                f"Gemini request failed with status {exc.response.status_code}: "
                f"{detail}"
            ) from exc
        except httpx.HTTPError as exc:
            raise LLMServiceError("Gemini chart analysis request failed.") from exc

        return self._parse_response(response.json())

    def _build_payload(self, images: list[ChartImageInput]) -> dict[str, Any]:
        return {
            "contents": [
                {
                    "role": "user",
                    "parts": [
                        {"text": self._build_prompt(images)},
                        *[
                            {
                                "inlineData": {
                                    "mimeType": image.content_type,
                                    "data": self._to_base64(image),
                                }
                            }
                            for image in images
                        ],
                    ],
                }
            ],
            "generationConfig": {
                "responseMimeType": "application/json",
                "temperature": 0.1,
            },
        }

    def _build_prompt(self, images: list[ChartImageInput]) -> str:
        image_list = "\n".join(
            f"- {image.label}: {image.file_name}" for image in images
        )
        schema = json.dumps(CHART_ANALYSIS_SCHEMA, indent=2)

        return f"""
You are reviewing chart screenshots for an ORB/TTC decision-support debug spike.
This is not a trading signal. Extract visible context only.

Images provided:
{image_list}

Return STRICT JSON only. Do not add markdown, code fences, commentary, or extra
keys. Use null when a price is not visible. Use arrays for noTradeReasons,
warnings, keySupportZones, and keyResistanceZones.

The JSON must match this schema:
{schema}
""".strip()

    def _to_base64(self, image: ChartImageInput) -> str:
        return base64.b64encode(image.content).decode("ascii")

    def _parse_response(self, payload: dict[str, Any]) -> dict[str, Any]:
        candidates = payload.get("candidates")

        if not isinstance(candidates, list) or not candidates:
            raise LLMServiceError("Gemini response did not include candidates.")

        first_candidate = candidates[0]

        if not isinstance(first_candidate, dict):
            raise LLMServiceError("Gemini candidate was not an object.")

        content = first_candidate.get("content")

        if not isinstance(content, dict):
            raise LLMServiceError("Gemini candidate did not include content.")

        parts = content.get("parts")

        if not isinstance(parts, list):
            raise LLMServiceError("Gemini content did not include parts.")

        for part in parts:
            if isinstance(part, dict) and isinstance(part.get("text"), str):
                return _parse_json_object(part["text"])

        raise LLMServiceError("Gemini response did not include JSON text.")


def _parse_json_object(value: str) -> dict[str, Any]:
    cleaned_value = value.strip()

    if cleaned_value.startswith("```"):
        cleaned_value = cleaned_value.removeprefix("```json").removeprefix("```")
        cleaned_value = cleaned_value.removesuffix("```").strip()

    try:
        parsed_value = json.loads(cleaned_value)
    except json.JSONDecodeError as exc:
        raise LLMServiceError("Gemini response was not valid JSON.") from exc

    if not isinstance(parsed_value, dict):
        raise LLMServiceError("Gemini response was not a JSON object.")

    return parsed_value


def _safe_response_detail(response: httpx.Response) -> str:
    try:
        payload = response.json()
    except ValueError:
        return response.text[:500] or "No response body."

    if isinstance(payload, dict):
        error = payload.get("error")

        if isinstance(error, dict):
            message = error.get("message")
            status = error.get("status")

            if isinstance(message, str) and isinstance(status, str):
                return f"{status}: {message}"

            if isinstance(message, str):
                return message

    return response.text[:500] or "No response body."
