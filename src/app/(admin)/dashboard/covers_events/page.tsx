"use client"
import Filter from "@/components/Filter";
import { Pagination } from "@/components/Pagination";
import Spinner from "@/components/Spinner";
import { baseURL, url } from "@/components/utils/api";
import { Table, TableCaption, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const   CoverEvent = () => {
  const { data: session ,status} = useSession();
  const query = useSearchParams();
  const page = query.get("page") || 1;

  //@ts-ignore
  const token = session?.user.token
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [covers,setCovers] = useState([])
    useEffect(()=>{
      
       if(status === "authenticated"){
        getEventsCover()
    
       }
 
    },[status])
    const getEventsCover = async ()=>{
      try {

        const request = await fetch(`${baseURL}covers?page=${page}`,{method:"GET",cache:"no-cache", headers:{
          Authorization: `Bearer ${token}`,
        }})
        const response = await request.json()
       
        setCovers(response.covers)
        setTotalPages(response.total)
        setLoading(false)
        return
      } catch (error) {
        
      }
       
      }
     
    
      const handlFilter = async (filterValues?: any) => {
        setLoading(true);
        const {
          selectvalue,
          authorValue,
         
        
        } = filterValues;
        try {
          //@ts-ignore
          const token = session?.user.token;
          const magazines = await fetch(
            `${baseURL}covers?name=${authorValue}&take=${selectvalue}`,
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
          setCovers(response.covers)
          setTotalPages(response.total);
        } catch (error) {
          console.log(error);
        }
    
        return;
      };
   const deletEventCover = async (id:number,name:string)=>{
    const del = await Swal.fire({
      position: "center",
      title: "Tem certeza?",
      text: `Deseja deletar o  Artigo ${name}?`,
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#d55",
      confirmButtonText: "Deletar",
      confirmButtonColor: "#00FF00",
    });

    if (del.isConfirmed) {
    
      try {
        setLoading(true)
        const deletEventCover = await fetch(`${baseURL}delet-event-cover/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          
        });
        
        
        await Swal.fire(
          `Evento ${name} deletado com sucesso!!`,
          "Clica no botão para continuar!",
          "success"
        );
        await getEventsCover()
      } catch (error) {
        console.log(error);
        //Exibe o modal de erro caso exista um
        await Swal.fire(
          "Erro ao deletar o evento!",
          "Clica no botão para continuar!",
          "error"
        );
        setLoading(false)
      }
    }
   }
   const labels = {

    select: "Mostrar",
    author: "Nome",
    
  };

  const placeholders = {
    select: "Mostrar",
    author: "Nome",
   
  };
  if (loading) {
    return (
     
        <Spinner />
    
    );
  }
 
    return (  
      <section className="container mx-auto h-full  flex  flex-col items-center  px-4 gap-4  bg-white  rounded-sm p-2">
        <div className="w-full flex flex-col md:flex-row items-center justify-between px-4">
        <h1 className="uppercase text-gray-400">Eventos de Capa </h1>
        <div className="  flex items-center  mt-4">
              <Link href={"/dashboard/covers_events/add_event"} className="text-white font-bold">
              <button className="px-4 py-2 bg-[#14b7a1]  rounded-md  flex items-center gap-2">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6  text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
                  Adicionar
                </button>
              </Link>
            </div>
      </div>
      <div className=" w-full  md:flex md:h-[100px] items-center justify-around">
       <Filter
         onSubmitFilter={handlFilter}
         labels={labels}
         placeholders={placeholders}
         showAuthor={true}
         
       />
     </div>
      
  
        {covers && covers.length > 0 ? (
          <div className="w-full  flex flex-col items-center justify-center">
            <TableContainer width={"100%"}>
              <Table variant="simples">
                <TableCaption>Eventos Capas do Mês</TableCaption>
                <Thead background={"#14b7a1"}>
                  <Tr>
                    
                 
                    <Th color={"white"}>Nome</Th>
                    <Th color={"white"}>Encerramento</Th>
                    <Th color={"white"}> Capas</Th>
                    <Th color={"white"}>Ações</Th>
                  </Tr>
                </Thead>
                  {covers?.map((cover: any, index) => (
                <Tbody key={index}>
                    <Tr>
                   
                      
                    
                      <Td>{cover.name}</Td>
                      <Td>{new Date(Number(cover.date_event)).toLocaleDateString("pt-br")}</Td>
                      <Td ><div className="flex flex-col  md:flex-row items-center gap-2">{cover?.cover?.map((img:any,index:number)=>(
                        <img key={index}src={img.cover} alt={img.name} className="w-16 h-16 object-cover"/>
                      ))}</div></Td>
  
                     
                      <Td>
                        
                        <button
                          className="text-red-500"
                          onClick={()=>deletEventCover(cover.id,cover.name)}
                        >
                          Deletar
                        </button>
                      </Td>
                    </Tr>
                </Tbody>
                  ))}
              </Table>
            </TableContainer>
            <div className="flex items-center justify-center">
            <Pagination totalPages={totalPages} pageParam="page"/>
            </div>
           
            </div>
        ) : (
          <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
            <p className="text-gray-400">Nenhuma evento cadastrado!</p>
           
          </div>
        )}
      </section>
    );
}
 
export default CoverEvent ;