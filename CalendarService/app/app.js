const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');

const pool = new Pool({
  user: 'username',
  host: 'calendar-db',
  database: 'calendar-db',
  password: 'password',
  port: 5432,
});

const app = express();
app.use(bodyParser.json());

const PORT = 5104;
const HOST = '0.0.0.0';

const authenticate = (req, res, next) => {
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies.user_cookie;

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, 'we_need_to_change_this', (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.user = user;

    next();
  });
}

app.get('/calendar', (req, res) => {
  res.send('hello');
});

app.post('/calendar/event', authenticate, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const companyId = req.user.company_id;
    const { title, location, description, startTime, endTime, eventAttendees, status } = req.body;

    await pool.query('BEGIN');

    const insertEventText = `
      INSERT INTO events (company_id, user_id, title, start_time, end_time, description, location)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING event_id;
    `;
    const eventValues = [companyId, userId, title, startTime, endTime, description, location];
    const eventResult = await pool.query(insertEventText, eventValues);
    const eventId = eventResult.rows[0].event_id;

    const insertAttendeeText = `
      INSERT INTO event_attendees (event_id, user_id, status)
      VALUES ($1, $2, $3);
    `;

    eventAttendees.unshift({userId: userId, status: status})
    for (const attendee of eventAttendees) {
      await pool.query(insertAttendeeText, [eventId, attendee.userId, attendee.status]);
    }

    await pool.query('COMMIT');

    res.status(201).json({ message: 'Event created successfully', eventId: eventId });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error creating event', error);
    res.status(500).json({ error: 'Internal server error' + error.message });
  }
})

app.get('/calendar/event', authenticate, async (req, res) => {
  try {
    const userId = req.user.user_id;

    await pool.query('BEGIN');

    const eventsQuery = `
      SELECT
        e.event_id,
        e.user_id as user_id,
        e.title,
        e.start_time,
        e.end_time,
        e.description,
        e.location,
        COALESCE(json_agg(
          json_build_object(
            'userId', ea.user_id,
            'status', ea.status
          ) ORDER BY ea.user_id
        ) FILTER (WHERE ea.user_id IS NOT NULL), '[]') AS event_attendees
      FROM
        events e
      LEFT JOIN
        event_attendees ea ON e.event_id = ea.event_id
      WHERE
        e.user_id = $1 OR
        EXISTS (
          SELECT 1 FROM event_attendees ea2 WHERE ea2.event_id = e.event_id AND ea2.user_id = $1
        )
      GROUP BY
        e.event_id
      ORDER BY
        e.start_time;
    `;

    const { rows } = await pool.query(eventsQuery, [userId]);

    await pool.query('COMMIT');

    res.status(200).json({ message: 'Fetched all events successfully', events: rows });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error fetching events for user', error);
    res.status(500).json({ error: 'Internal server error' + error.message});
  }
});

app.delete('/calendar/event', authenticate, async (req, res) => {
  const { event_id } = req.body;

  const userId = req.user.user_id;

  await pool.query('BEGIN');

  try {
    const ownerCheckQuery = 'SELECT user_id FROM events WHERE event_id = $1';
    const ownerCheckResult = await pool.query(ownerCheckQuery, [event_id]);

    if (ownerCheckResult.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ error: 'Event not found' });
    }
    if (ownerCheckResult.rows[0].user_id !== userId) {
      await pool.query('ROLLBACK');
      return res.status(403).json({ error: 'User is not authorized to delete this event' });
    }

    const deleteEventQuery = 'DELETE FROM events WHERE event_id = $1';
    await pool.query(deleteEventQuery, [event_id]);

    await pool.query('COMMIT');

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error deleting event', error);
    res.status(500).json({ error: 'Internal server error' + error.message });
  }
});

app.put('/calendar/event', authenticate, async (req, res) => {
  const { event_id, title, startTime, endTime, allDay, description, location } = req.body;
  const userId = req.user.user_id;

  await pool.query('BEGIN');

  try {
    const ownerCheckQuery = 'SELECT user_id FROM events WHERE event_id = $1 AND user_id = $2';
    const ownerCheckResult = await pool.query(ownerCheckQuery, [event_id, userId]);

    if (ownerCheckResult.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ error: 'Event not found or user is not authorized to modify this event' });
    }

    const updateEventText = `
      UPDATE events
      SET title = $1, start_time = $2, end_time = $3, all_day = $4, description = $5, location = $6
      WHERE event_id = $7;
    `;
    const updateValues = [title, startTime, endTime, allDay, description, location, event_id];
    await pool.query(updateEventText, updateValues);

    await pool.query('COMMIT');

    res.status(200).json({ message: 'Event updated successfully' });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error updating event', error);
    res.status(500).json({ error: 'Internal server error'});
  }
});

app.put('/calendar/event/attendee/status', authenticate, async (req, res) => {
  const { event_id, user_id, status } = req.body;

  await pool.query('BEGIN');

  try {
    const updateStatusQuery = `
      UPDATE event_attendees
      SET status = $1
      WHERE event_id = $2 AND user_id = $3;
    `;

    const result = await pool.query(updateStatusQuery, [status, event_id, user_id]);

    if (result.rowCount === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ error: 'Attendee status not found or user is not authorized to update' });
    }

    await pool.query('COMMIT');

    res.status(200).json({ message: 'Attendee status updated successfully' });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error updating attendee status', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, HOST, () => {
  // eslint-disable-next-line no-console
  console.log(`Running on http://${HOST}:${PORT}`);
});
