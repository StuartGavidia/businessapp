import {
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  DialogContent,
  Button,
} from "@fluentui/react-components";
import {TextField} from "@fluentui/react";
import {useState} from "react";
import CommunicationServiceAPI from "../../../api/communicationServiceAPI"

const FluidActions = () => {
  const [threadName, setThreadName] = useState("");
  const handleChatButtonClick = async () => {
    try {
      console.log("Button works");
      await CommunicationServiceAPI.getInstance().onChatButton(threadName);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <Dialog>
      <DialogTrigger disableButtonEnhancement>
        <Button>Start New Conversation</Button>
      </DialogTrigger>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Chat Creation</DialogTitle>
          <DialogContent>
            <TextField id="message-textbox"
                       label="Name your new thread!"
                       variant="outlined"
                       value={threadName}
                       onChange={(e) => setThreadName(e.target.value)}/>
          </DialogContent>
          <DialogActions fluid>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary">Close</Button>
            </DialogTrigger>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="primary" onClick={handleChatButtonClick}>Chat</Button>
            </DialogTrigger>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

export default FluidActions;
