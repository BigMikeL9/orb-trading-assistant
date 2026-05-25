# ORB Trading Assistant

Monorepo for the ORB Trading Assistant decision support system.

The product is organized as a Next.js frontend and a FastAPI backend. The
frontend currently remains fully functional with local state/localStorage while
the backend is introduced incrementally.

## Project Structure

```txt
frontend/
  src/
  public/
  package.json
  next.config.ts
  tsconfig.json
  vitest.config.ts
  README.md

backend/
  app/
  pyproject.toml
  README.md

docs/
  architecture.md
```

## Frontend

```bash
cd frontend
npm install
npm run dev
npm run lint
npm test
npm run build
```

## Backend

```bash
cd backend
uv sync
uv run uvicorn app.main:app --reload
uv run ruff check .
uv run pytest
```

## Documentation

Architecture notes live in [docs/architecture.md](docs/architecture.md).
