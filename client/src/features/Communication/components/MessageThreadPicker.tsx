import React from 'react';
import { Stack } from '@fluentui/react';
import StartConversationModal from "./NewThread";
import AddParticipantModal from "./AddParticipants.tsx";
import Button from "react-bootstrap/Button";

interface messageThreadType {
  id: number,
  title: string
}

class MessageThreadPicker extends React.Component<{ messageThreads: any, onSelectMessageThread: any, conversationId: any }> {
  render() {
    const {messageThreads, onSelectMessageThread, conversationId} = this.props;
    const handleSelect = (messageThreadId: any) => {
      onSelectMessageThread(messageThreadId);
    };

    return (
      <Stack verticalAlign="start" tokens={{childrenGap: 10}} styles={{root: {width: '250px'}}}>
        <Stack horizontal verticalAlign="center">
          <StartConversationModal/>
          <AddParticipantModal conversationId={conversationId}/>
        </Stack>
        {messageThreads.map((messageThread: messageThreadType) => (
          <Button
            key={messageThread.id}
            onClick={() => handleSelect(messageThread.id)}
            className="button-color"
          >
            {messageThread.title}
          </Button>
        ))}
      </Stack>
    );
  }
}

export default MessageThreadPicker
