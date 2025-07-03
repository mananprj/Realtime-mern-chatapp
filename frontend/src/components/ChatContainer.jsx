import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatstore"
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeleton/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formateMessageTime } from "../lib/utils";

const ChatContainer = () => {

  const {messages, getmessages, selectedUser, isMessagesLoading, subscribeToMessages, unsubscribeToMessages} = useChatStore();
  const {authUser} = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(()  => {
    getmessages(selectedUser._id);
    subscribeToMessages();

    return () => unsubscribeToMessages();
  },[selectedUser._id, getmessages,subscribeToMessages,unsubscribeToMessages])

  useEffect(() => {
    if(messageEndRef.current && messages){
      messageEndRef.current.scrollIntoView({behavior: "smooth"});
    }
  }, [messages])

  if(isMessagesLoading){
    return (
      <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <MessageSkeleton/>
      <MessageInput />
    </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((message) => (
            <div key={message._id} className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`} ref={messageEndRef}>
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img src={message.senderId === authUser._id ? authUser.profilepic || "/avatar.png" : 
                    selectedUser.profilepic || "/avatar.png"} alt="profile pic" />
                </div>
              </div>
              
              <div className="chat-header mb-1">
                  <time className="text-xs opacity-50 ml-1">
                    {formateMessageTime(message.createdAt)}
                  </time>
              </div>
              <div className="chat-bubble flex flex-col">
                  {message.image && (
                    <img src={message.image} alt="Attachment" className="sm:max-w-[150px] rounded-md mb-2"/>
                  )}
                  {message.text && <p>{message.text}</p>}
              </div>
            </div>
          ))}
      </div>

      <MessageInput />
    </div>
  )
}

export default ChatContainer