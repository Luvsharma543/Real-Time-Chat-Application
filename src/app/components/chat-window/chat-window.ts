import { Component, inject } from '@angular/core';
import { ChatService } from '../../Services/chatService';
import { TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { ChatBox } from "../chat-box/chat-box";
import { VideoChatService } from '../../Services/video-chatService';
import { MatDialog } from '@angular/material/dialog';
import { VideoChat } from '../../video-chat/video-chat';

@Component({
  selector: 'app-chat-window',
  imports: [TitleCasePipe, FormsModule, MatIcon, ChatBox],
  templateUrl: './chat-window.html',
  styleUrl: './chat-window.css'
})
export class ChatWindow {
   
  chatService=inject(ChatService);
  signalRService=inject(VideoChatService);
  dialog=inject(MatDialog)
  message:string='';
  
  ngOnInit() {
  if (this.chatService.input) {
    this.message = '';
    this.chatService.input = false; // Reset the flag after initializing the message
  }
}
 
 displayDialog(receiverId:string){
 this.signalRService.remoteUserId=receiverId;
 this.dialog.open(VideoChat,{
  width:'400px',
  height:'600px',
  disableClose:false,
  autoFocus:false
 });
}

  sendMessage(){
    if(!this.message)
      return

    this.chatService.sendMessage(this.message);
    this.message='';
  }

  
 
}
