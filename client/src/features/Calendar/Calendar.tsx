import './Calendar.css'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Select from 'react-select';
import { useState, useRef, useEffect } from 'react'
import UserServiceAPI from '../../api/userServiceAPI'
import { MultiValue } from 'react-select';
import CalendarServiceAPI from '../../api/calendarServiceAPI'
import { useAppConfig } from '../../providers/AppConfigProvider'

interface EventStructure {
  action: string,
  type: string,
}

interface Employee {
  userId: string;
  firstName: string,
  lastName: string,
  picture?: string,
  status?: string;
  label?: string;
}

interface EventData {
  title: string,
  location: string,
  description: string,
  startTime: string, //YYYY-MM-DDTHH:MM
  endTime: string, //YYYY-MM-DDTHH:MM,
  eventAttendees: Employee[],
  status: string
}


const Calendar:React.FC = () => {

  const [showEventModal, setShowEventModal] = useState(false)
  const [eventStructure, setEventStructure] = useState<EventStructure>({ action: '', type: '' });
  const [eventData, setEventData] = useState<EventData>({
    title: '',
    location: '',
    description: '',
    startTime: '',
    endTime: '',
    eventAttendees: [],
    status: ''
  })

  const { setAppConfig } = useAppConfig();

  const formRef = useRef<HTMLFormElement>(null);

  const handleModalSubmit = () => {
    if (formRef.current instanceof HTMLFormElement) {
      formRef.current.submit();
    }
  }

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    //TODO: handle put requests to update an event, we can just check the eventStructure action

    try {
      await CalendarServiceAPI.getInstance().createEvent(eventData);
    } catch (err: unknown) {
      if (err instanceof Error) {
          console.log(err.message)
      } else {
          console.log("An error occured")
      }
    }

    setEventData({
      title: '',
      location: '',
      description: '',
      startTime: '',
      endTime: '',
      eventAttendees: [],
      status: ''
    })
    toggleEventModal()
  };

  const toggleEventModal = () => {
    setShowEventModal((prev: boolean) => !prev)
  }

  const handleEventClick = (info:any) => {
    //this code prevents url navigations
    info.jsEvent.preventDefault();
    if (info.event.url) {
      window.open(info.event.url);
    }

    const { appConfig } = useAppConfig();
    const userId = appConfig.userId

    //TODO: check if event was created by user
    //only user who created event can modify. Everyone else can only update status
    //as a side note, it might be helpful to create an appconfig (singleton)
    //Next TODO: need to add additional props to event objects which includes userId for who created

    console.log(info)
    setEventStructure(prev => ({ ...prev, action: 'Edit', type: 'Event' }));

    //TODO: fetch event data and prepulate the eventData
    //Also when event modal is toggled, the data should show the data not an editable visual
    //meaning we need to add an edit button to allow the modifcation of the data(we can do this with
    //help of setEventStructure above?)


    toggleEventModal()
  }

  const handleSelect = (selectionInfo:any) => {
    console.log(selectionInfo)
    setEventStructure(prev => ({ ...prev, action: 'Add', type: 'Event' }));

    //TODO: using what is selected, preset the startTime and endTIme for event

    toggleEventModal()
  }

  const handleCreateMeeting = () => {
    setEventStructure(prev => ({ ...prev, action: 'Create', type: 'Meeting Event' }));
    toggleEventModal()
  };

  const handleEventMouseEnter = (info: any) => {
    info.el.style.borderColor = 'blue';
  }

  const handleEventMouseLeave = (info: any) => {
    info.el.style.borderColor = '';
  }

  const [data, setData] = useState(undefined)

  useEffect(() => {
    //test for getting users in company - remove after testing
    const fetchData = async () => {
      try {
        const result = await UserServiceAPI.getInstance().usersInCompany();
        console.log(result)
        console.log(data)
        setData(result);
      } catch (e) {
        console.error("Does not work", e);
      }
    };
    fetchData();
  }, [])

  const handleEventChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
      const { name, value } = event.target;
      setEventData(prevData => ({
        ...prevData,
        [name]: value
      }));
  }

  const handleAttendeesEventChange = (
    event: MultiValue<Employee>
  ) => {
    const selectedOptions = event as MultiValue<Employee>;
    const attendees: Employee[] = selectedOptions.map(event => {
      return {userId: event.userId, firstName: event.firstName, lastName: event.lastName, status: "Pending", label: event.label, picture: event.picture}
    })
      setEventData(prevData => ({
        ...prevData,
        eventAttendees: attendees
      }));
  }

  const formatOptionLabel = ({ label, picture }: Employee) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Image src={picture} alt={label} style={{ marginRight: '10px', width: '30px', height: '30px', borderRadius: '50%' }} />
      <div>{label}</div>
    </div>
  );

  //TODO: fetch employees in company in database
  //When we do this fetch, we can also fetch the events and populate
  //TODO: check if we can fetch employees only when the Select component appears or is clicked in
  //instead of 'only' on component mount
  const employees: Employee[] = [
    {
      userId: "1",
      firstName: "Joe",
      lastName: "John",
      picture: "../assets/images/defaultProfilePicture.jpeg"
    },
    {
      userId: "2",
      firstName: "Jimmy",
      lastName: "John",
      picture: "../assets/images/defaultProfilePicture.jpeg"
    },
    {
      userId: "3",
      firstName: "Lebron",
      lastName: "James",
      picture: "../assets/images/defaultProfilePicture.jpeg"
    }
  ]

  const employeeOptions: Employee[] = employees.map(employee => ({
    userId: employee.userId,
    firstName: employee.firstName,
    lastName: employee.lastName,
    label: `${employee.firstName} ${employee.lastName}`,
    picture: employee.picture || "../assets/images/defaultProfilePicture.jpeg"
  }));

  return (
    <>
      <FullCalendar
        plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin ]}
        initialView="dayGridMonth"
        selectable={true}
        headerToolbar={{
          start: 'prev,next today myCustomButton',
          center: 'title',
          end: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        navLinks={true}
        themeSystem="standard"
        customButtons={{
          myCustomButton: {
            text: 'Create Meeting',
            click: handleCreateMeeting,
          }
        }}
        titleFormat={{ year: 'numeric', month: 'long', day: 'numeric' }}
        events={[
          { title: 'event 1', date: '2023-10-01' },
          { title: 'event 2', date: '2023-10-02' }
        ]}
        eventClick={handleEventClick}
        eventMouseEnter={handleEventMouseEnter}
        eventMouseLeave={handleEventMouseLeave}
        select={handleSelect}
      />
      <Modal show={showEventModal} onHide={toggleEventModal}>
        <Modal.Header closeButton>
          <Modal.Title>{eventStructure.action} {eventStructure.type}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form ref={formRef} onSubmit={handleFormSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="title">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Title"
                    autoFocus
                    name="title"
                    onChange={handleEventChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="location">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Location"
                    autoFocus
                    name="location"
                    onChange={handleEventChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group
              className="mb-3"
              controlId="description"
            >
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                onChange={handleEventChange}
                required
              />
            </Form.Group>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="startTime">
                  <Form.Label>Start Time</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    autoFocus
                    name="startTime"
                    onChange={handleEventChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="endTime">
                  <Form.Label>End Time</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="endTime"
                    onChange={handleEventChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group as={Row} className="mb-3" controlId="eventAttendees">
              <Form.Label column sm={2}>
                Attendees
              </Form.Label>
              <Col sm={10}>
                <Select
                  isMulti
                  name="attendees"
                  options={employeeOptions}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  formatOptionLabel={formatOptionLabel}
                  getOptionValue={option => option.userId}
                  onChange={handleAttendeesEventChange}
                  value={eventData.eventAttendees}
                />
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleEventModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleModalSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Calendar
