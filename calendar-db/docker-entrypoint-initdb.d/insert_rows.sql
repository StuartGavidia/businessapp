-- insert sample data into `events`
INSERT INTO events (company_id, user_id, title, start_time, end_time, all_day, description, location)
VALUES
(1, 1, 'Quarterly Business Review', '2023-11-01 09:00:00+00', '2023-11-15 11:00:00+00', FALSE, 'Discuss quarterly performance and targets.', 'Conference Room A'),
(1, 3, 'Project Kickoff Meeting', '2023-11-02 13:00:00+00', '2023-11-05 14:30:00+00', FALSE, 'Kickoff meeting for the new project.', 'Conference Room B'),
(2, 3, 'Team Building Activity', '2023-11-05 10:00:00+00', NULL, TRUE, 'Outdoor activities for team bonding.', 'Central Park'),
(2, 4, 'Webinar: Industry Trends', '2023-11-07 15:00:00+00', '2023-11-10 16:30:00+00', FALSE, 'Webinar on the latest trends in the industry.', 'Online');

-- insert sample data into `recurring_events`
INSERT INTO recurring_events (event_id, recurrence_pattern, recurrence_end_date)
VALUES
((SELECT event_id FROM events WHERE title = 'Quarterly Business Review'), 'Monthly on the first Friday', '2024-12-01 09:00:00+00'),
((SELECT event_id FROM events WHERE title = 'Team Building Activity'), 'Yearly', '2025-12-05 10:00:00+00');

-- insert sample data into `event_attendees`
INSERT INTO event_attendees (event_id, user_id, status)
VALUES
((SELECT event_id FROM events WHERE title = 'Quarterly Business Review'), 1, 'Accepted'),
((SELECT event_id FROM events WHERE title = 'Quarterly Business Review'), 3, 'Declined'),
((SELECT event_id FROM events WHERE title = 'Project Kickoff Meeting'), 3, 'Accepted'),
((SELECT event_id FROM events WHERE title = 'Project Kickoff Meeting'), 1, 'Pending'),
((SELECT event_id FROM events WHERE title = 'Webinar: Industry Trends'), 4, 'Accepted'),
((SELECT event_id FROM events WHERE title = 'Webinar: Industry Trends'), 5, 'Accepted');
