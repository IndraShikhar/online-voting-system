USE voting_system

-- =================================
-- 1️⃣ USERS
-- =================================
INSERT INTO users (username, name, email, password, avatar_url, role, is_banned) VALUES
('admin_john', 'John Mathew', 'john.admin@example.com', 'password123', 'https://i.pravatar.cc/150?img=1', 'admin', 0),
('arjun_k', 'Arjun Kumar', 'arjun.k@example.com', 'password123', 'https://i.pravatar.cc/150?img=2', 'voter', 0),
('riya_s', 'Riya Sharma', 'riya.s@example.com', 'password123', 'https://i.pravatar.cc/150?img=3', 'voter', 0),
('devansh_p', 'Devansh Patel', 'devansh.p@example.com', 'password123', 'https://i.pravatar.cc/150?img=4', 'voter', 1), -- permanently banned example
('meera_t', 'Meera Thomas', 'meera.t@example.com', 'password123', 'https://i.pravatar.cc/150?img=5', 'voter', 0),
('rahul_m', 'Rahul Mehta', 'rahul.m@example.com', 'password123', 'https://i.pravatar.cc/150?img=6', 'voter', 0),
('isha_v', 'Isha Verma', 'isha.v@example.com', 'password123', 'https://i.pravatar.cc/150?img=7', 'voter', 0),
('vivek_d', 'Vivek Dutta', 'vivek.d@example.com', 'password123', 'https://i.pravatar.cc/150?img=8', 'voter', 0);


-- =================================
-- 2️⃣ ELECTIONS (created_by → admin user_id = 1)
-- =================================
INSERT INTO elections (title, description, start_time, end_time, status, created_by) VALUES
('College President Election 2025',
 'Main election for Student Government President.',
 '2025-01-12 09:00:00', '2025-01-12 17:00:00', 'result_declared', 1),

('Tech Club Coordinator Election',
 'Election for selecting Tech Club coordinator.',
 '2025-05-01 10:00:00', '2025-05-01 16:00:00', 'active', 1),

('Sports Captain Election',
 'Election for choosing the Sports Captain.',
 '2025-12-10 09:00:00', '2025-12-10 17:00:00', 'upcoming', 1);


-- =================================
-- 3️⃣ CANDIDATES
-- =================================
INSERT INTO candidates (election_id, username, party) VALUES
-- Election 1
(1, 'arjun_k', 'United Students Front'),
(1, 'riya_s', 'Youth Alliance'),
(1, 'devansh_p', 'Independent'),

-- Election 2
(2, 'meera_t', 'Tech Visionaries'),
(2, 'rahul_m', 'Code Innovators'),

-- Election 3
(3, 'isha_v', 'Athlete Squad'),
(3, 'vivek_d', 'Sports United');


-- =================================
-- 4️⃣ WINNER FOR ELECTION 1
-- (Assuming candidate_id 2 = riya_s)
-- =================================
UPDATE elections
SET winner_candidate_id = 2
WHERE election_id = 1;


-- =================================
-- 5️⃣ VOTES
-- =================================
INSERT INTO votes (election_id, username, candidate_id) VALUES
-- Election 1 (result_declared)
(1, 'arjun_k', 1),
(1, 'riya_s', 2),
(1, 'meera_t', 2),
(1, 'rahul_m', 1),
(1, 'isha_v', 2),

-- Election 2 (active)
(2, 'arjun_k', 4),
(2, 'riya_s', 5);


-- =================================
-- 6️⃣ BANS
-- =================================
INSERT INTO bans (username, election_id, reason, banned_by, ban_type) VALUES
('vivek_d', 2, 'Misconduct during Tech Club campaigning', 'admin_john', 'election'),
('devansh_p', NULL, 'Permanent violation of behavioral policies', 'admin_john', 'permanent');
