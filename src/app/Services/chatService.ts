import { inject, Injectable, signal } from '@angular/core';
import { AuthService } from './auth-service';
import { User } from '../Models/user';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { UserDto } from '../Models/userDto';
import { Message } from '../Models/message';

@Injectable({
  providedIn: 'root'
})
export class ChatService{

  users: User[] = [];
  private authService = inject(AuthService);
  storedUser:UserDto|null=JSON.parse(localStorage.getItem("user")!);

  // private hubUrl = "https://localhost:5000/chathub";
  private hubUrl = "https://ishant543.bsite.net/chathub";
  private hubConnection?: HubConnection;

  onlineUser= signal<User[]>([]);
  onlineUserSearch= signal<User[]>([]);
  currentOpenedChat= signal<User|null>(null);
  chatMessages=signal<Message[]>([]);
  isLoading=signal<boolean>(true);
  input:boolean=false;

  



  startConnection(token: string, senderId?: string){
    this.hubConnection = new HubConnectionBuilder()
    .withUrl(`${this.hubUrl}?senderId=${senderId}`, {
      accessTokenFactory: () => token
    })
    .withAutomaticReconnect()
    .build();

    // PEHLE event handler setup karo
    this.hubConnection.on('OnlineUsers', (users: User[]) => {
      
      console.log("Received users:", users);
      this.onlineUser.set(
        users.filter(u => u.userName !== this.storedUser?.userName )
      );
      this.onlineUserSearch.set(this.onlineUser());
    });

    this.hubConnection.on("ReceiveMessageList",(message)=>{
      this.chatMessages.update(messages=>[...message,messages]);
      this.isLoading.update(()=>false);

    });

    this.hubConnection.on("ReceiveNewMessage",(message:Message)=>{
      document.title='(1) New Message'     
      this.chatMessages.update(messages=>[...messages,message]);
      if (this.currentOpenedChat()?.id === message.senderId) {
        this.MessageReadOrNot(); // turant mark read
      }
      this.isLoading.update(()=>false);
       Notification.requestPermission().then(result=>{
        if(result==='granted')
        {
          new Notification('New Message',{
            body:message.content
          })
        }
      })
    });

    this.hubConnection.on('Notify', (user:User)=>{
      Notification.requestPermission().then(result=>{
        if(result==='granted')
        {
          new Notification('Active Now 🟠',{
            body:user.fullName + ' is online now',
            icon:user.profileImage
          })
        }
      })
    });

    this.hubConnection.on('NotifyTypingToUser',(senderUserName)=>{
      this.onlineUser.update((users)=>
        users.map(user=>{
          if(user.userName===senderUserName)
          {
            user.isTyping=true;
          }
          return user;
            
      })
      )
      setTimeout(()=>{
        this.onlineUser.update((users)=>
        users.map((user)=>{
          if(user.userName===senderUserName)
          {
            user.isTyping=false;
          }
          return user;
            
      })
      )
      },2000)
    })

    this.hubConnection.on('MessagesMarkedAsRead', (receiverId: string) => {
    if (this.currentOpenedChat()?.id === receiverId) {
    this.chatMessages.update((messages) =>
      messages.map((message) => {
        // Sirf wahi messages update karo jo current chat ke hain
        if (message.receiverId === receiverId) {
          return { ...message, isRead: true };
        }
        return message;
      })
    );
  }
});



    // PHIR connection start karo  
    this.hubConnection.start().then(() => console.log('Connection started'))
    .catch(err => console.log(err));

    
}
sendMessage(message:string)
{
  this.chatMessages.update(messages=>[...messages,{
   content:message,
   senderId:this.authService.currentLoggedUser!.id,
   receiverId:this.currentOpenedChat()?.id!,
   createdDate:new Date(),
   isRead:false,
   id:0
  }]);
  this.hubConnection?.invoke('SendMessage',{
    receiverId:this.currentOpenedChat()?.id!,
    content:message
  }).then((id)=>{
    console.log('message send to',id);
  })
  .catch(err=>console.log(err));

}
Status(userName:string):string
    {
        const currentChatUser=this.currentOpenedChat();
        if(!currentChatUser)
          {
            return "Offline";
          }

          const onlineUser=this.onlineUser().find(u=>u.userName===currentChatUser.userName);
          
         return onlineUser?.isTyping?"Typing...":this.isUserOnline();
    }
isUserOnline():string
    {
      let onlineUser=this.onlineUser().find(u=>u.userName===this.currentOpenedChat()?.userName);
      return onlineUser?.isOnline? 'Online':this.currentOpenedChat()!.userName;
    }

loadMessages(pageNumber:number)
{
  this.hubConnection?.invoke("LoadMessages",this.currentOpenedChat()?.id,pageNumber)
  .then()
  .catch()
  .finally(()=>this.isLoading.update(()=>false))
    
}

NotifyTyping(){
  this.hubConnection?.invoke('NotifyTyping',this.currentOpenedChat()?.userName)
  .then(x=>console.log('Notify for',x))
  .catch(err=>console.log(err))
}

MessageReadOrNot(){
  this.hubConnection?.invoke('MessageReadOrNot',this.currentOpenedChat()?.id)
}

filterUsers(search: string) {
  const trimmedSearch = search.trim().toLowerCase(); 

  const filtered = this.onlineUser().filter(u =>
    u.fullName.toLowerCase().includes(trimmedSearch)
  );

  this.onlineUserSearch.set(filtered);
}

inputChange()
{
   this.input=true;
}

}
