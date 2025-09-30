export interface Message{
    id:number;
    senderId:string;
    receiverId:string;
    content:string;
    createdDate:Date;
    isRead:boolean;

}