import { Component, inject } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../Services/auth-service';
import { Router } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { ChatService } from '../../Services/chatService';
import { User} from '../../Models/user';
import { TypingIndicator } from '../typing-indicator/typing-indicator';
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-chat-sidebar',
  imports: [MatButtonModule, MatIconModule, MatMenuModule, TitleCasePipe, FormsModule],
  templateUrl: './chat-sidebar.html',
  styleUrl: './chat-sidebar.css'
})
export class ChatSidebar {
  
   

  constructor(public authService: AuthService, public chatService: ChatService, private router: Router){
    this.chatService.startConnection(this.authService.getToken()!);
    this.authService.saveCurrentUser();
    console.log(this.authService.currentLoggedUser);
    
  }

  search:string="";

  logout(){
    this.authService.logout();
    this.router.navigateByUrl("/login");
  }

  openChatWindow(user:User){
    if(this.chatService.input)
    this.chatService.currentOpenedChat.set(user);
    this.chatService.loadMessages(1);
    this.chatService.MessageReadOrNot();
    user.unreadCount=0;
    this.chatService.inputChange();
  }

  onSearchFilter(){
    this.chatService.filterUsers(this.search);
  }
 
}
