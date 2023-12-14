

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
