from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any


class LLMConfigurationError(RuntimeError):
    pass


class LLMServiceError(RuntimeError):
    pass


@dataclass(frozen=True)
class ChartImageInput:
    label: str
    file_name: str
    content_type: str
    content: bytes


class ChartAnalysisLLMProvider(ABC):
    @abstractmethod
    def analyze_chart_set(self, images: list[ChartImageInput]) -> dict[str, Any]:
        pass
