import {Component, input, InputSignal, output} from '@angular/core';
import {ChatResponse} from "../../services/models/chat-response";
import {DatePipe, NgOptimizedImage} from "@angular/common";
import {UserResponse} from "../../services/models/user-response";
import {UserService} from "../../services/services/user.service";

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

    constructor(private userService: UserService) {}

  searchContact() {
      const res = this.userService.getAllUsers()
        .subscribe({
          next: users => {
            this.contacts = users;
            this.searchNewContact = true;
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

  selectContact(contact: UserResponse) {

  }
}
