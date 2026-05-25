from typing import Any

from fastapi.testclient import TestClient

from app.api.routes.chart_analysis import get_llm_service
from app.main import create_app
from app.services.llm.base import ChartAnalysisLLMProvider, ChartImageInput


class FakeLLMService(ChartAnalysisLLMProvider):
    def analyze_chart_set(self, images: list[ChartImageInput]) -> dict[str, Any]:
        return {
            "imageCount": len(images),
            "imageLabels": [image.label for image in images],
            "extractedContext": {
                "orbHigh": 101.25,
                "orbLow": 99.5,
                "currentPrice": 102.0,
                "higherTimeframeBias": "bullish",
                "marketCondition": "trending",
                "keySupportZones": [],
                "keyResistanceZones": [],
            },
            "currentSetup": {
                "verdict": "wait",
                "direction": "long",
                "breakoutStatus": "broken",
                "retestStatus": "not-tested",
                "noTradeReasons": [],
                "warnings": ["Debug fake response."],
            },
            "idealTradeGuidance": {
                "idealLongScenario": None,
                "idealShortScenario": None,
            },
        }


def test_debug_chart_analysis_accepts_multipart_images() -> None:
    app = create_app()
    app.dependency_overrides[get_llm_service] = lambda: FakeLLMService()
    client = TestClient(app)

    response = client.post(
        "/api/chart-analysis/debug",
        files={
            "chart_15m_orb": ("orb.png", b"orb-chart", "image/png"),
            "chart_5m_execution": ("execution.png", b"execution", "image/png"),
            "chart_4h_context": ("context.png", b"context", "image/png"),
        },
    )

    assert response.status_code == 200
    assert response.json()["imageCount"] == 3
    assert response.json()["imageLabels"] == [
        "15m ORB chart",
        "5m execution chart",
        "4h context chart",
    ]


def test_debug_chart_analysis_rejects_non_image_uploads() -> None:
    app = create_app()
    app.dependency_overrides[get_llm_service] = lambda: FakeLLMService()
    client = TestClient(app)

    response = client.post(
        "/api/chart-analysis/debug",
        files={
            "chart_15m_orb": ("orb.txt", b"not-image", "text/plain"),
            "chart_5m_execution": ("execution.png", b"execution", "image/png"),
        },
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "15m ORB chart must be an image upload."
