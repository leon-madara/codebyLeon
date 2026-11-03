# Code by Leon alternate branch

This worktree is the Next.js alternate website on `codex/codebyleon-alternate` in the Code by Leon Git repository. It branches from local `main`; the React/Vite version remains in that branch and in Git history.

Imported on 2026-10-12 from the separately downloaded and refined comparison project. See `alternate-import-manifest.json` for source file hashes. The original alternate and the current React/Vite checkout were not moved or edited by this import.

## Working here

- This is the alternate: use its Next.js configuration and instructions, not the Vite commands from other branches.
- Both supplied lockfiles and package scripts were preserved. No package-manager migration or lockfile regeneration was performed.
- The local verification environment uses an ignored node_modules junction to the existing alternate installation. That junction is not part of Git. A fresh checkout needs its own dependency installation.
- Default Windows development command: `npm run dev` (Webpack, port 3000; no Unix `tee` dependency).
- Alternate-port Windows development command: `node node_modules/next/dist/bin/next dev --hostname 127.0.0.1 --port 3105 --webpack`.
- Windows build command: `node node_modules/next/dist/bin/next build --webpack`. The inherited package build script also includes Unix `cp` commands.
- Type-check: `node node_modules/typescript/bin/tsc --noEmit --incremental false`.
- Lint: `node node_modules/eslint/bin/eslint.js src/components/home/founder.tsx` for the latest modified section; full lint remains the inherited `lint` script.
- The inherited Next configuration ignores build type errors. A successful build does not imply a clean type-check. Known prior diagnostics involve websocket examples, configurator, form wrappers and Prisma generation.
- The pending Figma SVG revision has not been imported; current illustration is preserved.
- Keep original source preview on port 3101 and tuner on 3103 intact. This worktree preview uses 3105.
- No merge, push or deployment is authorized by this import.

## Security verification environment - 2026-10-22

- Current checkout has a physical `node_modules` directory, rather than the original import junction.
- The security patch uses the existing npm installation and `package-lock.json`: Next.js and its ESLint config resolve to 16.4.2. Install used `npm install --ignore-scripts --legacy-peer-deps`; no package-manager migration was made.
- The inherited Bun snapshot (Next 16.1.3) is now archived at `docs/legacy-lockfiles/bun.import.lock` after deployment; `package-lock.json` is the release lockfile. Do not use it as evidence of the patched dependency tree or for a frozen release install. Reconcile it deliberately before adopting a Bun installation workflow.
- See `SECURITY_SCROLL_REVIEW.md` and `SECURITY_HTTP_CHECKS.md` for local evidence and remaining security work.

## Import boundaries

Source, fonts, images, video, source documentation, config, lockfiles and auxiliary example/scripts were retained. Dependencies, build output, caches, local environment files, database files and tool-result artifacts were excluded. The alternate has not been rewritten for Vite.
