"use client"
import  socket  from "@/socket";
import { Avatar } from "@chakra-ui/react";
import { useEffect, useState } from "react";
const Notification = () => {
const [ newMessage,setNewMessage] = useState(false)
const [ showMessage,setShowMessage] = useState(false)
const [ showOrder,setShowOrder] = useState(false)
const [newPedido, setNewPedido] = useState(false);
useEffect(()=>{
  socket.on('newMessage', () => {
    setNewMessage(true)
  });
  socket.on('newOrder', () => {
    setNewPedido(true);
  });
 
},[])
 const showMenuMessage = ()=>{
  if(showOrder){
    setShowOrder(false)
    setShowMessage(!showMessage)
    setNewMessage(false)
    return
  }
  setShowMessage(!showMessage)
  setNewMessage(false)

 }
 const showOrderMessage = ()=>{
  if(showMessage){
    setShowMessage(false)
    setShowOrder(!showOrder)
    setNewMessage(false)
  }
  setShowOrder(!showOrder)
  setNewPedido(false)
  
 }
    return (  
    

      
    <div className="w-full h-[80px] flex items-center gap-3">
    <div className="relative">
      <p className="cursor-pointer relative" onClick={showOrderMessage} >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"
          />
        </svg>
       {newPedido && <span className="bg-red-500 rounded-full w-5 h-5 absolute top-0 right-0 text-white flex items-center justify-center">1</span>}
      </p>
      <div className={showOrder ? "w-[300px] h-[50px]   absolute -left-[290px] top-12 flex items-center justify-center shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-md":"hidden"}>
        Um novo pedido foi solicitado
      </div>
    </div>
    <div className="relative">

      <p className="cursor-pointer" onClick={showMenuMessage}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
          />
        </svg>
        {newMessage && <span className="bg-red-500 rounded-full w-5 h-5 absolute -top-1 -right-1 text-white flex items-center justify-center">1</span>}
      </p>
      <div className={showMessage ? "w-[300px] h-[50px]   absolute -left-[290px] top-12 flex items-center justify-center shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-md":"hidden"}>
         Uma nova mensagem recebida
      </div>
    </div>
    <Avatar name={"Leonardo Paiva"} src={"/user.png"} />
    </div>
  

  );
}
 
export default Notification;