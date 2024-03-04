import './Communication.css';
import {useEffect, useState} from 'react';
import MessageThreadPicker from './components/MessageThreadPicker';
import { DefaultMessageThreadExample } from './components/MessageThread';

// Import Fluent UI components
import { Stack, Text } from '@fluentui/react';
import CommunicationServiceAPI from "../../api/communicationServiceAPI";

interface MessageThread {
  conversationId: string;
  title: string;
}

function App() {
  const [selectedMessageThread, setSelectedMessageThread] = useState<string | null>(null);
  const [messageThreads, setMessageThreads] = useState<MessageThread[]>([]);

  useEffect(() => {
    const fetchMessageThreads = async () => {
      try {
        const conversationThreads = await CommunicationServiceAPI.getInstance().GetConversationThreads();
        setMessageThreads(conversationThreads);
      } catch (error) {
        console.error('Error fetching conversation threads:', error);
      }
    };

    fetchMessageThreads();
  }, []);

  const handleSelectMessageThread = (conversationId: string) => {
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
        conversationId={selectedMessageThread}
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
