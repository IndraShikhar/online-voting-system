USE voting_system;

-- ==============================
-- SEED DATA FOR SMARTVOTE
-- ==============================

-- 1️⃣ USERS
INSERT INTO users (username, name, email, password, role) VALUES
('admin', 'Admin', 'admin@example.com', 'password123', 'admin'),
('voter1', 'Voter One', 'voter1@example.com', 'password123', 'voter'),
('voter2', 'Voter Two', 'voter2@example.com', 'password123', 'voter'),
('voter3', 'Voter Three', 'voter3@example.com', 'password123', 'voter'),
('voter4', 'Voter Four', 'voter4@example.com', 'password123', 'voter');


-- 2️⃣ ELECTIONS
INSERT INTO elections (title, description, start_time, end_time, status, created_by) VALUES
('NITM President Election 2025', 'Election for college student body president.',
 '2025-01-01 09:00:00', '2025-01-01 17:00:00', 'ended', 1),

('Tech Club Lead Election', 'Election for NITM Tech Club Coordinator.',
 '2025-12-01 10:00:00', '2025-12-01 16:00:00', 'active', 1),

('Sports Secretary Election', 'Election for sports council secretary.',
 '2025-12-20 09:00:00', '2025-12-20 17:00:00', 'upcoming', 1);


-- 3️⃣ CANDIDATES
INSERT INTO candidates (election_id, name, party, avatar_url) VALUES
-- Election 1 candidates
(1, 'Alice Sharma', 'Unity Party', 'https://example.com/a1.png'),
(1, 'Bob Sen', 'Progressive Front', 'https://example.com/b1.png'),
(1, 'Charlie Das', 'Independent', 'https://example.com/c1.png'),

-- Election 2 candidates
(2, 'Derek Paul', 'Tech Innovators', 'https://example.com/d1.png'),
(2, 'Eva Kapoor', 'Creators Guild', 'https://example.com/e1.png'),

-- Election 3 candidates
(3, 'Firoz Khan', 'Sports Warriors', 'https://example.com/f1.png'),
(3, 'Gauri Mishra', 'Athlete First', 'https://example.com/g1.png');


-- 4️⃣ UPDATE WINNER FOR FINISHED ELECTION (ELECTION 1)
UPDATE elections
SET winner_candidate_id = 1, status = 'result_declared'
WHERE election_id = 1;


-- 5️⃣ VOTES
INSERT INTO votes (election_id, user_id, candidate_id) VALUES
-- Election 1 (ended)
(1, 2, 1),  -- voter1 → Alice
(1, 3, 2),  -- voter2 → Bob
(1, 4, 1),  -- voter3 → Alice (winner)

-- Election 2 (active)
(2, 2, 4),  -- voter1 → Derek
(2, 3, 5);  -- voter2 → Eva


-- 6️⃣ BANS
INSERT INTO bans (user_id, election_id, reason, banned_by, ban_type) VALUES
(5, 2, 'Misbehavior during campaigning', 1, 'election'),
(3, NULL, 'Permanent misconduct', 1, 'permanent');

