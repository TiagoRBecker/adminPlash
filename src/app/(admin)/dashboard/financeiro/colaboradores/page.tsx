"use client";
import Filter from "@/components/Filter";
import Header from "@/components/Header";
import { Pagination } from "@/components/Pagination";
import Spinner from "@/components/Spinner";
import { baseURL } from "@/components/utils/api";
import {
  Progress,
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


const EmployeeFinance = () => {
 const {data: session,status} = useSession()
  const query = useSearchParams()
 const page = query.get("page") || 1;
 
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
   const [totalPages , setTotalPages] = useState(0)
  const getEmployee = async () => {
    try {
      //@ts-ignore
      const token = session?.user.token 
      const res = await fetch(`${baseURL}employees?page=${page}`, {
        method: "GET",
        headers:{

          Authorization:`Bearer ${token}`
        }
      });
   
        const data = await res.json();
        setEmployees(data.employee);
        setTotalPages(data.total)
        setLoading(false);
        return;
      
    } catch (error) {
      console.log(error)
    }
   
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
      categoryValueArticle,
      
      price
    } = filterValues;
      try {
        //@ts-ignore
        const token = session?.user.token
        const magazines = await fetch(
          `${baseURL}employees?name=${nameValue}&profession=${authorValue}&email=${companyValue}&volume=${volumeValue}&category=${categoryValue}&take=${selectvalue}&price=${price}`,
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
       setEmployees(response.employee);
       setTotalPages(response.total)
      } catch (error) {
        console.log(error)
      }
    

    return;
  };
  const labels = {
    select: "Mostrar",
    author: "Profissão",
    name: "Nome",
    company: "E-mail",
    volume: "Volume",
    cat: "Categoria",
    categoryArticle: "Categorias",
    filterButton: "Filtrar"
  };
  
  const placeholders = {
    select: "Mostrar",
    author: "Profissão",
    name: "Nome",
    company: "E-mail",
    volume: "Volumes",
    cat: "Categorias",
    categoryArticle: "Buscar categorias"
  };
  useEffect(() => {
    if(status === "authenticated"){
      getEmployee();
    }
    
  },[status,page])
  
  if (loading) {
    return (
      <section className="w-full h-screen flex flex-col items-center justify-center px-4 ">
        <Spinner />
      </section>
    );
  }
  return (
    <section className="container mx-auto h-full  flex  flex-col items-center  px-4 gap-4  bg-white  rounded-sm p-2">
      <div className="w-full flex items-center justify-between px-4">
        <h1 className="uppercase text-gray-400">Colaboradores cadastrados </h1>
       
      </div>
      <div className=" w-full  md:flex md:h-[100px] items-center justify-around">
      <Filter
          onSubmitFilter={handlFilter}
          labels={labels}
          placeholders={placeholders}
          showAuthor={true}
          showName={true}
        
          showCompany={true}
          selectShow={true}
        />
      </div>
      {
        employees.length > 0 ?
        <div className="w-full">
        <TableContainer width={"100%"}>
        <Table variant="simple">
          <TableCaption>Colaboradores á pagar</TableCaption>
          <Thead background={"#14b7a1"}>
            <Tr>
              <Th color={"white"}>Foto</Th>
              <Th color={"white"}>Nome</Th>
              <Th color={"white"}>Profissão</Th>
              <Th color={"white"}>E-mail</Th>
              <Th color={"white"}>Telefone</Th>
              <Th color={"white"}>Revistas Parceiras</Th>

              <Th color={"white"}>Pago</Th>
              <Th color={"white"}>Ações</Th>
            </Tr>
          </Thead>
            {employees?.map((employee: any, index) => (
          <Tbody key={index}>
              <Tr>
                <Td>
                  <img
                    src={employee.avatar}
                    alt={employee.name}
                   className="w-14 h-14 rounded-full object-cover"
                  />
                </Td>
                <Td>{employee.name}</Td>
                <Td>{employee.profession}</Td>
                <Td>{employee.email}</Td>
                <Td>{employee.phone}</Td>
                <Td>{employee?.magazines?.length}</Td>

                <Td>0</Td>
                <Td>
                  <div className="w-full h-full ">
                    <Link href={`/dashboard/financeiro/colaboradores/${employee.id}`}>
                      <button className="text-[#005183]">Pagar</button>
                    </Link>
                  </div>
                 
                </Td>
              </Tr>
          </Tbody>
            ))}
        </Table>
      </TableContainer>
      <div className="flex items-center justify-center my-2">
          <Pagination totalPages={totalPages} pageParam="page"/>
          </div>
      </div>
      
      :
      <div className="w-full h-screen flex items-center justify-center">
      <p className="text-gray-300">Usuário não encontrado!</p>
    </div>

      }
      
      
    
    </section>
  );
};

export default EmployeeFinance;
