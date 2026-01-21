
-- Not needed since we are using SQLite
-- Create DATABASE mrms_app;
-- use mrms_app;

-- Need to update schema as now it will insert sample rooms everytime theres a restart in the server

-- Drop tables if they exist (for clean setup)
-- DROP TABLE IF EXISTS bookings;
-- DROP TABLE IF EXISTS rooms;

-- Meeting Rooms Table
CREATE TABLE IF NOT EXISTS rooms (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    capacity INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(255) PRIMARY KEY,
    room_id VARCHAR(255) NOT NULL,
    ic_number TEXT NOT NULL,
    date TIMESTAMP NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms(id),
    UNIQUE(room_id, date, start_time)
);

-- Insert sample rooms
-- INSERT INTO rooms (id, name, capacity) VALUES 
--     ('1', 'Conference Room A', 10),
--     ('2', 'Meeting Room B', 6),
--     ('3', 'Huddle Room C', 4);