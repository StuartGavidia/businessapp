import * as React from "react";
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

export const FluidActions = () => {
  return (
    <Dialog>
      <DialogTrigger disableButtonEnhancement>
        <Button>Start New Conversation</Button>
      </DialogTrigger>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Chat Creation</DialogTitle>
          <DialogContent>
            <TextField id="message-textbox" label="Name your new thread!" variant="outlined" />
          </DialogContent>
          <DialogActions fluid>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary">Close</Button>
            </DialogTrigger>
            <Button appearance="primary">Chat</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

export default FluidActions
