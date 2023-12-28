import { ChatMessage, FluentThemeProvider, MessageThread, SendBox } from '@azure/communication-react';
import { useEffect, useState} from 'react';
import { Stack } from '@fluentui/react';
import {GetHistoryChatMessages, GetLivedChatMessages} from '../../../api/communicationServiceAPI.ts';

export const DefaultMessageThreadExample: React.FC<{ conversationId: string }> = ({ conversationId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(GetHistoryChatMessages);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const chatMessages = await GetLivedChatMessages(conversationId);
        setMessages(chatMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchData();
  }, [conversationId]); // Empty dependency array means this effect runs once after the initial render

  return (
    <FluentThemeProvider>
      <MessageThreadContent messages={messages} setMessages={setMessages} />
    </FluentThemeProvider>
  );
};

// @ts-ignore
const MessageThreadContent = ({ messages, setMessages }) => {
  return (
    <Stack>
      <MessageThread
        userId={'1'}
        messages={messages}
      />
      <SendBox
        onSendMessage={async (content: any) => {
          // Handle sending the message here
          // You can update the `messages` state with the new message
          // and perform the necessary logic for sending messages.
          const newMessage = {
            messageType: 'chat',
            senderId: 'user1',
            senderDisplayName: 'Kat Larsson',
            messageId: Math.random().toString(),
            content: content,
            createdOn: new Date(),
            mine: true,
            attached: false,
            contentType: 'html',
          };

          setMessages([...(messages || []), newMessage]);
        }}
        onTyping={async () => {
          // Handle typing event if needed
        }}
      />
    </Stack>
  );
};
