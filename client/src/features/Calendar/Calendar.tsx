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
import Container from 'react-bootstrap/Container'
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Select from 'react-select';
import { useState, useEffect } from 'react'
import UserServiceAPI from '../../api/userServiceAPI'
import { MultiValue } from 'react-select';
import CalendarServiceAPI from '../../api/calendarServiceAPI'
import { useAppConfig } from '../../providers/AppConfigProvider'
import { convertDateToString, formatDate } from '../../utils/date'

interface EventStructure {
  action: string,
  type: string,
  canEdit?: boolean
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
  status: string,
  id?: string
}

interface EventDatabase {
  title: string,
  description: string,
  start_time: string,
  location: string,
  end_time: string,
  user_id: string,
  decsription: string,
  event_attendees: Employee[],
  event_id: string
}

interface EmployeeHashMap {
  [key: string]: Omit<Employee, 'userId'>;
}

const Calendar:React.FC = () => {


  const { appConfig } = useAppConfig();
  const appConfigUserId = appConfig.userId;
  const [showEventModal, setShowEventModal] = useState(false)
  const [eventStructure, setEventStructure] = useState<EventStructure>({ action: '', type: '', canEdit: false });
  const [eventData, setEventData] = useState<EventData>({
    title: '',
    location: '',
    description: '',
    startTime: '',
    endTime: '',
    eventAttendees: [],
    status: '',
    id: ''
  })

  interface ExtendedProps {
    userId: string,
    location: string,
    description: string,
    attendees: Employee[],
    id: string
  }

  interface Event {
    title: string,
    start: string,
    end: string,
    extendedProps: ExtendedProps
  }

  interface EmployeeDatabase {
    company_id: string,
    last_name: string,
    first_name: string,
    position_name: string,
    status: string,
    user_id: string,
    username: string
  }

  const [events, setEvents] = useState<Event[]>([])

  const [employeeOptions, setEmployeeOptions] = useState<Employee[]>([])

  useEffect(() => {
    const fetchEmployeesAndEvents = async () => {
      try {
        // Fetch employees and update state
        const employees: EmployeeDatabase[] = await UserServiceAPI.getInstance().usersInCompany();
        const employeeOptions: Employee[] = employees
          .map(employee => ({
            userId: employee.user_id,
            firstName: employee.first_name, // Assuming the actual property is 'first_name'
            lastName: employee.last_name,   // Assuming the actual property is 'last_name'
            label: `${employee.first_name} ${employee.last_name}`,
            picture: "../assets/images/defaultProfilePicture.jpeg",
            status: employee.status
          }));

        // Use the employeeOptions just fetched to build the employeeMap
        const employeeMap: EmployeeHashMap = employeeOptions.reduce((map, employee) => {
          const { userId, ...rest } = employee;
          map[userId] = rest;
          return map;
        }, {} as EmployeeHashMap);

        // Fetch events
        const eventsData = await CalendarServiceAPI.getInstance().fetchEvents();
        console.log(eventsData)

        // Process and map events data
        const events = eventsData.map((event: EventDatabase) => {
          return {
            title: event.title,
            start: event.start_time,
            end: event.end_time,
            extendedProps: {
              userId: event.user_id,
              location: event.location,
              description: event.description,
              attendees: event.event_attendees.map((attendee: Employee) => {
                let eventEmployee = employeeMap[attendee.userId];
                return {
                  userId: attendee.userId,
                  picture: eventEmployee?.picture || "../assets/images/defaultProfilePicture.jpeg",
                  status: attendee.status,
                  firstName: eventEmployee?.firstName,
                  lastName: eventEmployee?.lastName,
                  label: eventEmployee ? `${eventEmployee.firstName} ${eventEmployee.lastName}` : '',
                };
              }),
              id: event.event_id
            }
          };
        });

        // Finally set the state for both employee options and events
        setEmployeeOptions(employeeOptions);
        setEvents(events);
      } catch (e) {
        console.error("Fetching employees or events failed", e);
      }
    };

    fetchEmployeesAndEvents();
  }, [appConfigUserId]); // Include this if appConfigUserId can change, otherwise it can be omitted or left empty


  const handleFormSubmit = async () => {
    let eventId: string | undefined = eventData.id || undefined

    if (eventStructure.action == "Add" || eventStructure.action == "Create") {
      try {
        eventId = await CalendarServiceAPI.getInstance().createEvent(eventData);
      } catch (err: unknown) {
        if (err instanceof Error) {
            console.log(err.message)
        } else {
            console.log("An error occured, event will not persist")
        }
      }

      setEvents(prev => [
        ...prev,
        {
          title: eventData.title,
          start: eventData.startTime,
          end: eventData.endTime,
          extendedProps: {
            userId: appConfigUserId || "",
            location: eventData.location,
            description: eventData.description,
            attendees: eventData.eventAttendees.map(attendee => ({
              ...attendee,
              picture: attendee.picture || "../assets/images/defaultProfilePicture.jpeg", // Provide a default picture path if `picture` is undefined
              label: attendee.label || `${attendee.firstName} ${attendee.lastName}`, // Construct a default label if `label` is undefined
              status: attendee.status || 'Pending', // Provide a default status if `status` is undefined
            })),
            id: eventId || ""
          }
        }
      ]);
    } else {
      try {
        await CalendarServiceAPI.getInstance().updateEvent(eventId || "2", eventData);
      } catch(err: unknown) {
        if (err instanceof Error) {
          console.log(err.message)
        } else {
          console.log("An error occured, event will not persist")
        }
      }

      setEvents((prevEvents) => {
        const eventIndex = prevEvents.findIndex(event => event.extendedProps.id === eventId);

        if (eventIndex === -1) return prevEvents;

        const newEventValues = {
          title: eventData.title,
          start: eventData.startTime,
          end: eventData.endTime,
          extendedProps: {
            userId: appConfigUserId || "",
            location: eventData.location,
            description: eventData.description,
            attendees: eventData.eventAttendees.map(attendee => ({
              ...attendee,
              picture: attendee.picture || "../assets/images/defaultProfilePicture.jpeg", // Provide a default picture path if `picture` is undefined
              label: attendee.label || `${attendee.firstName} ${attendee.lastName}`, // Construct a default label if `label` is undefined
              status: attendee.status || 'Pending', // Provide a default status if `status` is undefined
            })),
            id: eventId || ""
          }
        }

        const updatedEvents = [...prevEvents];
        updatedEvents[eventIndex] = {
          ...updatedEvents[eventIndex],
          ...newEventValues,
        };

        return updatedEvents;
      });
    }

    setEventData({
      title: '',
      location: '',
      description: '',
      startTime: '',
      endTime: '',
      eventAttendees: [],
      status: '',
      id: ''
    })
    setEventStructure(prev => ({ action: 'Create', type: 'Meeting Event', canEdit: false }));
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

    const eventUserId = info.event.extendedProps.userId
    const canEdit = appConfigUserId == eventUserId

    setEventStructure(prev => ({ ...prev, action: "View", type: 'Event', canEdit: canEdit }));

    const startDate = info.event.start
    const endDate = info.event.end
    const startStr = convertDateToString(startDate)
    const endStr = convertDateToString(endDate)
    const location = info.event.extendedProps.location
    const title = info.event.title
    const description = info.event.extendedProps.description
    const attendees = info.event.extendedProps.attendees
    const eventId = info.event.extendedProps.id
    const currentAttendee = info.event.extendedProps.attendees.find((attendee: Employee) => {
      return attendee.userId == appConfigUserId
    })
    const status = currentAttendee.status

    setEventData(prevData => ({
      ...prevData,
      startTime: startStr,
      endTime: endStr,
      location: location,
      title: title,
      description: description,
      eventAttendees: attendees,
      id: eventId,
      status: status
    }));

    toggleEventModal()
  }

  const handleSelect = (selectionInfo:any) => {
    //ensure reset of eventData
    setEventData(
      {
        title: '',
        location: '',
        description: '',
        startTime: '',
        endTime: '',
        eventAttendees: [],
        status: '',
        id: ''
      }
    )

    setEventStructure(prev => ({ ...prev, action: 'Add', type: 'Event' }));
    const startStr = selectionInfo.startStr
    const endStr = selectionInfo.endStr

    setEventData(prevData => ({
      ...prevData,
      startTime: startStr + "T00:00",
      endTime: endStr + "T00:00"
    }));

    toggleEventModal()
  }

  const handleCreateMeeting = () => {
    setEventData({
      title: '',
      location: '',
      description: '',
      startTime: '',
      endTime: '',
      eventAttendees: [],
      status: '',
      id: ''
    })
    setEventStructure(prev => ({ ...prev, action: 'Create', type: 'Meeting Event' }));
    toggleEventModal()
  };

  const handleEventMouseEnter = (info: any) => {
    info.el.style.borderColor = 'blue';
  }

  const handleEventMouseLeave = (info: any) => {
    info.el.style.borderColor = '';
  }

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

  const handleEditClick = () => {
    setEventStructure(prev => ({ ...prev, action: 'Edit' }));
  }

  const handleDeleteClick = async () => {
    try {
      await CalendarServiceAPI.getInstance().deleteEvent(eventData.id || "")
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log(err.message)
      } else {
        console.log("An error occured, event will not persist")
      }
    }

    setEvents(prevEvents => {
      const eventToDeleteIndex = prevEvents.findIndex(event => event.extendedProps.id == eventData.id);

      if (eventToDeleteIndex !== -1) {
        const updatedEvents = [
          ...prevEvents.slice(0, eventToDeleteIndex),
          ...prevEvents.slice(eventToDeleteIndex + 1)
        ];
        return updatedEvents;
      }

      //return original if events already not present
      return prevEvents;
    });

    setEventData({
      title: '',
      location: '',
      description: '',
      startTime: '',
      endTime: '',
      eventAttendees: [],
      status: '',
      id: ''
    })
    toggleEventModal()
  }

  const handleStatusChange = async (status: string) => {
    try {
      await CalendarServiceAPI.getInstance().updateAttendeeStatus(eventData.id || "", appConfigUserId || "", status)
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log(err.message)
      } else {
        console.log("An error occured, event will not persist")
      }
    }

    setEventData(prev => {
      return {
        ...prev,
        attendees: prev.eventAttendees.map(attendee => {
          if (attendee.userId == appConfigUserId) {
            return {
              ...attendee,
              status: status
            }
          }
          return attendee
        }),
        status: status
      }
    })

    setEvents((prevEvents) => {
      const eventIndex = prevEvents.findIndex(event => event.extendedProps.id === eventData.id);

      if (eventIndex === -1) return prevEvents;

      const newEventValues = {
        title: eventData.title,
        start: eventData.startTime,
        end: eventData.endTime,
        extendedProps: {
          userId: appConfigUserId || "",
          location: eventData.location,
          description: eventData.description,
          attendees: eventData.eventAttendees.map(attendee => {
            if (attendee.userId == appConfigUserId) {
              return {
                ...attendee,
                picture: attendee.picture || "../assets/images/defaultProfilePicture.jpeg", // Provide a default picture path if `picture` is undefined
                label: attendee.label || `${attendee.firstName} ${attendee.lastName}`, // Construct a default label if `label` is undefined
                status: status || 'Pending', // Provide a default status if `status` is undefined
                }
            }
            return {
              ...attendee,
              picture: attendee.picture || "../assets/images/defaultProfilePicture.jpeg", // Provide a default picture path if `picture` is undefined
              label: attendee.label || `${attendee.firstName} ${attendee.lastName}`, // Construct a default label if `label` is undefined
              status: attendee.status || 'Pending', // Provide a default status if `status` is undefined
              }
          }),
          id: eventData.id || ""
        }
      }

      const updatedEvents = [...prevEvents];
      updatedEvents[eventIndex] = {
        ...updatedEvents[eventIndex],
        ...newEventValues,
      };

      return updatedEvents;
    });

    toggleEventModal()
  }

  const formatOptionLabel = ({ label, picture }: Employee) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Image src={picture} alt={label} style={{ marginRight: '10px', width: '30px', height: '30px', borderRadius: '50%' }} />
      <div>{label}</div>
    </div>
  );

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
        events={events}
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

          {
            eventStructure.action == "View" ? (
              <Container>
                <Row>
                  <Col md={6}>
                    <p className="fw-bold mb-2">Title</p>
                    <p>{eventData.title}</p>
                  </Col>
                  <Col md={6}>
                    <p className="fw-bold mb-2">Location</p>
                    <p>{eventData.location}</p>
                  </Col>
                </Row>
                <p className="fw-bold mb-2">Description</p>
                <p>{eventData.description}</p>
                <Row>
                  <Col md={6}>
                    <p className="fw-bold mb-2">Start Time</p>
                    <p>{formatDate(eventData.startTime)}</p>
                  </Col>
                  <Col md={6}>
                    <p className="fw-bold mb-2">End Time</p>
                    <p>{formatDate(eventData.endTime)}</p>
                  </Col>
                </Row>
                <p>Attendees:</p>
                <ListGroup as="ol">
                  {
                    eventData.eventAttendees.map((employee: Employee) => {
                      return (
                        <ListGroup.Item
                          as="li"
                          className="d-flex justify-content-between align-items-start"
                        >
                          <div className="ms-2 me-auto">
                            <div className="fw-bold">{employee.label}</div>
                          </div>
                          <Badge bg="primary" pill>
                            {employee.status}
                          </Badge>
                        </ListGroup.Item>
                      )
                    })
                  }
                </ListGroup>
              </Container>
            ) :
            (
              <Form>
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
                        value={eventData.title}
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
                        value={eventData.location}
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
                    value={eventData.description}
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
                        value={eventData.startTime}
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
                        value={eventData.endTime}
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
            )
          }
        </Modal.Body>
        <Modal.Footer>
          {
            eventStructure.action == "View" && eventStructure.canEdit &&
            <Button variant="primary" onClick={handleEditClick}>
              Edit
            </Button>
          }
          {
            eventStructure.action == "View" && eventStructure.canEdit &&
            <Button variant="danger" onClick={handleDeleteClick}>
              Delete
            </Button>
          }
          {
            (eventStructure.action == "Edit" || eventStructure.action == "Add" || eventStructure.action == "Create")
            &&
            <Button variant="primary" onClick={handleFormSubmit}>
              Save Changes
            </Button>
          }
          {
            eventStructure.action == "View" &&
            <DropdownButton id="update-status" title="Update your Status">
              <Dropdown.Item as="button" onClick={() => handleStatusChange("Accepted")}>Accepted</Dropdown.Item>
              <Dropdown.Item as="button" onClick={() => handleStatusChange("Pending")}>Pending</Dropdown.Item>
              <Dropdown.Item as="button" onClick={() => handleStatusChange("Declined")}>Declined</Dropdown.Item>
            </DropdownButton>
          }
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Calendar
