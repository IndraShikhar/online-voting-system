CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('voter', 'admin') DEFAULT 'voter',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================
-- 2️⃣ ELECTIONS TABLE
-- ==============================
-- Handles multiple elections at once

-- Step 1️⃣: Create 'elections' table (without the winner foreign key)
CREATE TABLE elections (
    election_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    status ENUM('upcoming', 'active', 'ended', 'result_declared') DEFAULT 'upcoming',
    winner_candidate_id INT DEFAULT NULL,  -- foreign key added later
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL
);

-- Step 2️⃣: Create 'candidates' table
CREATE TABLE candidates (
    candidate_id INT AUTO_INCREMENT PRIMARY KEY,
    election_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    party VARCHAR(100),
    avatar_url VARCHAR(1000),
    votes INT DEFAULT 0,
    vote_share DECIMAL(5,2) DEFAULT 0,
    FOREIGN KEY (election_id) REFERENCES elections(election_id) ON DELETE CASCADE
);

-- Step 3️⃣: Add 'winner_candidate_id' foreign key to 'elections'
ALTER TABLE elections
ADD CONSTRAINT fk_winner_candidate
FOREIGN KEY (winner_candidate_id) REFERENCES candidates(candidate_id)
ON DELETE SET NULL;



-- ==============================
-- 4️⃣ VOTES TABLE
-- ==============================
-- Records votes across all elections

CREATE TABLE votes (
    vote_id INT AUTO_INCREMENT PRIMARY KEY,
    election_id INT NOT NULL,
    user_id INT NOT NULL,
    candidate_id INT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (election_id) REFERENCES elections(election_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (candidate_id) REFERENCES candidates(candidate_id) ON DELETE CASCADE,
    UNIQUE (election_id, user_id) -- one vote per user per election
);

-- ==============================
-- 5️⃣ BANS TABLE (Unified)
-- ==============================
-- Handles both election-specific and permanent bans

CREATE TABLE bans (
    ban_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    election_id INT DEFAULT NULL,
    reason VARCHAR(255),
    banned_by INT,
    ban_type ENUM('election', 'permanent') NOT NULL,
    banned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (election_id) REFERENCES elections(election_id) ON DELETE CASCADE,
    FOREIGN KEY (banned_by) REFERENCES users(user_id) ON DELETE SET NULL,
    UNIQUE (user_id, election_id)
);