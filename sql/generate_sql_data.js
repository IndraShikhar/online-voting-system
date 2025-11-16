// generate_large_seed_fixed.js
const fs = require('fs');

const TOTAL_USERS = 500;
const TOTAL_ELECTIONS = 20;
const CANDIDATES_PER_ELECTION = 5;
const VOTES_PER_ELECTION = 200; // per election
const BAN_CHANCE = 0.03;

let sql = '';

// ----------------------
// 1️⃣ USERS
// ----------------------
sql +=
  'INSERT INTO users (username, name, email, password, avatar_url, role, is_banned) VALUES\n';

for (let i = 1; i <= TOTAL_USERS; i++) {
  sql += `('user_${i}', 'User ${i}', 'user${i}@example.com', 'pass${i}', 'https://i.pravatar.cc/150?u=${i}', '${
    i === 1 ? 'admin' : 'voter'
  }', 0)${i === TOTAL_USERS ? ';' : ','}\n`;
}

// ----------------------
// 2️⃣ ELECTIONS
// ----------------------
sql +=
  '\n\nINSERT INTO elections (title, description, start_time, end_time, status, created_by) VALUES\n';

const statuses = ['upcoming', 'active', 'ended', 'result_declared'];

for (let i = 1; i <= TOTAL_ELECTIONS; i++) {
  sql += `('Election ${i}', 'Description ${i}', '2025-01-${
    (i % 28) + 1
  } 09:00:00', '2025-01-${(i % 28) + 1} 17:00:00', '${statuses[i % 4]}', 1)${
    i === TOTAL_ELECTIONS ? ';' : ','
  }\n`;
}

// ----------------------
// 3️⃣ CANDIDATES (unique per election)
// ----------------------
sql += '\n\nINSERT INTO candidates (election_id, username, party) VALUES\n';

let candidateCount = 0;
let candidateId = 1;

for (let e = 1; e <= TOTAL_ELECTIONS; e++) {
  const usedUsers = new Set();

  while (usedUsers.size < CANDIDATES_PER_ELECTION) {
    const randUser = Math.floor(Math.random() * TOTAL_USERS) + 1;
    usedUsers.add(randUser);
  }

  for (const user of usedUsers) {
    sql += `(${e}, 'user_${user}', 'Party ${candidateId}')${
      candidateId === TOTAL_ELECTIONS * CANDIDATES_PER_ELECTION ? ';' : ','
    }\n`;
    candidateId++;
  }
}

// ----------------------
// 4️⃣ WINNERS (safe)
// ----------------------
sql += '\n\n-- WINNERS\n';

let cid = 1;
for (let e = 1; e <= TOTAL_ELECTIONS; e++) {
  if (statuses[e % 4] === 'ended' || statuses[e % 4] === 'result_declared') {
    sql += `UPDATE elections SET winner_candidate_id = ${cid} WHERE election_id = ${e};\n`;
  }
  cid += CANDIDATES_PER_ELECTION;
}

// ----------------------
// 5️⃣ VOTES (unique: one vote per user per election)
// ----------------------
sql += '\nINSERT INTO votes (election_id, username, candidate_id) VALUES\n';

let voteCounter = 0;
let electionStartCandidate = 1;

for (let e = 1; e <= TOTAL_ELECTIONS; e++) {
  const votedUsers = new Set();

  while (votedUsers.size < VOTES_PER_ELECTION) {
    const user = Math.floor(Math.random() * TOTAL_USERS) + 1;
    votedUsers.add(user);
  }

  const candidateStart = electionStartCandidate;
  const candidateEnd = electionStartCandidate + CANDIDATES_PER_ELECTION - 1;

  for (const user of votedUsers) {
    const randCandidate =
      Math.floor(Math.random() * CANDIDATES_PER_ELECTION) + candidateStart;
    voteCounter++;

    sql += `(${e}, 'user_${user}', ${randCandidate})${
      voteCounter === TOTAL_ELECTIONS * VOTES_PER_ELECTION ? ';' : ','
    }\n`;
  }

  electionStartCandidate += CANDIDATES_PER_ELECTION;
}

// ----------------------
// 6️⃣ BANS (no duplicates)
// ----------------------
sql +=
  '\n\nINSERT INTO bans (username, election_id, reason, banned_by, ban_type) VALUES\n';

let banCount = 0;
let totalBanAttempts = TOTAL_USERS;

for (let i = 2; i <= TOTAL_USERS; i++) {
  if (Math.random() < BAN_CHANCE) {
    // 50% permanent ban, 50% election ban
    const isPermanent = Math.random() < 0.5;

    let election = isPermanent
      ? 'NULL'
      : Math.floor(Math.random() * TOTAL_ELECTIONS) + 1;
    let type = isPermanent ? 'permanent' : 'election';

    banCount++;
    sql += `('user_${i}', ${election}, 'Rule Violation', 'user_1', '${type}')${
      i === TOTAL_USERS ? ';' : ','
    }\n`;
  }
}

// ----------------------
// WRITE OUTPUT
// ----------------------
fs.writeFileSync('large_seed_fixed.sql', sql, 'utf8');

console.log(
  '🔥 Successfully generated large_seed_fixed.sql without duplicates!'
);
