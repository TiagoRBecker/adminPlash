"use client";
import React from "react";
import Button from "@/components/Button";
import Spinner from "@/components/Spinner";
import { baseURL, url } from "@/components/utils/api";
import Link from "next/link";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
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
import Filter from "@/components/Filter";
import { useSearchParams } from "next/navigation";
import { Pagination } from "@/components/Pagination";

const ViewEvent = () => {
 
  const { data: session ,status} = useSession();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const query = useSearchParams();
  const page = query.get("page") || 1;
 
  const getEvents = async () => {
    try {
      //@ts-ignore
      const token = session?.user.token;
      const magazines = await fetch(
        `${baseURL}events?page=${page}`,
        {
          method: "GET",
          cache: "no-cache",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const response = await magazines.json();
      setEvents(response.event);
      setTotalPages(response.total)
      setLoading(false);
      
    } catch (error) {
      console.log(error);
    }

    return;
  };
    
   
  
  const handleDeletEvent = async (id: number, name: string) => {
    const del = await Swal.fire({
      position: "center",
      title: "Tem certeza?",
      text: `Deseja deletar o  Evento ${name}?`,
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#d55",
      confirmButtonText: "Deletar",
      confirmButtonColor: "#00FF00",
    });

    if (del.isConfirmed) {
      try {
        //@ts-ignore
        const token = session?.user.token;
        const deletArticle = await fetch(`${baseURL}events/delet/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        await Swal.fire(
          `${name} deletado com sucesso!!`,
          "Clica no botão para continuar!",
          "success"
        );
        await getEvents();
      } catch (error) {
        console.log(error);
        //Exibe o modal de erro caso exista um
        await Swal.fire(
          "Erro ao deletar o evento!",
          "Clica no botão para continuar!",
          "error"
        );
      }
    }
  };
  const handlFilter = async (filterValues?: any) => {
    setLoading(true);
    const {
      selectvalue,
      nameValue,
      companyValue,
      volumeValue,
     
    
    } = filterValues;
    try {
      //@ts-ignore
      const token = session?.user.token;
      const magazines = await fetch(
        `${baseURL}events?name=${nameValue}&email=${volumeValue}&event=${companyValue}&take=${selectvalue}`,
        {
          method: "GET",
          cache: "no-cache",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const response = await magazines.json();
      setEvents(response.event);
      setTotalPages(response.total)
      setLoading(false)
      
    } catch (error) {
      console.log(error);
    }

    return;
  };
  const labels = {
    select: "Mostrar",
    
    name: "Responsavél",
    company: "Nome Evento",
    volume: "E-mail",
    cat: "Categoria",
    categoryArticle: "Categorias",
    filterButton: "Filtrar",
  };

  const placeholders = {
    select: "Mostrar",
   
    name: "Nome",
    company: "Evento",
    volume: "E-mail",
  
  };
  useEffect(() => {
    if( status === "authenticated"){
      getEvents();
      return 
    }
    
  }, [status,page]);
  if (loading)
    return (
      <section className="w-full h-screen flex items-center justify-center">
        <Spinner />
      </section>
    );

  return (
    <section className="container mx-auto h-full  flex  flex-col items-center  px-4 gap-4  bg-white  rounded-sm p-2">
    <div className="w-full flex flex-col md:flex-row items-center justify-between px-4">
      <h1 className="uppercase text-gray-400">Eventos Patrocinados </h1>
      <div className=" flex items-center justify-center mt-4">
         <Link href={"/dashboard/events/event/add_event"} className="text-white font-bold">
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
         
          showName={true}
          showVol={true}
          showCompany={true}
       
        />
      </div>
   
      {events.length > 0 ? (
        <div className="w-full h-full">
        <TableContainer width={"100%"}>
          <Table variant="simple" fontSize={14}>
            <TableCaption>Eventos</TableCaption>
            <Thead background={"#14b7a1"}>
              <Tr>
                <Th color={"white"}>Image</Th>
                <Th color={"white"}>Responsavél</Th>
                <Th color={"white"}>E-mail</Th>
                <Th color={"white"}>Telefone</Th>
                <Th color={"white"}>Nome do Evento</Th>
                <Th color={"white"}>Data Encerramento</Th>

                <Th color={"white"}>Ações</Th>
              </Tr>
            </Thead>
            {events.map((events: any, index: number) => (
              <Tbody key={index}>
                <Tr>
                  <Td>
                    <img
                      src={events.cover}
                      alt={events.name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                  </Td>
                  <Td>{events?.organizer}</Td>
                  <Td>{events?.email}</Td>
                  <Td>{events?.phone}</Td>
                  <Td>{events.name}</Td>

                  <Td>
                    
                     {new Date(Number(events?.date_event_end)).toLocaleString("pt-br")}
                     
                    
                  </Td>

                  <Td>
                    <div className="w-full h-full ">
                      <Link href={`/dashboard/events/event/${events.id}`}>
                        <button className="text-[#005183]">Editar</button>
                      </Link>
                    </div>
                    <button
                      className="text-red-500"
                      onClick={() => handleDeletEvent(events.id, events.name)}
                    >
                      Deletar
                    </button>
                  </Td>
                </Tr>
              </Tbody>
            ))}
          </Table>
        </TableContainer>
        <div className="flex items-center justify-center my-2">
              <Pagination totalPages={totalPages} pageParam="page" />
            </div>
       </div>
      ) : (
        <div className="w-full h-full py-2 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400">Nenhum evento encontrado!</p>
    
        
      </div>
      )}
    </section>
  );
};

export default ViewEvent;
