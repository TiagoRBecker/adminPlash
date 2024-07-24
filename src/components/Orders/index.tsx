
"use client"
import { useEffect, useState } from "react";
import { baseURL } from "../utils/api";
import Table  from  "./table"
import socket from "@/socket";
import Spinner from "../Spinner";
import { useSession } from "next-auth/react";

const OrderData =   () => {
   const {data:session,status} = useSession()
   const [ data, setData] = useState([])
    const [ loading, setLoading]= useState(true)
   const order = async ()=>{
    //@ts-ignore
    const token = session?.user.token 
      const data = await fetch(`${baseURL}orders/last`,{
        method:"GET",
        cache:"no-cache",
        headers:{
        "Content-Type": "application/json",
      Authorization:`Bearer ${token}`
        }
      })
      const response = await data.json()
    
      setData(response)
      setLoading(false)
      
     return response;
     
  
  }
    useEffect(()=>{
        
       if(status === "authenticated"){
        socket.on('newOrder', (novoPedido) => {
         

          order();
        });
    
        socket.on('disconnect', () => {
         return null
        });
        order()
        
       }
       return () => {
        socket.off('newOrder');
        socket.off('disconnect');
      };
          
         
    },[status])
    

   if(loading){
    return(
      <div className="w-full h-screen flex items-center justify-center">
         <p className="text-gray-300">carregando aguarde ...</p>
      </div>
    )
   }

   
    return (  
        <div className="w-full h-full">

          { data?.length > 0 &&  <Table data={data}/>}
        </div>
      
       
    );
};
 
export default OrderData;
