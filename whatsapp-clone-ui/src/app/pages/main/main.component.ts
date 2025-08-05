import {Component, OnInit} from '@angular/core';
import {ChatListComponent} from "../../components/chat-list/chat-list.component";
import {ChatResponse} from "../../services/models/chat-response";
import {ChatService} from "../../services/services/chat.service";
import {KeycloakService} from "../../utils/keycloak/keycloak.service";
import {MessageService} from "../../services/services/message.service";
import {MessageResponse} from "../../services/models/message-response";
import {DatePipe, NgOptimizedImage} from "@angular/common";
import {PickerComponent} from "@ctrl/ngx-emoji-mart";
import {FormsModule} from "@angular/forms";
import {EmojiData} from "@ctrl/ngx-emoji-mart/ngx-emoji";
import {MessageRequest} from "../../services/models/message-request";

@Component({
  selector: 'app',
  imports: [ChatListComponent, DatePipe, PickerComponent, FormsModule, NgOptimizedImage],
  templateUrl: './main.component.html',
  standalone: true,
  styleUrl: './main.component.scss'
})

export class MainComponent implements OnInit {

  chats: Array<ChatResponse> = [];
  selectedChat: ChatResponse = {};
  chatMessages: MessageResponse[] = [];
  showEmojis = false;
  messageContent = "";

  constructor(
    private chatService: ChatService,
    private keycloakService: KeycloakService,
    private messageService: MessageService
  ) {
  }

  ngOnInit(): void {
    this.getAllChats();

  }

  private getAllChats(): void {
    this.chatService.getChatsByRecipient()
      .subscribe({
        next: res => {
          this.chats = res;
        }
      });
  }

  logout() {
    this.keycloakService.logout();
  }

  userProfile() {
    this.keycloakService.accountManagement();
  }

  chatSelected(chatResponse: ChatResponse) {
    this.selectedChat = chatResponse;
    this.getAllChatMessages(chatResponse.id as string);
    this.setMessagesToSeen();
    this.selectedChat.unreadCount = 0;
  }

  private getAllChatMessages(chatId: string) {
    this.messageService
      .getMessages(
        {"chat-id": chatId})
      .subscribe({
        next: messages => {
          this.chatMessages = messages;
        }
      });
  }

  private setMessagesToSeen() {
    this.messageService.setMessagesToSeen({
      'chat-id': this.selectedChat.id as string,
    }).subscribe({
      next: message => {}
    })
  }

  isSelfMessage(message: MessageResponse) {
    return message.senderId === this.keycloakService.userId;
  }

  uploadMedia(target: EventTarget | null) {

  }

  onSelectEmojis(selectedEmoji: any) {
    const emoji: EmojiData = selectedEmoji.emoji;
    this.messageContent += emoji.native;
  }

  keyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }

  onClick() {
    this.setMessagesToSeen();
  }

  sendMessage() {
    if(this.messageContent) {
      const messageRequest: MessageRequest = {
        chatId: this.selectedChat.id,
        senderId: this.getSenderId(),
        recipientId: this.getRecipientId(),
        content: this.messageContent,
        messageType: 'TEXT'
      };
      this.messageService.saveMessage({
        body: messageRequest,
      }).subscribe({
        next: () => {
          const message: MessageResponse = {
            senderId: this.getSenderId(),
            recipientId: this.getRecipientId(),
            content: this.messageContent,
            type: 'TEXT',
            state: 'SENT',
            createdAt: new Date().toString(),
          };
          this.selectedChat.lastMessageDate = this.messageContent;
          this.chatMessages.push(message);
          this.messageContent = "";
          this.showEmojis = false;
        }
      })
    }
  }

  private getSenderId() {
    if (this.selectedChat.senderId === this.keycloakService.userId) {
      return this.selectedChat.senderId as string;
    }
    return this.selectedChat.recipientId as string;
  }

  private getRecipientId() {
    if (this.selectedChat.senderId === this.keycloakService.userId) {
      return this.selectedChat.recipientId as string;
    }
    return this.selectedChat.senderId as string;
  }
}
