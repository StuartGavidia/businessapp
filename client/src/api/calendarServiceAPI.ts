class CalendarServiceAPI {
  private static instance: CalendarServiceAPI;

  private constructor() {
    // private constructor so no outsider can create an instance
  }

  public static getInstance(): CalendarServiceAPI {
    if (!CalendarServiceAPI.instance) {
      CalendarServiceAPI.instance = new CalendarServiceAPI();
    }
    return CalendarServiceAPI.instance;
  }

  public async createEvent(eventData: any) {
    return await fetch('/calendar/event', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
    })
    .then(this.handleResponse)
    .then((data: { eventId: string}) => {
        return data.eventId
    })
  }

  public async fetchEvents(): Promise<any> {
    return await fetch('/calendar/events', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(this.handleResponse)
    .then((data: { message: string; events: any[] }) => {
      return data.events;
    });
  }

  public async updateEvent(eventId: string, updateData: any): Promise<string> {
    return fetch(`/calendar/event`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ event_id: eventId, ...updateData }),
    })
    .then(this.handleResponse)
    .then((data: { message: string }) => {
      return data.message;
    });
  }

  public async deleteEvent(eventId: string): Promise<string> {
    return fetch('/calendar/events', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ event_id: eventId }),
    })
    .then(this.handleResponse)
    .then((data: { message: string }) => {
      return data.message;
    });
  }

  public async updateAttendeeStatus(eventId: string, userId: string, status: string): Promise<string> {
    return fetch('/calendar/event/attendee/status', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ event_id: eventId, user_id: userId, status: status }),
    })
    .then(this.handleResponse)
    .then((data: { message: string }) => {
      return data.message;
    });
  }

  private handleResponse(response: Response): Promise<any> {
    if (!response.ok) {
      return response.json().then(data => {
        throw new Error(data.error || 'Server error');
      });
    }
    return response.json();
  }
}

export default CalendarServiceAPI;
