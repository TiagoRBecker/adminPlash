import { getServerSession } from "next-auth";
import { baseURL } from "../utils/api";
import TableEmployyes from "./table";
import { authOptions } from "../utils/authoption";
const getLastEmployees = async (token:string)=>{
   const request =  await fetch(`${baseURL}dvls/last`, {
    method: "GET",
    cache:"no-cache",
    headers:{
      Authorization:`Bearer ${token}`
    }
   
  });
  const response = await request.json()
 
  return response
  
}
const lastEmployees = async  () => {
  const session = await  getServerSession(authOptions)
  //@ts-ignore
   const token:any = session?.user?.token 
     const data = await getLastEmployees(token)
      
    return (
    <div  >
        <h1 className="w-full text-left text-[24px] font-bold  lg:text-[19px] text-dark-brown tracking-[-.0065em]  mb-4">
        Últimos Dvl pagos
      </h1>
      <TableEmployyes dvls={data}/>
    </div>  );
}
 
export default lastEmployees;