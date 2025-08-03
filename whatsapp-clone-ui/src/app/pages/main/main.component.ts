import {Component, OnInit} from '@angular/core';
import {ChatListComponent} from "../../components/chat-list/chat-list.component";
import {ChatResponse} from "../../services/models/chat-response";
import {ChatService} from "../../services/services/chat.service";

@Component({
  selector: 'app',
  imports: [
    ChatListComponent
  ],
  templateUrl: './main.component.html',
  standalone: true,
  styleUrl: './main.component.scss'
})

export class MainComponent implements OnInit {
  chats: Array<ChatResponse> = [];

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.getAllChats();

  }

  private getAllChats(): void {
    this.chatService.getChatsByRecipient()
      .subscribe({next: res => {
          this.chats = res;
        }});
  }

}
