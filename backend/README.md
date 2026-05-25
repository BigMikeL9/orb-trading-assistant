# ORB Decision Support API

FastAPI backend foundation for the ORB Trading Assistant. This service is the
future boundary for durable setup history, chart set metadata, screenshot
storage coordination, auth, and LLM chart analysis orchestration.

This skeleton intentionally does not include a database, auth, AI integration,
Docker, or migrations yet.

The chart-analysis endpoint is a debug-only LLM spike. It accepts screenshots in
memory and returns the model's parsed structured JSON response. It does not
persist files or analysis results.

## Requirements

- Python 3.12+
- uv

## Setup

```bash
uv sync
cp .env.example .env
```

On Windows PowerShell:

```powershell
uv sync
Copy-Item .env.example .env
```

If PowerShell cannot render the FastAPI CLI banner, enable UTF-8 for the
current shell:

```powershell
$env:PYTHONUTF8="1"
```

## Run Locally

```bash
uv run fastapi dev app/main.py
```

The API will be available at:

```txt
http://127.0.0.1:8000
```

Health check:

```bash
curl http://127.0.0.1:8000/api/health
```

Expected response:

```json
{
  "status": "healthy"
}
```

## Validation

```bash
uv run ruff check .
uv run pytest
uv run fastapi dev app/main.py
```

## Debug Chart Analysis Spike

Environment variables:

```txt
LLM_PROVIDER=gemini
LLM_MODEL=gemini-2.5-flash
GEMINI_API_KEY=your_api_key_here
```

Create a Gemini API key in Google AI Studio from the API keys page:
https://aistudio.google.com/apikey

Example request:

```bash
curl -X POST http://127.0.0.1:8000/api/chart-analysis/debug \
  -F "chart_15m_orb=@./charts/spy-15m.png;type=image/png" \
  -F "chart_5m_execution=@./charts/spy-5m.png;type=image/png" \
  -F "chart_4h_context=@./charts/spy-4h.png;type=image/png" \
  -F "chart_daily=@./charts/spy-daily.png;type=image/png"
```

Limitations:

- Debug-only endpoint.
- Images are read in memory only.
- No auth, persistence, object storage, retries, or background jobs.
- LLM output is returned directly after JSON parsing.
- Gemini is the only implemented provider right now.
- This does not run the ORB rule engine and is not a trading signal.

## Current Structure

```txt
backend/
  app/
    main.py
    core/
      config.py
    services/
      llm/
        base.py
        gemini_service.py
        llm_factory.py
    schemas/
      chart_analysis.py
    api/
      routes/
        health.py
        chart_analysis.py
    tests/
      test_health.py
  pyproject.toml
  .env.example
  README.md
```
