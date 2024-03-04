import React from 'react';
import { Stack, DefaultButton } from '@fluentui/react';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import StartConversationModal from "./NewThread";
import AddParticipantModal from "./AddParticipants.tsx";

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
          <FluentProvider theme={webLightTheme}><StartConversationModal/></FluentProvider>
          <FluentProvider theme={webLightTheme}><AddParticipantModal conversationId={conversationId}/></FluentProvider>
        </Stack>
        {messageThreads.map((messageThread: messageThreadType) => (
          <DefaultButton
            key={messageThread.id}
            text={messageThread.title}
            onClick={() => handleSelect(messageThread.id)}
          />
        ))}
      </Stack>
    );
  }
}

export default MessageThreadPicker
