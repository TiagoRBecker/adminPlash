"use client";

import Spinner from "@/components/Spinner";
import ApiController, { baseURL } from "@/components/utils/api";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Progress,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Filter from "@/components/Filter";
import { Pagination } from "@/components/Pagination";
import { useSearchParams } from "next/navigation";
const Dvl = () => {
  const query = useSearchParams();
  const page = query.get("page") as string;
  const {data: session,status} = useSession()
  useEffect(() => {
    if(status === "authenticated"){
      getDvls();
    }
  
  }, [status,page]);

  const [dvl, setDvl] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const getDvls = async () => {

    try {
      //@ts-ignore
      const token = session?.user.token;
      const response = await ApiController.getDvls(page,token)
    
      setTotalPages(response.total)
      setDvl(response.dvl);
      setLoading(false);
    } catch (error) {
       console.log(error)
    }
   
  };
  const labels = {
    select: "Mostrar",
    author: "Autor",
    name: "Nome",
    company: "Editora",
    volume: "Volume",
    cat: "Categoria",
    categoryArticle: "Categorias",
    filterButton: "Filtrar"
  };
  
  const placeholders = {
    select: "Mostrar",
    author: "Autores",
    name: "Nomes",
    company: "Editora",
    volume: "Volumes",
    cat: "Categorias",
    categoryArticle: "Buscar categorias"
  };
  const handlFilter = async (filterValues?: any) => {
    setLoading(true)
    const {
      authorValue,
      nameValue,
      companyValue,
      volumeValue,
      categoryValue,
      selectvalue,
     
      price
    } = filterValues;
      try {
        //@ts-ignore
        const token = session?.user.token
        const magazines = await fetch(
          `${baseURL}dvls?author=${authorValue}&name=${nameValue}&company=${companyValue}&volume=${volumeValue}&category=${categoryValue}&take=${selectvalue}&price=${price}`,
          {
            method: "GET",
            cache:"no-cache",
            headers:{
    
              Authorization: `Bearer ${token}`,
            }
          }
        );
        const response = await magazines.json();
       setLoading(false)
       setDvl(response.dvl);
       setTotalPages(response.total)
      } catch (error) {
        console.log(error)
      }
    

    return;
  };
  
  if (loading) {
    return (
      <section className="w-full h-screen flex flex-col items-center justify-center px-4  ">
        <Spinner />
      </section>
    );
  }
 console.log(dvl)
  return (
    <section className="container mx-auto h-full  flex  flex-col items-center  px-4 gap-4  bg-white  rounded-sm p-2">
  <div className="w-full flex items-center justify-between px-4">
        <h1 className="uppercase text-gray-400">Divisão de Lucros para clientes</h1>
       
      </div>
     <div className=" w-full h-full  md:flex md:h-[100px] items-center justify-around">
     <Filter
          onSubmitFilter={handlFilter}
          labels={labels}
          placeholders={placeholders}
          
          showName={true}
          showPrice={true}
          
        
        />
      </div>
      <div className="w-full">
        <TableContainer width={"100%"}>
          <Table variant="simples">
            <TableCaption>DVLS á pagar</TableCaption>
            <Thead background={"#14b7a1"}>
              <Tr>
              <Th color={"white"}>Data</Th>
              <Th color={"white"}></Th>
                <Th color={"white"}>Nome</Th>
                <Th color={"white"}>Preço Bruto</Th>
                <Th color={"white"}>%</Th>
                <Th color={"white"}>Receber</Th>
                <Th color={"white"}>Pago</Th>
                <Th color={"white"}>Status</Th>

                <Th color={"white"}>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {dvl?.map((dvl: any, index: number) => (
              
                <Tr key={index}>
                  <Td>{new Date(dvl.createDate).toLocaleString("pt-br")}</Td>
                  <Td><img src={dvl.picture} alt={dvl.name}  className="w-16 h-16 object-cover"/> </Td>
                  <Td>{dvl.name}</Td>
                  <Td>
                      {Number(dvl?.price).toLocaleString("pt-br", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </Td>
                  <Td>
                    <Progress
                      colorScheme="green"
                      value={( dvl.toReceive / dvl.paidOut * 100)}
                    />
                  </Td>
                  
                  <Td>
                    {Number(dvl.paidOut).toLocaleString("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </Td>
                  <Td>
                    {Number(dvl.toReceive).toLocaleString("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </Td>
                  <Td>
                    {dvl.paidOut === 0 ? (
                      <p className="text-red-500">Finalizado</p>
                    ) : (
                      <p className="text-green-500">Ativo</p>
                    )}
                  </Td>
                  <Td>
                    {dvl.paidOut === 0 ? (
                      <p className="text-green-500">Pago</p>
                    ) : (
                      <Link href={`/dashboard/dvl/${dvl.id}?price=${dvl.price}`}>
                        <button className="text-[#005183]">Pagar</button>
                      </Link>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        <div className="flex items-center justify-center my-2">
          <Pagination totalPages={totalPages} pageParam="page"/>
          </div>
      </div>
    </section>
  );
};

export default Dvl;
