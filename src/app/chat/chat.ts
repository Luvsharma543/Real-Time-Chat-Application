import { Component, inject } from '@angular/core';
import { ChatSidebar } from "../components/chat-sidebar/chat-sidebar";
import { ChatWindow } from '../components/chat-window/chat-window';
import { ChatRightSidebar } from "../components/chat-right-sidebar/chat-right-sidebar";
import { ChatService } from '../Services/chatService';

@Component({
  selector: 'app-chat',
  imports: [ChatSidebar, ChatWindow, ChatRightSidebar],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class Chat {
  chatService=inject(ChatService)
}
