export interface Notification {
  chatId?: string;
  content?: string;
  senderId?: string;
  recipientId?: string;
  messageType?: 'TEXT' | 'AUDIO' | 'IMAGE' | 'VIDEO';
  type: 'SEEN' | 'MESSAGE' | 'IMAGE' | 'VIDEO' | 'AUDIO';
  chatName?: string;
  media?: Array<string>;
}
