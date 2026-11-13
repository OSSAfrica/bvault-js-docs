import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const base = process.env.DCO_BASE_SHA;
assert.match(base ?? '', /^[0-9a-f]{40}$/, 'DCO_BASE_SHA must be the PR base commit SHA');
const log = execFileSync(
  'git',
  ['log', '--no-merges', '--format=%H%x00%aN%x00%aE%x00%B%x1e', `${base}..HEAD`],
  { encoding: 'utf8' },
);
const failures = [];
for (const entry of log.split('\x1e').filter((part) => part.trim())) {
  const [sha, name, email, body] = entry.trim().split('\x00');
  const expected = `Signed-off-by: ${name} <${email}>`;
  if (!body.split('\n').some((line) => line.trim().toLowerCase() === expected.toLowerCase())) {
    failures.push(`${sha.slice(0, 12)} is missing its author's DCO sign-off`);
  }
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log('All non-merge commits include their author DCO sign-off.');
}
