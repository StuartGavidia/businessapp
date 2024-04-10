import { useEffect, useRef, useState, KeyboardEvent, MouseEvent } from "react";
import { Calendar } from "react-date-range";
import format from 'date-fns/format'
import './CalendarComp.css'

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

interface CalendarCompProps {
  onSelect: (date: Date) => void;
  
}

const CalendarComp: React.FC<CalendarCompProps> = ({ onSelect }) => {

  const [calendar, setCalendar] = useState('')

  //open, close calendar view
  const [open, setOpen] = useState(false)

  //get the target element to toggle
  const refOne = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hideOnEscape = (e: any) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    const hideOnClickOutside = (e: any) => {
      if (refOne.current && !refOne.current.contains(e.target)) {
        setOpen(false);
      }
    };

    setCalendar(format(new Date(), 'MM/dd/yyyy'));
    document.addEventListener('keydown', hideOnEscape);
    document.addEventListener('click', hideOnClickOutside, true);

    return () => {
      document.removeEventListener('keydown', hideOnEscape);
      document.removeEventListener('click', hideOnClickOutside, true);
    };
  }, []);

  const handleSelect = (date: Date) => {
    setCalendar(format(date, 'MM/dd/yyyy'));
    onSelect(date);
  }

  return (
    <div className="calendarWrap" style={{ marginBottom: '14px', position: 'relative' }}>

      <input
        value={ calendar }
        readOnly
        className="inputBox"
        style={{ padding: '5.2px', marginLeft: '10px', textAlign: 'justify', backgroundColor: '#ECE3CE', border: '1px solid black', borderRadius: '5px', fontWeight: 'lighter'}}
        onClick={() => setOpen(open => !open)}

      />

      <div ref={refOne} style={{ position: 'absolute', top: '100%', left: 0, zIndex: 1000 }}>
        {open && (
          <div style={{ position: 'relative', top: '0', left: '0' }}>
          <Calendar
            date={new Date(calendar)}
            onChange={handleSelect}
          />
          </div>
        )}
      </div>

    </div>
  )
}

export default CalendarComp
