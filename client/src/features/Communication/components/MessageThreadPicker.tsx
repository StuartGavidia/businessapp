import React from 'react';
import { Stack, Text, DefaultButton } from '@fluentui/react';
import FluidActions from "./NewThread";
import { FluentProvider, webLightTheme } from '@fluentui/react-components';


const MessageThreadPicker = ({ messageThreads, onSelectMessageThread }) => {
  const handleSelect = (messageThreadId) => {
    onSelectMessageThread(messageThreadId);
  };

  return (
    <Stack verticalAlign="start" tokens={{ childrenGap: 10 }} styles={{ root: { width: '250px' } }}>
      <Stack horizontal verticalAlign="center">
        <FluentProvider theme={webLightTheme}><FluidActions/></FluentProvider>
      </Stack>
      {messageThreads.map((messageThread) => (
        <DefaultButton
          key={messageThread.id}
          text={messageThread.title}
          onClick={() => handleSelect(messageThread.id)}
        />
      ))}
    </Stack>
  );
};

export default MessageThreadPicker
