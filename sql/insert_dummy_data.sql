USE voting_system;

INSERT INTO users
(user_id, username, name, email, password, avatar_url, role, created_at)
VALUES
(1, 'john_doe', 'john_doe', 'john_doe@example.com', 'password123', NULL, 'admin', '2025-11-13 11:37:09'),
(2, 'jane_do', NULL, 'jane_do@example.com', 'password123', NULL, 'voter', '2025-11-13 11:37:09'),
(3, 'alice_smith', NULL, 'alice_smith@example.com', 'password123', NULL, 'voter', '2025-11-13 11:37:09'),
(4, 'Anahi_Halvorson58', 'Ollie Steuber Jr.', 'Mohamed89@hotmail.com', 'password123', NULL, 'voter', '2025-11-13 15:26:05');

INSERT INTO elections 
(election_id, title, description, start_time, end_time, status, winner_candidate_id, created_by, created_at)
VALUES
(1, 'Product Identity Technician', 'Dynamic', '2026-03-14 04:14:19', '2026-05-04 19:55:07', 'active', NULL, NULL, '2025-11-14 16:43:40'),
(3, 'Senior Data Specialist', 'Product', '2026-07-25 08:06:58', '2026-05-27 08:45:15', 'upcoming', NULL, NULL, '2025-11-14 16:45:55'),
(4, 'Future Markets Agent', 'Human', '2026-10-07 14:09:58', '2026-02-27 08:45:53', 'upcoming', NULL, NULL, '2025-11-14 16:46:26'),
(5, 'International Interactions Developer', 'District', '2026-01-27 00:20:26', '2026-04-01 19:43:28', 'upcoming', NULL, NULL, '2025-11-14 16:47:03'),
(6, 'Forward Branding Orchestrator', 'Corporate', '2025-12-04 16:25:22', '2026-09-30 00:21:04', 'upcoming', NULL, NULL, '2025-11-14 16:47:29'),
(7, 'Dynamic Paradigm Producer', 'Principal', '2026-09-13 11:18:37', '2026-05-01 07:44:27', 'upcoming', NULL, NULL, '2025-11-14 16:48:05'),
(8, 'Forward Applications Agent', 'Internal', '2026-07-21 21:39:56', '2026-09-19 13:34:17', 'upcoming', NULL, NULL, '2025-11-14 16:48:10'),
(9, 'Central Factors Designer', 'Global', '2026-01-01 01:13:25', '2025-11-15 08:04:33', 'upcoming', NULL, 'john_doe', '2025-11-14 16:50:53');


INSERT INTO candidates 
(candidate_id, election_id, username, party, votes, vote_share)
VALUES
(1, 1, 'john_doe', 'Frozen', 0, 0.00),
(2, 1, 'jane_do', 'Frozen', 0, 0.00),
(3, 1, 'alice_smith', 'Rubber', 0, 0.00),
(4, 1, 'Anahi_Halvorson58', 'Rubber', 0, 0.00),

(5, 3, 'john_doe', 'Fresh', 0, 0.00),
(6, 3, 'jane_do', 'Fresh', 0, 0.00),

(7, 5, 'alice_smith', 'Metal', 0, 0.00),
(8, 5, 'Anahi_Halvorson58', 'Wooden', 0, 0.00),

(9, 4, 'john_doe', 'Soft', 0, 0.00),
(11, 4, 'jane_do', 'Fresh', 0, 0.00);


INSERT INTO bans (
    username,
    election_id,
    reason,
    banned_by,
    ban_type,
    banned_at
) VALUES (
    'john_doe',
    NULL,
    NULL,
    'john_doe',
    'permanent',
    '2025-11-13 15:41:24'
);


INSERT INTO votes
(vote_id, election_id, username, candidate_id, timestamp)
VALUES
(2, 1, 'jane_do', 1, '2025-11-14 18:17:58');
