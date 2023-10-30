import './Communication.css';
import React, { useState } from 'react';
import MessageThreadPicker from './components/MessageThreadPicker';
import { DefaultMessageThreadExample } from './components/MessageThread';

// Import Fluent UI components
import { Stack, Text } from '@fluentui/react';


function App() {
  const [selectedMessageThread, setSelectedMessageThread] = useState(null);

  const messageThreads = [
    { id: 1, title: 'MessageThread 1' },
    { id: 2, title: 'MessageThread 2' },
    // Add more MessageThreads as needed
  ];

  const handleSelectMessageThread = (messageThreadId) => {
    setSelectedMessageThread(messageThreadId);
  };

  return (
    <Stack horizontal>
      <MessageThreadPicker
        messageThreads={messageThreads}
        onSelectMessageThread={handleSelectMessageThread}
      />
      <Stack grow>
        {selectedMessageThread ? (
          <DefaultMessageThreadExample messageThreadId={selectedMessageThread} />
        ) : (
          <div className="bg-light p-3">
            <Text variant="xLarge">Select a MessageThread to view</Text>
          </div>
        )}
      </Stack>
    </Stack>
  );
}

export default App;
