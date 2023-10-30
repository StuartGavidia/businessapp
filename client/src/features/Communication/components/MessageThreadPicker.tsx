import React from 'react';
import { Stack, Text, DefaultButton } from '@fluentui/react';

const MessageThreadPicker = ({ messageThreads, onSelectMessageThread }) => {
  const handleSelect = (messageThreadId) => {
    onSelectMessageThread(messageThreadId);
  };

  return (
    <Stack verticalAlign="start" tokens={{ childrenGap: 10 }} styles={{ root: { width: '250px' } }}>
      <Text variant="xLarge">Welcome to Communication!</Text>
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
