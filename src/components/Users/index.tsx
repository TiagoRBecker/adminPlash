import { getServerSession } from "next-auth/next";
import { baseURL } from "../utils/api";
import TableEmployyes from "./table";
import { authOptions } from "../utils/authoption";
import { Suspense } from "react";
import Loading from "../Spinner";
const getLastUsers = async (token:string)=>{
   const request =  await fetch(`${baseURL}last-users`, {
    method: "GET",
    cache:"no-cache",
    headers:{
      Authorization:`Bearer ${token}`
    }
   
    
  });
  const response = await request.json()
 
  return response
  
}
const lastUsers = async  () => {
   const session = await  getServerSession(authOptions)
   //@ts-ignore
    const token:any = session?.user?.token 
     const data = await getLastUsers(token)
     
      
    return (
      <Suspense fallback={<Loading/>}>
    <div className="w-full h-full">
        <h1 className="w-full text-left text-[24px] font-bold  lg:text-[19px] text-dark-brown tracking-[-.0065em] my-10 ">
        Últimos usuários cadastrados
      </h1>
      <TableEmployyes users={data}/>
    </div> 
    </Suspense> );
}
 
export default lastUsers;