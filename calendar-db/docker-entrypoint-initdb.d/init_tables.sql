CREATE TABLE events (
  event_id SERIAL PRIMARY KEY,
  company_id INT NOT NULL,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  all_day BOOLEAN DEFAULT FALSE,
  description TEXT,
  location TEXT
);

CREATE TABLE recurring_events (
  recurring_event_id SERIAL PRIMARY KEY,
  event_id INT,
  recurrence_pattern TEXT NOT NULL,
  recurrence_end_date TIMESTAMP WITH TIME ZONE,
  FOREIGN KEY (event_id) REFERENCES events (event_id) ON DELETE CASCADE
);

CREATE TABLE event_attendees (
  event_attendee_id SERIAL PRIMARY KEY,
  event_id INT REFERENCES events(event_id) ON DELETE CASCADE,
  user_id INT NOT NULL,
  status VARCHAR(50)
);
