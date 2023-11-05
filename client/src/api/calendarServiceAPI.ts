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
    .then((response: Response) => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error("User not authenticated");
            });
        }
        return response.json();
    })
    .then((data: {message: string}) => {
        console.log(data.message);
    })
  }
}

export default CalendarServiceAPI;
