#!/usr/bin/env node
/**
 * Generates dashboard-data.json from git log and loop-prompts.md status.
 * Run: node scripts/generate-dashboard-data.mjs
 */
import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

function run(cmd) {
  try {
    return execSync(cmd, { cwd: ROOT, encoding: 'utf-8' }).trim();
  } catch {
    return '';
  }
}

// Parse git log into structured commits
function getCommits(limit = 100) {
  const SEP = '|||';
  const raw = run(
    `git log --format="%H${SEP}%h${SEP}%an${SEP}%ae${SEP}%aI${SEP}%s" -${limit}`
  );
  if (!raw) return [];
  return raw.split('\n').map((line) => {
    const [hash, short, author, email, date, ...msgParts] = line.split(SEP);
    const message = msgParts.join(SEP);
    return { hash, short, author, email, date, message };
  });
}

// Parse loop-prompts.md to extract backlog items and detect completion via git log
function getBacklogStatus() {
  const loopPrompts = readFileSync(resolve(ROOT, 'loop-prompts.md'), 'utf-8');
  const commits = getCommits(200);
  const commitMessages = commits.map((c) => c.message.toLowerCase());

  const sections = [];
  let currentSection = null;
  const lines = loopPrompts.split('\n');

  for (const line of lines) {
    // Section headers like "## Section 1: Feature Backlog"
    const sectionMatch = line.match(/^## Section (\d+): (.+)/);
    if (sectionMatch) {
      currentSection = {
        number: parseInt(sectionMatch[1]),
        title: sectionMatch[2].trim(),
        items: [],
      };
      sections.push(currentSection);
      continue;
    }

    // Items like "1. **localStorage persistence** — description"
    if (currentSection) {
      const itemMatch = line.match(/^\d+\.\s+\*\*(.+?)\*\*\s*[—–-]\s*(.*)/);
      if (itemMatch) {
        const name = itemMatch[1].trim();
        const description = itemMatch[2].trim();
        const nameLower = name.toLowerCase();
        // Check if any commit message references this item
        const completed = commitMessages.some(
          (msg) =>
            msg.includes(nameLower) ||
            msg.includes(name.replace(/\s+/g, '-').toLowerCase()) ||
            // Check for key words from the item name
            nameLower.split(/\s+/).length <= 3 &&
              nameLower.split(/\s+/).every((word) => word.length > 3 && msg.includes(word))
        );
        currentSection.items.push({ name, description, completed });
      }
    }
  }

  return sections;
}

// Get branch info
function getBranchInfo() {
  const current = run('git branch --show-current');
  const branches = run('git branch -a --format="%(refname:short)"')
    .split('\n')
    .filter(Boolean);
  return { current, branches };
}

// Get file change stats from recent commits
function getRecentStats() {
  const raw = run('git diff --stat HEAD~10..HEAD 2>/dev/null || echo ""');
  const totalRaw = run('git log --oneline | wc -l');
  const todayRaw = run(
    `git log --oneline --since="$(date -d 'today 00:00:00' +%Y-%m-%dT%H:%M:%S 2>/dev/null || date -v0H -v0M -v0S +%Y-%m-%dT%H:%M:%S 2>/dev/null)" 2>/dev/null | wc -l`
  );
  const lastHourRaw = run(
    `git log --oneline --since="1 hour ago" 2>/dev/null | wc -l`
  );

  return {
    totalCommits: parseInt(totalRaw) || 0,
    commitsToday: parseInt(todayRaw) || 0,
    commitsLastHour: parseInt(lastHourRaw) || 0,
    diffStat: raw,
  };
}

// Categorize commits by likely agent/purpose
function categorizeCommit(message) {
  const msg = message.toLowerCase();
  if (msg.includes('test') || msg.includes('vitest') || msg.includes('spec'))
    return { agent: 'Testing', color: '#22d3ee' };
  if (msg.includes('flow') && (msg.includes('add') || msg.includes('new') || msg.includes('create')))
    return { agent: 'Flow Builder', color: '#a78bfa' };
  if (msg.includes('screen') || msg.includes('component'))
    return { agent: 'UI Builder', color: '#f472b6' };
  if (msg.includes('fix') || msg.includes('bug'))
    return { agent: 'Bug Fixer', color: '#fb923c' };
  if (msg.includes('refactor') || msg.includes('extract') || msg.includes('clean'))
    return { agent: 'Refactorer', color: '#34d399' };
  if (msg.includes('dashboard'))
    return { agent: 'Dashboard', color: '#fbbf24' };
  if (msg.includes('doc') || msg.includes('readme'))
    return { agent: 'Docs', color: '#94a3b8' };
  if (msg.includes('style') || msg.includes('css') || msg.includes('animation') || msg.includes('transition'))
    return { agent: 'Stylist', color: '#e879f9' };
  if (msg.includes('accessibility') || msg.includes('aria') || msg.includes('a11y'))
    return { agent: 'Accessibility', color: '#2dd4bf' };
  if (msg.includes('persist') || msg.includes('localstorage') || msg.includes('storage'))
    return { agent: 'Storage', color: '#60a5fa' };
  if (msg.includes('validation') || msg.includes('validate'))
    return { agent: 'Validation', color: '#f87171' };
  if (msg.includes('keyboard') || msg.includes('navigation') || msg.includes('swipe'))
    return { agent: 'Navigation', color: '#c084fc' };
  return { agent: 'General', color: '#9ca3af' };
}

// Build the dashboard data
const commits = getCommits(100);
const backlog = getBacklogStatus();
const branch = getBranchInfo();
const stats = getRecentStats();

const enrichedCommits = commits.map((c) => ({
  ...c,
  ...categorizeCommit(c.message),
}));

// Agent activity summary
const agentActivity = {};
for (const c of enrichedCommits) {
  if (!agentActivity[c.agent]) {
    agentActivity[c.agent] = { count: 0, color: c.color, lastActive: c.date };
  }
  agentActivity[c.agent].count++;
}

const data = {
  generatedAt: new Date().toISOString(),
  branch,
  stats,
  commits: enrichedCommits,
  backlog,
  agentActivity,
};

const outPath = resolve(ROOT, 'public', 'dashboard-data.json');
writeFileSync(outPath, JSON.stringify(data, null, 2));
console.log(`Dashboard data written to ${outPath} (${commits.length} commits, ${backlog.length} sections)`);
