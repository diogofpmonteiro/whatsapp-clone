import {Component, input, InputSignal, output} from '@angular/core';
import {ChatResponse} from "../../services/models/chat-response";
import {DatePipe, NgOptimizedImage} from "@angular/common";
import {UserResponse} from "../../services/models/user-response";
import {UserService} from "../../services/services/user.service";
import {ChatService} from "../../services/services/chat.service";
import {KeycloakService} from "../../utils/keycloak/keycloak.service";

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  standalone: true,
  imports: [
    DatePipe,
  ],
  styleUrl: './chat-list.component.scss'
})

export class ChatListComponent {
  chats: InputSignal<ChatResponse[]> = input<ChatResponse[]>([]);
  searchNewContact = false;
  contacts: Array<UserResponse> = [];
  chatSelected = output<ChatResponse>();

  constructor(
    private userService: UserService,
    private chatService: ChatService,
    private keycloakService: KeycloakService) {
  }

  searchContact() {
    const res = this.userService.getAllUsers()
      .subscribe({
        next: users => {
          this.contacts = users;
          this.searchNewContact = true;
        }
      })
  }

  selectContact(contact: UserResponse) {
    this.chatService.createChat({
      'sender-id': this.keycloakService.userId as string,
      "recipient-id": contact.id as string
    })
      .subscribe({
        next: res => {
          const chat: ChatResponse = {
            id: res.response,
            name: contact.firstName + ' ' + contact.lastName,
            recipientOnline: contact.online,
            lastMessage: contact.lastSeen,
            senderId: this.keycloakService.userId,
            recipientId: contact.id,
          };
          this.chats().unshift(chat);
          this.searchNewContact = false;
          this.chatSelected.emit(chat);
        }
      })
  }

  chatClicked(chat: ChatResponse) {
    this.chatSelected.emit(chat);
  }

  wrapMessage(lastMessage: string | undefined) {
    if (lastMessage && lastMessage.length <= 20) {
      return lastMessage;
    }
    return lastMessage?.substring(0, 17) + '...';
  }
}
