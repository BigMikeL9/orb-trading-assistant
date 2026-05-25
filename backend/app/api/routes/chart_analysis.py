from typing import Annotated, Any

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status

from app.core.config import get_settings
from app.services.llm.base import (
    ChartAnalysisLLMProvider,
    ChartImageInput,
    LLMConfigurationError,
    LLMServiceError,
)
from app.services.llm.llm_factory import create_chart_analysis_llm_provider

router = APIRouter(prefix="/chart-analysis", tags=["chart-analysis"])

MAX_IMAGE_BYTES = 10 * 1024 * 1024


def get_llm_service() -> ChartAnalysisLLMProvider:
    settings = get_settings()
    return create_chart_analysis_llm_provider(settings)


@router.post("/debug")
async def debug_chart_analysis(
    chart_15m_orb: Annotated[UploadFile, File()],
    chart_5m_execution: Annotated[UploadFile, File()],
    llm_service: Annotated[ChartAnalysisLLMProvider, Depends(get_llm_service)],
    chart_1h_context: Annotated[UploadFile | None, File()] = None,
    chart_4h_context: Annotated[UploadFile | None, File()] = None,
    chart_daily: Annotated[UploadFile | None, File()] = None,
) -> dict[str, Any]:
    images = [
        await _to_chart_image_input("15m ORB chart", chart_15m_orb),
        await _to_chart_image_input("5m execution chart", chart_5m_execution),
    ]

    if chart_1h_context is not None:
        images.append(await _to_chart_image_input("1h context chart", chart_1h_context))

    if chart_4h_context is not None:
        images.append(await _to_chart_image_input("4h context chart", chart_4h_context))

    if chart_daily is not None:
        images.append(await _to_chart_image_input("Daily chart", chart_daily))

    try:
        return llm_service.analyze_chart_set(images)
    except LLMConfigurationError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc
    except LLMServiceError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(exc),
        ) from exc


async def _to_chart_image_input(label: str, file: UploadFile) -> ChartImageInput:
    if file.content_type is None or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"{label} must be an image upload.",
        )

    content = await file.read()

    if len(content) > MAX_IMAGE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"{label} exceeds the 10 MB debug upload limit.",
        )

    return ChartImageInput(
        label=label,
        file_name=file.filename or "uploaded-chart",
        content_type=file.content_type,
        content=content,
    )
