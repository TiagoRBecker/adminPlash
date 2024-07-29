"use client"
import Filter from "@/components/Filter";
import Header from "@/components/Header";
import { Pagination } from "@/components/Pagination";
import Loading from "@/components/Spinner";
import { baseURL } from "@/components/utils/api";
import {
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ReadableStreamDefaultController } from "stream/web";
type Orders ={
  id:number,
  status:string
updateAt:string
createDate:string
userId:number
userMasterId:number | null
codeEnv:string
name:string,
lastName:string,
email:string,
adress:string,
city:string,
district:string,
cep:string,
complement:string
phone:string
  
}
const OrderAlls = () => {
  const { data: session, status } = useSession();
  const query = useSearchParams();
  const page = query.get("page") || 1;

  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [ orders ,setOrders] = useState<Orders[]>([])
  console.log(orders)
   const getAllOrders = async ()=>{
     //@ts-ignore
     const token = session?.user.token
    const orders = await fetch(`${baseURL}orders?page=${page}`,{
      method:"GET",
      cache:"no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization:`Bearer ${token}`
      },
    })
    const response = await orders.json()
    
    setOrders(response.orders)
    setTotalPages(response.total)
    setLoading(false)
    return
   }
   const labels = {
    select: "Mostrar",
    author: "N° Pedido",
    name: "Nome",
    company: "E-mail",
    volume: "Status",
   cat:"Cidade",
   
    filterButton: "Filtrar",
  };

  const placeholders = {
    select: "Mostrar",
    author: "Pedido",
    name: "Nome",
    company: "E-mail",
    volume: "status",
    cat: "Cidade",
    
  };
  const handlFilter = async (filterValues?: any) => {
    setLoading(true);
    const {
      selectvalue,
      authorValue,
      nameValue,
      companyValue,
      volumeValue,
      categoryValue,
      date_initial,
    
    } = filterValues;
    try {
       const sts = volumeValue?.toLowerCase()
      //@ts-ignore
      const token = session?.user.token;
      const magazines = await fetch(
        `${baseURL}orders?name=${nameValue}&email=${companyValue}&city=${categoryValue}&status=${sts}&id=${authorValue}&take=${selectvalue}&date=${date_initial}`,
        {
          method: "GET",
          cache: "no-cache",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const response = await magazines.json();
       
      setLoading(false);
      setOrders(response.orders);
      setTotalPages(response.total);
    } catch (error) {
      console.log(error);
    }

    return;
  };
  useEffect(()=>{
    if(status === "authenticated"){
      getAllOrders()
      return
    }
  
  },[status,page])
  if(loading){
    return(
      <Loading/>
    )
  }
  
  return (
    <section className="container mx-auto h-full  flex  flex-col items-center  px-4 gap-4  bg-white  rounded-sm p-2">
        <div className="w-full flex-col md:flex-row items-center justify-between px-4">
      <h1 className="uppercase text-gray-400">Ordens de Serviço </h1>
     
    </div>
       <div className=" w-full  md:flex md:h-[100px] items-center justify-around">
       <Filter
          onSubmitFilter={handlFilter}
          labels={labels}
          placeholders={placeholders}
          showAuthor={true}
          showName={true}
          showVol={true}
          showCompany={true}
          showCat={true}
          showDate={true}
        />
      </div>
      {orders?.length > 0 ?
      <div className="w-full">
      <TableContainer width={"100%"}>
        <Table variant="simple" py={20}>
          <TableCaption>Ultimos pedidos adicionados</TableCaption>
          <Thead background={"#14b7a1"}>
            <Tr>
              <Th color={"white"}>ID</Th>
              <Th color={"white"}>Nome</Th>
              <Th color={"white"}>Email</Th>
              <Th color={"white"}>Telefone</Th>
              <Th color={"white"}>Cidade</Th>
              <Th color={"white"}>Status</Th>
              <Th color={"white"}>ID Correios</Th>
              <Th color={"white"}>Açoes</Th>
            </Tr>
          </Thead>
          {
            orders.map((order,index:number)=>(
       <Tbody key={index}>
            <Tr>
              <Td>{order.id}</Td>
              <Td>{order?.name}</Td>
              <Td>{order?.email}</Td>
              <Td>{order.phone}</Td>
              <Td>{order.city}</Td>
              <Td className="capitalize">{order.status}</Td>
              <Td>{order.codeEnv}</Td>
              <Td>
                <Link href={`/dashboard/pedidos/${order.id}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
                </Link>
              </Td>
            </Tr>
          
          </Tbody>
            ))
          }
          
        </Table>
      </TableContainer>
      <div className="flex items-center justify-center my-2">
              <Pagination totalPages={totalPages} pageParam="page" />
            </div>
      </div>
      :
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-gray-400">Pedido não encontrado!</p>
      </div>
}
    </section>
  );
};

export default OrderAlls;
