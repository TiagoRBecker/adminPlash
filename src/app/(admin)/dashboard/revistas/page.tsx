"use client";
import dynamic from 'next/dynamic';
import Link from "next/link";
import Spinner from "@/components/Spinner";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { baseURL } from "@/components/utils/api";
import { useSearchParams } from "next/navigation";
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
  Text,
} from "@chakra-ui/react";
import Filter from "@/components/Filter";

import { Pagination } from "@/components/Pagination";
import { useSession } from "next-auth/react";



const Magazines = () => {
  const { data: session, status } = useSession();
  //@ts-ignore
  const token = session?.user.token;

  const query = useSearchParams();
  const page = query.get("page");
  const [loading, setLoading] = useState(true);
  const [magazines, setMagazine] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (status === "authenticated") {
      getMagazines();
      return;
    }
  }, [status, page]);

  const getMagazines = async () => {
    //@ts-ignore
 try {
  const currentPage = page || 1;
  const magazines = await fetch(`${baseURL}magazines?page=${currentPage}`, {
    method: "GET",
    cache: "no-cache",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const response = await magazines.json();
  console.log(response)
  setMagazine(response.magazine);
  setTotalPages(response.total);
  setLoading(false);
 } catch (error) {
   console.log(error)
 }
   
    return;
  };
  const handlFilter = async (filterValues?: any) => {
    setLoading(true);
    //@ts-ignore
    const token = session?.user.token;
    const {
      authorValue,
      nameValue,
      companyValue,
      volumeValue,
      categoryValue,
      selectvalue,
    } = filterValues;

    const magazines = await fetch(
      `${baseURL}magazines?author=${authorValue}&name=${nameValue}&company=${companyValue}&volume=${volumeValue}&category=${categoryValue}&take=${selectvalue}`,
      {
        method: "GET",
        cache: "no-cache",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const response = await magazines.json();
    setMagazine(response.magazine);
    setTotalPages(response.total);
    setLoading(false);

    return;
  };
  const deletMagazine = async (id: any, name: any) => {
    //@ts-ignore
    const del = await Swal.fire({
      position: "center",
      title: "Tem certeza?",
      text: `Deseja deletar a Revista ${name}?`,
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#d55",
      confirmButtonText: "Deletar",
      confirmButtonColor: "#00FF00",
    });

    if (del.isConfirmed) {
      try {
        const deletArticle = await fetch(`${baseURL}delet-magazine`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id, name }),
        });
//@ts-ignore
        await Swal.fire(
          `Revista ${name} deletado com sucesso!!`,
          "Clica no botão para continuar!",
          "success"
        );
        await getMagazines();
      } catch (error) {
        console.log(error);
        
        //@ts-ignore
        //Exibe o modal de erro caso exista um
        await Swal.fire(
          "Erro ao deletar o Revista!",
          "Clica no botão para continuar!",
          "error"
        );
      }
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
    filterButton: "Filtrar",
  };

  const placeholders = {
    select: "Mostrar",
    author: "Autor",
    name: "Nome",
    company: "Editora",
    volume: "Volumes",
    cat: "Categorias",
    categoryArticle: "Buscar categorias",
  };
  if (loading) {
    return (
      <section className="w-full  h-screen flex flex-col items-center justify-center px-4 ">
        <Spinner />
      </section>
    );
  }

  return (
    <section className="container mx-auto h-full  flex  flex-col items-center  px-4 gap-4  bg-white ">
     <div className="w-full flex flex-col md:flex-row items-center justify-between ">
     <h1 className="uppercase text-gray-400">Revistas Cadastradas </h1>
        <div className=" flex items-center justify-center mt-4">
          <Link
            href={`/dashboard/revistas/cadastrar`}
            className="text-white font-bold"
          >
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
          showVol={true}
          showCompany={true}
          showCat={true}
        />
      </div>

      {magazines && magazines.length > 0 ? (
        <div className="w-full h-full">
          <TableContainer width={"100%"}>
            <Table variant="simple">
              <TableCaption>Revistas Cadastradas</TableCaption>
              <Thead background={"#14b7a1"}>
                <Tr>
                  <Th color={"white"}>Image</Th>
                  <Th color={"white"}>Autor</Th>
                  <Th color={"white"}>Nome</Th>

                  <Th color={"white"}>Editora</Th>
                  <Th color={"white"}>Volume</Th>
                  <Th color={"white"}>Categorias</Th>
                  <Th color={"white"}>Artigos</Th>
                  <Th color={"white"}>Preço</Th>
                  <Th color={"white"}>Ações</Th>
                </Tr>
              </Thead>
              {magazines?.map((book: any, index) => (
                <Tbody key={index}>
                  <Tr>
                    <Td>
                      <img
                        src={book.cover}
                        alt={book.company}
                        className="w-14 h-14 object-cover rounded-full"
                      />
                    </Td>
                    <Td>{book.author}</Td>
                    <Td>{book.name}</Td>

                    <Td>{book?.company}</Td>
                    <Td>{book.volume}</Td>
                    <Td>{book?.subCategory}</Td>
                    <Td>{book?.article?.length}</Td>
                    <Td>
                      {Number(book?.price).toLocaleString("pt-br", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </Td>
                   
                    <Td>
                      <div className="w-full h-full ">
                        <Link href={`/dashboard/revistas/${book.id}`}>
                          <button className="text-[#005183]">Editar</button>
                        </Link>
                      </div>
                      <button
                        className="text-red-500"
                        onClick={() => {
                          deletMagazine(book.id, book?.name);
                        }}
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
          <p className="text-gray-400">Nenhuma revista encontrada!</p>
        
        </div>
      )}
    </section>
  );
};

export default Magazines;
