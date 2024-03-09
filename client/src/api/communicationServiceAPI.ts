// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.


import {ChatMessage, MessageStatus} from '@azure/communication-react';

class CommunicationServiceAPI {
  private static instance: CommunicationServiceAPI;

  private constructor() {
    // private constructor so no outsider can create an instance
  }

  public static getInstance(): CommunicationServiceAPI {
    if (!CommunicationServiceAPI.instance) {
      CommunicationServiceAPI.instance = new CommunicationServiceAPI();
    }
    return CommunicationServiceAPI.instance;
  }

  public async GetLivedChatMessages(conversationID : string): Promise<ChatMessage[]> {
    try {
      const response = await fetch(`/communication/messages/${conversationID}`);
      const data = await response.json();

      return data.map((message: ChatMessage) => ({
        messageType: message.messageType,
        senderId: message.senderId,
        senderDisplayName: message.senderDisplayName,
        messageId: message.messageId,
        content: message.content,
        mine: message.mine,
        attached: message.attached,
        contentType: message.contentType,
      }));
    } catch (error) {
      console.error('Error:', error);
      // Handle the error as needed, e.g., throw it or return a default value.
      throw error;
    }
  };

  public GetHistoryChatMessages() : ChatMessage[] {
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

  public async GetConversationThreads(): Promise<{ conversationId: string, title: string }[]> {
    try{
      const response = await fetch(`/communication/conversations/`);
      const data = await response.json();
      return data.map((conversation: { conversationId: never; title: never; }) => ({
        conversationId: conversation.conversationId,
        title: conversation.title,
      }));
    }
    catch (error){
      console.error('Error:', error);
      // Handle the error as needed, e.g., throw it or return a default value.
      throw error;
    }
  };

  public async SendMessages(newMessage : any){
    try {
      // Make the API call to add the message to the conversation
      return await fetch('/communication/conversations/addMessage', {
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
  };

  public async onChatButton(threadName: string){
    try{
      const response = await fetch('/communication/createThread', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId: Math.random().toString(),
          participants: ["12345", "67890", "11111"],
          createdAt: new Date().toISOString(),
          title: threadName,
        }),
      });
      if (!response.ok) {
        console.error("Error creating thread:", response.statusText);
      }
    }
    catch (error){
      console.error('Error:', error);
      throw error;
    }
  }

  public async addParticipantsButton(conversationId: string, userId: string){
    try{
      console.log(userId);
      const response = await fetch('/communication/conversations/addParticipant', {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId: conversationId,
          userId: userId
        }),
      });
      if (!response.ok) {
        console.error("Error creating thread:", response.statusText);
      }
    }
    catch(error){
      console.error('Error:', error);
      throw error;
    }
  }
}

export default CommunicationServiceAPI;

