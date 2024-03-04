import { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import CommunicationServiceAPI from "../../../api/communicationServiceAPI";

const StartConversationModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [threadName, setThreadName] = useState("");

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleChatButtonClick = async () => {
    try {
      console.log("Button works");
      await CommunicationServiceAPI.getInstance().onChatButton(threadName);
      handleClose();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Start New Conversation
      </Button>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Chat Creation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="message-textbox">
            <Form.Label>Name your new thread!</Form.Label>
            <Form.Control
              type="text"
              value={threadName}
              onChange={(e) => setThreadName(e.target.value)}
              className="border border-primary"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleChatButtonClick}>
            Chat
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default StartConversationModal;
