from app.core.config import Settings
from app.services.llm.base import ChartAnalysisLLMProvider, LLMConfigurationError
from app.services.llm.gemini_service import GeminiChartAnalysisService


def create_chart_analysis_llm_provider(settings: Settings) -> ChartAnalysisLLMProvider:
    if settings.llm_provider == "gemini":
        return GeminiChartAnalysisService(
            api_key=settings.gemini_api_key,
            model=settings.llm_model,
        )

    raise LLMConfigurationError(
        f"Unsupported LLM_PROVIDER '{settings.llm_provider}'."
    )
