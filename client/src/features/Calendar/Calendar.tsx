import './Calendar.css'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useState } from 'react'

const Calendar:React.FC = () => {

  const [showEventModal, setShowEventModal] = useState(false)
  const [showMeetingModal, setShowMeetingModal] = useState(false)

  const [modalAction, setModalAction] = useState("")

  const toggleEventModal = () => {
    setShowEventModal((prev: boolean) => !prev)
  }

  const toggleMeetingModal = () => {
    setShowMeetingModal((prev: boolean) => !prev)
  }

  const handleCreateMeeting = () => {
    toggleMeetingModal()
  };

  const handleEventClick = (info:any) => {
    //TODO: we need to add a check to see if it is a meeting event(as that will contain different data)
    //after confirming it is a meeting event, then toggle that modal instead

    //this code prevents url navigations
    info.jsEvent.preventDefault();
    if (info.event.url) {
      window.open(info.event.url);
    }

    console.log(info)
    setModalAction("Edit")
    toggleEventModal()
  }

  const handleSelect = (selectionInfo:any) => {
    console.log(selectionInfo)
    setModalAction("Add")
    toggleEventModal()

  }

  const handleEventMouseEnter = (info: any) => {
    info.el.style.borderColor = 'blue';
  }

  const handleEventMouseLeave = (info: any) => {
    info.el.style.borderColor = '';
  }

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
          <Modal.Title>{modalAction} Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>The form will go here that contains event data</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleEventModal}>
            Close
          </Button>
          <Button variant="primary" onClick={toggleEventModal}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showMeetingModal} onHide={toggleMeetingModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalAction} Meeting</Modal.Title>
        </Modal.Header>
        <Modal.Body>The form will contain meeting form fields</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleMeetingModal}>
            Close
          </Button>
          <Button variant="primary" onClick={toggleMeetingModal}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Calendar
