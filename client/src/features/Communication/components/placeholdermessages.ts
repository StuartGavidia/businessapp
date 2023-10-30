// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// @ts-ignore
import { ChatMessage, MessageStatus} from '@azure/communication-react';

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
        },
        {
            messageType: 'chat',
            senderId: 'user2',
            senderDisplayName: 'Robert Tolbert',
            messageId: Math.random().toString(),
            content: 'Nice! This looks great!',
            createdOn: new Date('2019-04-13T00:00:00.000+08:09'),
            mine: false,
            attached: false,
            contentType: 'text'
        },
        {
            messageType: 'chat',
            senderId: 'user3',
            senderDisplayName: 'Carole Poland',
            messageId: Math.random().toString(),
            content: "Yeah agree, let's chat here from now on!",
            createdOn: new Date('2019-04-13T00:00:00.000+08:09'),
            mine: false,
            attached: false,
            contentType: 'text'
        },
        {
            messageType: 'chat',
            senderId: 'user1',
            senderDisplayName: 'Kat Larsson',
            messageId: Math.random().toString(),
            content: 'OK, perfect!',
            createdOn: new Date('2019-04-13T00:00:00.000+08:10'),
            mine: true,
            attached: false,
            contentType: 'text'
        }
    ];
};
