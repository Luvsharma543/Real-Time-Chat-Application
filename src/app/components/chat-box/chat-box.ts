import { Component, inject } from '@angular/core';
import { ChatService } from '../../Services/chatService';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AuthService } from '../../Services/auth-service';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-chat-box',
  imports: [MatProgressSpinner,DatePipe,MatIconModule],
  templateUrl: './chat-box.html',
  styleUrl: './chat-box.css'
})
export class ChatBox {
  
  chatService=inject(ChatService);
  authService=inject(AuthService);
  private pageNumber:number=2;
  


  loadMoreMessages()
  {
    this.pageNumber++;
    this.chatService.loadMessages(this.pageNumber);
    

  }

}
