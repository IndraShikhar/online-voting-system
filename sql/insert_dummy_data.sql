USE voting_system; 

-- =================================
-- 1️⃣ USERS
-- =================================
INSERT INTO users (username, name, email, password, avatar_url, role) VALUES
('admin_john', 'John Mathew', 'john.admin@example.com', 'hashedpass1', 'https://avatars.example.com/john.png', 'admin'),
('arjun_k', 'Arjun Kumar', 'arjun.k@example.com', 'hashedpass2', 'https://avatars.example.com/arjun.png', 'voter'),
('riya_s', 'Riya Sharma', 'riya.s@example.com', 'hashedpass3', 'https://avatars.example.com/riya.png', 'voter'),
('devansh_p', 'Devansh Patel', 'devansh.p@example.com', 'hashedpass4', 'https://avatars.example.com/devansh.png', 'voter'),
('meera_t', 'Meera Thomas', 'meera.t@example.com', 'hashedpass5', 'https://avatars.example.com/meera.png', 'voter'),
('rahul_m', 'Rahul Mehta', 'rahul.m@example.com', 'hashedpass6', 'https://avatars.example.com/rahul.png', 'voter'),
('isha_v', 'Isha Verma', 'isha.v@example.com', 'hashedpass7', 'https://avatars.example.com/isha.png', 'voter'),
('vivek_d', 'Vivek Dutta', 'vivek.d@example.com', 'hashedpass8', 'https://avatars.example.com/vivek.png', 'voter');


-- =================================
-- 2️⃣ ELECTIONS
-- =================================
-- created_by MUST be user_id (INT) → admin_john = user_id 1
INSERT INTO elections (title, description, start_time, end_time, status, created_by) VALUES
('College President Election 2025',
 'Annual election for the Student Government President.',
 '2025-01-12 09:00:00', '2025-01-12 17:00:00', 'result_declared', 1),

('Tech Club Coordinator Election',
 'Election to choose the coordinator of the Technical Club.',
 '2025-05-01 10:00:00', '2025-05-01 16:00:00', 'active', 1),

('Sports Captain Election',
 'Election for selecting Sports Captain for the college.',
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
-- 4️⃣ WINNER FOR COMPLETED ELECTION (Election 1)
UPDATE elections
SET winner_candidate_id = 2   -- candidate_id 2 (riya_s)
WHERE election_id = 1;


-- =================================
-- 5️⃣ VOTES
-- =================================
INSERT INTO votes (election_id, username, candidate_id) VALUES
-- Election 1
(1, 'arjun_k', 1),
(1, 'devansh_p', 2),
(1, 'meera_t', 2),
(1, 'rahul_m', 1),
(1, 'isha_v', 2),

-- Election 2
(2, 'arjun_k', 4),
(2, 'riya_s', 5);


-- =================================
-- 6️⃣ BANS
-- =================================
INSERT INTO bans (username, election_id, reason, banned_by, ban_type) VALUES
('vivek_d', 2, 'Misconduct during tech club campaigning', 'admin_john', 'election'),
('devansh_p', NULL, 'Repeated violation of code of conduct', 'admin_john', 'permanent');
