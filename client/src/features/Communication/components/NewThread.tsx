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

export const FluidActions = () => {
  const [threadName, setThreadName] = useState("");
  const onChatButton = async () => {
    try{
      console.log("Button works");
      const response = await fetch('http://localhost:5103/communication/createThread', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId: Math.random().toString(),
          participants: ["12345", "67890", "11111"],
          createdAt: new Date().toISOString(),
          title: threadName,
        }),
      });
      window.location.reload();
      if (!response.ok) {
        console.error("Error creating thread:", response.statusText);
      }
    }
    catch (error){
      console.error('Error:', error);
      throw error;
    }
  }
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
              <Button appearance="primary" onClick={onChatButton}>Chat</Button>
            </DialogTrigger>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

export default FluidActions
