"use client";
import Header from "@/components/Header";
import { User } from "@/components/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
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
  Box,
  Input,
} from "@chakra-ui/react";
import Spinner from "@/components/Spinner";
import { baseURL } from "@/components/utils/api";
import { useSession } from "next-auth/react";
import Filter from "@/components/Filter";
import { Pagination } from "@/components/Pagination";
import { useSearchParams } from "next/navigation";

const Colaborades = () => {
  const {data:session,status} = useSession()
  const query = useSearchParams()
 const page  = query.get("page") || 1
  const [employees, setEmployees] = useState([]);
  const [totalPages , setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    
    if(status === "authenticated"){
      getEmployee();
    }
  }, [status]);

  const getEmployee = async () => {
    //@ts-ignore
    const token = session?.user.token 
    const res = await fetch(`${baseURL}employees?page=${page}`, {
      method: "GET",
      headers:{

        Authorization:`Bearer ${token}`
      }
    });
    if (res.status === 200) {
      const data = await res.json();
      setEmployees(data.employee);
      setTotalPages(data.total)
      setLoading(false);
      return;
    }
  };
  const formateNumberPhone = (phone: string) => {
    return `(${phone.substring(0, 2)}) ${phone.substring(
      2,
      5
    )}-${phone.substring(5, 8)}-${phone.substring(8, 11)}`;
  };
  const deletEmployee = async (id: String, name: String) => {
    const delt = await Swal.fire({
      position: "center",
      title: "Tem certeza?",
      text: `Você deseja deletar o colaborador ${name}?`,
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#333",
      confirmButtonText: "Deletar",
      confirmButtonColor: "#d55",
    });
    if (delt.isConfirmed) {
      try {
        //@ts-ignore
        const token = session?.user.token;
        const res = await fetch(`${baseURL}employee-delete`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
         
          body: JSON.stringify({ id }),
        });

        await Swal.fire(
          "Usuário deletado com sucesso!",
          "Clica no botão para continuar!",
          "success"
        );
        getEmployee();
        return;
      } catch (error) {
        console.log(error);

        await Swal.fire(
          "Erro ao deletar o usuário!",
          "Clica no botão para continuar!",
          "error"
        );
      }
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
    author: "Buscar por profissão ...",
    name: "Buscar por nome ...",
    company: "Buscar por e-mail",
    volume: "Volumes",
    cat: "Categorias",
    categoryArticle: "Buscar categorias"
  };
  if (loading) {
    return (
      <section className="w-full h-screen flex items-center justify-center">
        <Spinner />
      </section>
    );
  }
  
  return (
    <section className="container mx-auto h-full  flex  flex-col items-center   gap-4  bg-white  rounded-sm p-2">
   <div className="w-full flex flex-col md:flex-row items-center justify-between ">
      <h1 className="uppercase text-gray-400">Colaboradores cadastrados </h1>
      <div className="flex items-center justify-center mt-4">
            <Link href={"/dashboard/colaboradores/adicionar_colaborador"} className="text-white font-bold">
       
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
        showName={true}
      
        showCompany={true}
       
      />
    </div>

      {employees.length > 0 ? (
        <>
          <TableContainer width={"100%"}>
            <Table variant="simple" fontSize={14}>
              <TableCaption>Colaboradores</TableCaption>
              <Thead background={"#14b7a1"}>
                <Tr>
                  <Th color={"white"}>Image</Th>
                  <Th color={"white"}>Nome</Th>
                  <Th color={"white"}>Email</Th>
                  <Th color={"white"}>Telefone</Th>
                  <Th color={"white"}>Profissão</Th>
                  <Th color={"white"}>Revistas</Th>
                  <Th color={"white"}>Comissão</Th>
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
                    <Td>{employee?.email}</Td>

                    <Td>
                      <Link
                        href={`https://api.whatsapp.com/send?phone=55${employee.phone}`}
                        target="_blank"
                      >
                        {formateNumberPhone(employee.phone)}
                      </Link>
                    </Td>
                    <Td>{employee.profession}</Td>
                    <Td>{employee?.magazines?.length}</Td>
                    <Td>{employee?.commission?.toString().slice(3, 4)}%</Td>
                
                    <Td>
                      <div className="w-full h-full ">
                        <Link href={`/dashboard/colaboradores/${employee.id}`}>
                          <button className="text-[#005183]">Editar</button>
                        </Link>
                      </div>
                      <button
                        className="text-red-500"
                        onClick={() =>
                          deletEmployee(employee.id, employee.name)
                        }
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
          <Pagination totalPages={totalPages} pageParam="page"/>
          </div>
         
        </>
      ) : (
        <div className="w-full h-screen gap-3 flex items-center justify-center flex-col ">
          <p className="text-2xl text-gray-400">
            Nenhum colaborador cadastrado !
          </p>
          <div className="w-full flex items-center justify-center">
            <Link href={"/dashboard/colaboradores/adicionar_colaborador"}>
              {" "}
              <button className="px-4 py-2 bg-[#14b7a1] rounded-md text-white">
                Adicionar Colaborador
              </button>
            </Link>
          </div>
        </div>
      )}
    </section>
  );
};

export default Colaborades;
