-- ==============================
-- 1️⃣ USERS
-- ==============================
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100),
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(1000),
    role ENUM('voter', 'admin') DEFAULT 'voter',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================
-- 2️⃣ ELECTIONS
-- ==============================
CREATE TABLE elections (
    election_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    status ENUM('upcoming', 'active', 'ended', 'result_declared') DEFAULT 'upcoming',
    winner_candidate_id INT DEFAULT NULL,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL
);

-- ==============================
-- 3️⃣ CANDIDATES (updated here)
-- ==============================
-- Each candidate *is* a user.
CREATE TABLE candidates (
    candidate_id INT AUTO_INCREMENT PRIMARY KEY,
    election_id INT NOT NULL,
    username VARCHAR(50) NOT NULL,          -- 🔥 new: link candidate → user
    party VARCHAR(100),
    votes INT DEFAULT 0,
    vote_share DECIMAL(5,2) DEFAULT 0,
    FOREIGN KEY (election_id) REFERENCES elections(election_id) ON DELETE CASCADE,
    FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE,
    UNIQUE (election_id, username)   -- 🔥 one candidature per election
);

-- Link election winner to candidate
ALTER TABLE elections
ADD CONSTRAINT fk_winner_candidate
FOREIGN KEY (winner_candidate_id) REFERENCES candidates(candidate_id)
ON DELETE SET NULL;

-- ==============================
-- 4️⃣ VOTES
-- ==============================
CREATE TABLE votes (
    vote_id INT AUTO_INCREMENT PRIMARY KEY,
    election_id INT NOT NULL,
    username VARCHAR(50) NOT NULL,
    candidate_id INT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (election_id) REFERENCES elections(election_id) ON DELETE CASCADE,
    FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE,
    FOREIGN KEY (candidate_id) REFERENCES candidates(candidate_id) ON DELETE CASCADE,
    UNIQUE (election_id, username)
);


-- ==============================
-- 5️⃣ BANS
-- ==============================
CREATE TABLE bans (
    ban_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    election_id INT DEFAULT NULL,
    reason VARCHAR(255),
    banned_by VARCHAR(50),
    ban_type ENUM('election', 'permanent') NOT NULL,
    banned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE,
    FOREIGN KEY (election_id) REFERENCES elections(election_id) ON DELETE CASCADE,
    FOREIGN KEY (banned_by) REFERENCES users(username) ON DELETE SET NULL,
    UNIQUE (username, election_id)
);

