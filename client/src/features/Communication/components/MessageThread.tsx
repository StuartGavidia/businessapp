import { ChatMessage, MessageThread, SendBox } from '@azure/communication-react';
import { useEffect, useState} from 'react';
import {Stack} from '@fluentui/react';
import CommunicationServiceAPI from '../../../api/communicationServiceAPI';

export const DefaultMessageThreadExample: React.FC<{ conversationId: string }> = ({ conversationId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(CommunicationServiceAPI.getInstance().GetHistoryChatMessages());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const chatMessages = await CommunicationServiceAPI.getInstance().GetLivedChatMessages(conversationId);
        setMessages(chatMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchData();
  }, [conversationId]); // Empty dependency array means this effect runs once after the initial render

  return (
      <div>
       <MessageThreadContent messages={messages} setMessages={setMessages} conversationId={conversationId}/>
      </div>
  );
};

const MessageThreadContent = ({ messages, setMessages, conversationId }) => {

  return (
    <Stack>
      <MessageThread
        userId={'1'}
        messages={messages}
        styles={{ root: { background: 'blue' } }}
      />
      <SendBox
        onSendMessage={async (content: any) => {
          // Handle sending the message here
          // You can update the `messages` state with the new message
          // and perform the necessary logic for sending messages.
          const newMessage = {
            messageType: 'chat',
            senderId: '',
            senderDisplayName: '',
            messageId: Math.random().toString(),
            conversationId: conversationId,
            content: content,
            mine: true,
            attached: false,
            contentType: 'html',
          };

          setMessages([...(messages || []), newMessage]);
          await CommunicationServiceAPI.getInstance().SendMessages(newMessage);

        }}
        onTyping={async () => {
          // Handle typing event if needed
        }}
      />
    </Stack>
  );
};
