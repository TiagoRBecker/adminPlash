"use client";
import Filter from "@/components/Filter";
import { Pagination } from "@/components/Pagination";
import Spinner from "@/components/Spinner";
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

const ClientesFinance = () => {
  const { data: session, status } = useSession();
  const query = useSearchParams();
  const page = query.get("page") || 1;

  const [totalPages, setTotalPages] = useState(0);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const getClientes = async () => {
    try {
      //@ts-ignore
      const token = session?.user.token;
      const res = await fetch(`${baseURL}users?page=${page}`, {
        method: "GET",
        cache: "no-cache",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const response = await res.json();
      
      setTotalPages(response.finalPage);
      setUsers(response.users);
      setLoading(false);
      return;
    } catch (error) {
      console.log(error);
    }
  };
  const labels = {
    select: "Mostrar",
    author: "E-mail",
    name: "Nome",
    company: "Editora",
    volume: "Volume",
    cat: "Categoria",
    categoryArticle: "Categorias",
    filterButton: "Filtrar",
  };

  const placeholders = {
    select: "Mostrar",
    author: "E-mail",
    name: "Nome",
    company: "Editora",
    volume: "Volumes",
    cat: "Categorias",
    categoryArticle: "Buscar categorias",
  };
  const handlFilter = async (filterValues?: any) => {
    setLoading(true);
    const {
      authorValue,
      nameValue,
      companyValue,
      volumeValue,
      categoryValue,
      selectvalue,
      categoryValueArticle,

      price,
    } = filterValues;
    try {
      //@ts-ignore
      const token = session?.user.token;
      const magazines = await fetch(
        `${baseURL}users?name=${nameValue}&email=${authorValue}&company=${companyValue}&volume=${volumeValue}&category=${categoryValue}&take=${selectvalue}&price=${price}`,
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
      setUsers(response.users);
      setTotalPages(response.total);
    } catch (error) {
      console.log(error);
    }

    return;
  };

  useEffect(() => {
    if (status === "authenticated") {
      getClientes();
      return;
    }
  }, [status, page]);

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
        <h1 className="uppercase text-gray-400">Usuários cadastrados </h1>
       
      </div>
      <div className=" w-full  md:flex md:h-[100px] items-center justify-around">
      <Filter
          onSubmitFilter={handlFilter}
          labels={labels}
          placeholders={placeholders}
          showAuthor={true}
          showName={true}
          showPrice={true}
          
        />
      </div>
      <div className="w-full">
        {users?.length > 0 ? (
          <div className="w-full">
            <TableContainer width={"100%"} className=" rounded-md">
              <Table variant="simple">
                <TableCaption>CLientes á pagar</TableCaption>
                <Thead background={"#14b7a1"}>
                  <Tr>
                    <Th color={"white"}>ID</Th>
                    <Th color={"white"}>Foto</Th>
                    <Th color={"white"}>Nome</Th>
                    <Th color={"white"}>Email</Th>
                    <Th color={"white"}>Disponível para saque</Th>
                    <Th color={"white"}>Ações</Th>
                  </Tr>
                </Thead>
                  {users?.map((employee: any, index:number) => (
                <Tbody key={index}>
                    <Tr>
                      <Td>{employee.id}</Td>
                      <Td>
                        <img
                          src={"/user.png"}
                          alt={employee.name}
                          className="w-14 h-14 object-cover rounded-full"
                        />
                      </Td>
                      <Td>
                        {employee.name} {employee.lastName}
                      </Td>
                      <Td>{employee.email}</Td>

                      <Td
                        className={
                          employee?.availableForWithdrawal > 50
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {Number(
                          employee?.availableForWithdrawal
                        ).toLocaleString("pt-br", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </Td>

                      <Td>
                        <div className="w-full h-full ">
                          <Link
                            href={`/dashboard/financeiro/clientes/${employee.id}`}
                          >
                            <button className="text-[#005183]">
                              Pagar Dvl
                            </button>
                          </Link>
                        </div>
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
          <div className="w-full h-screen flex items-center justify-center">
            <p className="text-gray-300">Usuário não encontrado!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ClientesFinance;
