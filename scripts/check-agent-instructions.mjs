#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const canonicalPath = resolve(root, 'AGENTS.md');
const strict = process.argv.includes('--strict');

if (!existsSync(canonicalPath)) {
  console.error(`Missing canonical instruction file: ${canonicalPath}`);
  process.exit(2);
}

function hashFile(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function worktreePaths() {
  const output = execFileSync('git', ['-C', root, 'worktree', 'list', '--porcelain'], {
    encoding: 'utf8',
  });
  return output
    .split(/\r?\n/)
    .filter((line) => line.startsWith('worktree '))
    .map((line) => line.slice('worktree '.length));
}

const canonicalHash = hashFile(canonicalPath);
const rows = worktreePaths()
  .filter((worktree) => resolve(worktree) !== root)
  .map((worktree) => {
    const instructionPath = resolve(worktree, 'AGENTS.md');
    if (!existsSync(instructionPath)) {
      return { worktree, status: 'missing' };
    }
    return {
      worktree,
      status: hashFile(instructionPath) === canonicalHash ? 'in-sync' : 'different',
    };
  });

console.log(`Canonical file: ${canonicalPath}`);
if (rows.length === 0) {
  console.log('No linked worktrees to compare.');
  process.exit(0);
}
for (const row of rows) {
  console.log(`${row.status.padEnd(9)} ${row.worktree}`);
}

const mismatches = rows.filter((row) => row.status !== 'in-sync');
if (mismatches.length > 0) {
  console.log(`\n${mismatches.length} worktree instruction file(s) need review; no files were changed.`);
  if (strict) process.exit(1);
} else {
  console.log('\nAll linked worktree instruction files match the canonical guide.');
}
