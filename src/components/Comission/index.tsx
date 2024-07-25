import { getServerSession } from "next-auth";
import { baseURL } from "../utils/api";
import TableEmployyes from "./table";
import { authOptions } from "../utils/authoption";
const getLastComission = async (token:string)=>{
   const request =  await fetch(`${baseURL}last-comission`, {
    method: "GET",
    cache:"no-cache",
    headers:{
      Authorization:`Bearer ${token}`
    }
   
  });
  const response = await request.json()
 
  return response
  
}
const Comission = async  () => {
  const session = await  getServerSession(authOptions)
  //@ts-ignore
   const token:any = session?.user?.token 
     const data = await getLastComission(token)
      
    return (
    <div  >
        <h1 className="w-full text-left text-[24px] font-bold  lg:text-[19px] text-dark-brown tracking-[-.0065em]  mb-4">
        Últimas comissões pagas
      </h1>
      <TableEmployyes dvls={data}/>
    </div>  );
}
 
export default Comission;