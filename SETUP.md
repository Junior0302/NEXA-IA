# NEXA IA

NEXA IA is a static React/TypeScript site served directly from `/workspace`.

The entrypoint is `index.html`, which loads `app.tsx` and `styles.css`. The app uses a small client-side router so the following routes are available without a build step:

- `/`
- `/tools`
- `/notes`
- `/about`
- `/contact`

Reusable interface pieces live in `components/ui/`. The Three.js robot is exposed as `RobotScene` and used in the homepage hero.

The project has no build step: deploy the workspace as a static site. The route folders (`tools/`, `notes/`, `about/`, `contact/`) contain static entrypoints so direct visits and refreshes work on hosts without SPA rewrites.
