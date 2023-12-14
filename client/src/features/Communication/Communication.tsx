import './Communication.css';
import React, {useEffect, useState} from 'react';
import MessageThreadPicker from './components/MessageThreadPicker';
import { DefaultMessageThreadExample } from './components/MessageThread';

// Import Fluent UI components
import { Stack, Text } from '@fluentui/react';
import {GetConversationThreads} from "./components/GetConversations";


function App() {
  const [selectedMessageThread, setSelectedMessageThread] = useState(null);
  const [messageThreads, setMessageThreads] = useState([]);

  useEffect(() => {
    const fetchMessageThreads = async () => {
      try {
        const conversationThreads = await GetConversationThreads();
        setMessageThreads(conversationThreads);
      } catch (error) {
        console.error('Error fetching conversation threads:', error);
      }
    };

    fetchMessageThreads();
  }, []);

  const handleSelectMessageThread = (conversationId) => {
    setSelectedMessageThread(conversationId);
  };

  return (
    <Stack horizontal>
      <MessageThreadPicker
        messageThreads={messageThreads.map(({ conversationId, title }) => ({
          id: conversationId,
          title: title,
        }))}
        onSelectMessageThread={handleSelectMessageThread}
      />
      <Stack grow>
        {selectedMessageThread ? (
          <DefaultMessageThreadExample conversationId={selectedMessageThread} />
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
