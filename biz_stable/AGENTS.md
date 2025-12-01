# Repository Guidelines

## Project Structure & Module Organization
- `src/pages/management` hosts management views such as `terminal-assets/cloud-hosts`; `src/pages/collaboration` covers the collaboration center. Share UI primitives in `src/components` and keep Redux state in `src/store` / `src/store/slices`.
- Mock data in `src/mock` must reflect `docs/asset-info-sample.xlsx`; refresh `design/design_document/terminal-resource-management-design.md` when user journeys or wireframes change.
- Persist architecture notes in `PROJECT_ARCHITECTURE.md`, UX specs in `design/`, and product collateral in `docs/`; leave generated bundles inside `dist/`.
- Keep helpers under `src/utils`, HTTP logic under `src/services`, and contracts under `src/types` (e.g., `src/types/cloud-host.ts`).

## Build, Test, and Development Commands
- `npm install` installs dependencies.
- `npm run dev` respects `VITE_SYSTEM_TYPE`; `npm run dev:management` and `npm run dev:collaboration` lock the shell to ports 3000/3001 for focused work.
- `npm run build` plus `npm run preview` validates the production bundle, with subsystem variants available via `build:management` / `build:collaboration`.
- `npm run lint` and `npm run lint:fix` run ESLint + TypeScript checks.

## Coding Style & Naming Conventions
- React 18 + TypeScript, two-space indentation, single quotes, and function components (avoid `React.FC`).
- Components/hooks use PascalCase; slices, services, and helpers stay camelCase.
- Prefer the `@/` alias for imports; follow `design/design_document/UI-UX设计规范.md` for the 8px spacing grid, typography, and warning colors.

## Testing Guidelines
- No automated suite yet—exercise pages manually with the relevant `npm run dev:*` command and log tricky steps in `docs/TESTING.md`.
- Keep mock generators deterministic so KPI cards and detail pages reproduce; add new fixtures to `src/mock` and hydrate them through the matching Redux slice.
- Co-locate future `*.test.tsx` files with their component.

## Commit & Pull Request Guidelines
- Match the imperative style in `git log` (`add 协同任务管理功能`, `fix deploy localhost bug`).
- PRs must outline the problem, solution, screenshots (e.g., `/management/terminal-assets/cloud-hosts`), and commands executed.
- Call out schema, mock, or documentation updates so reviewers know which files to audit.

## Security & Configuration Tips
- Keep secrets out of git; override `VITE_SYSTEM_TYPE` or API roots through `.env.local`.
- Route network requests through `src/services` for traceability.
- Anonymize identifiers before committing mock payloads or screenshots.
