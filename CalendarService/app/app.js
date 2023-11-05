const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');

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
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, 'we_need_to_change_this', (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    //ataching token to request for subsequent functions
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

    eventAttendees.append({userId: userId, status: status})
    for (const attendee of eventAttendees) {
      await pool.query(insertAttendeeText, [eventId, attendee.userId, attendee.status]);
    }

    await pool.query('COMMIT');

    res.status(201).json({ message: 'Event created successfully', eventId });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error creating event', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.listen(PORT, HOST, () => {
  // eslint-disable-next-line no-console
  console.log(`Running on http://${HOST}:${PORT}`);
});
