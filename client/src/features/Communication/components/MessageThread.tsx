import { ChatMessage, FluentThemeProvider, MessageStatus, MessageThread, SendBox } from '@azure/communication-react';
import React, { useState } from 'react';
import { Stack, Text } from '@fluentui/react';
import { GetHistoryChatMessages } from './placeholdermessages';

export const DefaultMessageThreadExample: () => JSX.Element = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(GetHistoryChatMessages());

  return (
    <FluentThemeProvider>
      <MessageThreadContent messages={messages} setMessages={setMessages} />
    </FluentThemeProvider>
  );
};

const MessageThreadContent = ({ messages, setMessages, selectedMessageThread }) => {


  return (
    <Stack>
      <MessageThread
        userId={'1'}
        messages={messages}
        onUpdateMessage={async (id: string, _content: any, metadata: any) => {
          const updated = messages.map((m) =>
            m.messageId === id
              ? { ...m, metadata, failureReason: 'Failed to edit', status: 'failed' as MessageStatus }
              : m
          );
          setMessages(updated);
          return Promise.reject('Failed to update');
        }}
        onCancelEditMessage={(id: any) => {
          const updated = messages.map((m) =>
            m.messageId === id ? { ...m, failureReason: undefined, status: undefined } : m
          );
          setMessages(updated);
        }}
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
            contentType: 'html'
          };

          setMessages([...messages, newMessage]);
        }}
        onTyping={async () => {
          // Handle typing event if needed
        }}
      />
    </Stack>
  );
};
