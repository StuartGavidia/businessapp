import { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import CommunicationServiceAPI from '../../../api/communicationServiceAPI';
import UserServiceAPI from "../../../api/userServiceAPI.ts";

const AddParticipantModal = ({ conversationId }: { conversationId: string }) => {
  const [userId, setUserId] = useState('');
  const [employeeOptions, setEmployeeOptions] = useState([{ key: '', text: '' }]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchEmployeeOptions = async () => {
      try {
        const employees = await UserServiceAPI.getInstance().usersInCompany();
        const userIds = employees.map((user: any) => ({
          key: user.user_id.toString(),
          text: `${user.first_name} ${user.last_name}`,
        }));
        setEmployeeOptions(userIds);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching employee options:', error);
      }
    };

    fetchEmployeeOptions();
  }, []);

  const handleChatButtonClick = async () => {
    try {
      await CommunicationServiceAPI.getInstance().addParticipantsButton(conversationId, userId);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <Button onClick={() => setShowModal(true)} disabled={!conversationId}>Add Participants</Button>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Participants</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <Dropdown>
              <Dropdown.Toggle variant="primary">Add Participants</Dropdown.Toggle>
              <Dropdown.Menu>
                {employeeOptions.map(option => (
                  <Dropdown.Item
                    key={option.key}
                    onClick={() => {
                      setUserId(option.key);
                    }}
                  >
                    {option.text}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleChatButtonClick} disabled={!conversationId}>
            Chat
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddParticipantModal;
