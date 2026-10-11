# Code by Leon alternate branch

This worktree is the Next.js alternate website on `codex/codebyleon-alternate` in the Code by Leon Git repository. It branches from local `main`; the React/Vite version remains in that branch and in Git history.

Imported on 2026-10-12 from the separately downloaded and refined comparison project. See `alternate-import-manifest.json` for source file hashes. The original alternate and the current React/Vite checkout were not moved or edited by this import.

## Working here

- This is the alternate: use its Next.js configuration and instructions, not the Vite commands from other branches.
- Both supplied lockfiles and package scripts were preserved. No package-manager migration or lockfile regeneration was performed.
- The local verification environment uses an ignored node_modules junction to the existing alternate installation. That junction is not part of Git. A fresh checkout needs its own dependency installation.
- Windows development command: `node node_modules/next/dist/bin/next dev --hostname 127.0.0.1 --port 3105 --webpack`.
- Windows build command: `node node_modules/next/dist/bin/next build --webpack`. The inherited package build script also includes Unix `cp` commands.
- Type-check: `node node_modules/typescript/bin/tsc --noEmit --incremental false`.
- Lint: `node node_modules/eslint/bin/eslint.js src/components/home/founder.tsx` for the latest modified section; full lint remains the inherited `lint` script.
- The inherited Next configuration ignores build type errors. A successful build does not imply a clean type-check. Known prior diagnostics involve websocket examples, configurator, form wrappers and Prisma generation.
- The pending Figma SVG revision has not been imported; current illustration is preserved.
- Keep original source preview on port 3101 and tuner on 3103 intact. This worktree preview uses 3105.
- No merge, push or deployment is authorized by this import.

## Import boundaries

Source, fonts, images, video, source documentation, config, lockfiles and auxiliary example/scripts were retained. Dependencies, build output, caches, local environment files, database files and tool-result artifacts were excluded. The alternate has not been rewritten for Vite.
