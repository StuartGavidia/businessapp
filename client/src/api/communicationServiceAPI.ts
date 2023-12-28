// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// @ts-ignore
import {ChatMessage, MessageStatus} from '@azure/communication-react';

export const GetLivedChatMessages = async (conversationID : string): Promise<ChatMessage[]> => {
  try {
    const response = await fetch(`http://localhost:5103/communication/messages/${conversationID}`);
    const data = await response.json();

    const chatMessages: ChatMessage[] = data.map((message: ChatMessage) => ({
      messageType: message.messageType,
      senderId: message.senderId,
      senderDisplayName: message.senderDisplayName,
      messageId: message.messageId,
      content: message.content,
      mine: message.mine,
      attached: message.attached,
      contentType: message.contentType,
    }));
    return chatMessages;
  } catch (error) {
    console.error('Error:', error);
    // Handle the error as needed, e.g., throw it or return a default value.
    throw error;
  }
};

// This is some mock messages for example purposes.
// For actual projects, you can get chat messages from declarative/selectors for ACS.
export const GetHistoryChatMessages = (): ChatMessage[] => {
  return [
    {
      messageType: 'chat',
      senderId: 'user1',
      senderDisplayName: 'Kat Larsson',
      messageId: Math.random().toString(),
      content: 'Hi everyone, I created this awesome group chat for us!',
      createdOn: new Date('2019-04-13T00:00:00.000+08:10'),
      mine: true,
      attached: false,
      status: 'seen' as MessageStatus,
      contentType: 'html'
    }
  ];
};




export const GetConversationThreads = async (): Promise<{ conversationId: string, title: string }[]> => {
  try{
    const userId = "12345";
    const response = await fetch(`http://localhost:5103/communication/conversations/${userId}`);
    const data = await response.json();
    const conversationThreads = data.map((conversation: { conversationId: any; title: any; }) => ({
      conversationId: conversation.conversationId,
      title: conversation.title,
    }));
    return conversationThreads;
  }
  catch (error){
    console.error('Error:', error);
    // Handle the error as needed, e.g., throw it or return a default value.
    throw error;
  }
}

export const SendMessages = async (newMessage: any)=> {
  try {
    // Make the API call to add the message to the conversation
    return await fetch('http://localhost:5103/communication/conversations/addMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newMessage),
    });

    // Optionally, you can handle the response if needed
  } catch (error) {
    console.error('Error adding message to conversation:', error);
    // Handle error as needed
  }
}
