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
  Text,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
const ArticleHome = () => {
  const { data: session, status } = useSession();

  //@ts-ignore
  const token = session?.user.token;
  const query = useSearchParams();
  const page = query.get("page") as string;
  const [articles, setArticles] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);

  const getArticles = async () => {
    try {
      //@ts-ignore
      const token = session?.user.token;
      const articles = await fetch(`${baseURL}articles?page=${page}`, {
        method: "GET",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await articles.json();
      setArticles(response.articles);
      setTotalPages(response.total);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
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
    } = filterValues;
    try {
      const magazines = await fetch(
        `${baseURL}articles?author=${authorValue}&name=${nameValue}&company=${companyValue}&volume=${volumeValue}&category=${categoryValue}&take=${selectvalue}&status=${categoryValueArticle}`,
        {
          method: "GET",
          cache: "no-cache",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const response = await magazines.json();
      setArticles(response.articles);
      setTotalPages(response.total);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }

    return;
  };
  const deletArticle = async (id: any, name: any) => {
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
        const deletArticle = await fetch(`${baseURL}delet-article`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id, name }),
        });

        await Swal.fire(
          `Artigo ${name} deletado com sucesso!!`,
          "Clica no botão para continuar!",
          "success"
        );
        await getArticles()
          
          
      } catch (error) {
        console.log(error);
        //Exibe o modal de erro caso exista um
        await Swal.fire(
          "Erro ao deletar o artigo!",
          "Clica no botão para continuar!",
          "error"
        );
      }
    }
  };
  const switchName = (name: string) => {
    let result;

    switch (name) {
      case "free":
        result = "Gratuito";
        break;
      case "recommended":
        result = "Recomendado";
        break;
      case "trend":
        result = "Tendencias";
        break;
      default:
        result = "Sem categoria";
    }

    return result;
  };
  useEffect(() => {
    if (status === "authenticated") {
      getArticles();
      return;
    }
  }, [page, status]);
  if (loading) {
    return (
      <section className="w-full h-screen flex flex-col items-center justify-center px-4 ">
        <Spinner />
      </section>
    );
  }

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
  return (
    <section className="container mx-auto h-full  flex  flex-col items-center  px-4 gap-4  bg-white ">
     <div className="w-full flex flex-col md:flex-row items-center justify-between ">
     <h1 className="uppercase text-gray-400">Artigos Cadastrados </h1>
        <div className=" flex items-center justify-center mt-4">
          <Link
           href={"/dashboard/artigos/cadastrar"}
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
      <div className=" w-full h-full  md:flex md:h-[100px] items-center justify-around">
      <Filter
          onSubmitFilter={handlFilter}
          labels={labels}
          placeholders={placeholders}
          showAuthor={true}
          showName={true}
          showVol={true}
          showCompany={true}
          selectShow={true}
        />
      </div>
      {articles.length === 0 ? (
        <div className="w-full h-full py-2 flex flex-col items-center justify-center gap-4">
          <p className="text-gray-400">Nenhum artigo encontrado!</p>
      
          
        </div>
      ) : (
        <div className="w-full">
          <TableContainer width={"100%"}>
            <Table variant="simple">
              <TableCaption>Artigos Cadastrados</TableCaption>
              <Thead background={"#14b7a1"}>
                <Tr>
                  <Th color={"white"}>Image</Th>
                  <Th color={"white"}>Autor</Th>
                  <Th color={"white"}>Nome</Th>
                  <Th color={"white"}>Revista</Th>
                  <Th color={"white"}>Editora</Th>
                  <Th color={"white"}>Volume</Th>
                  <Th color={"white"}>Categorias</Th>
                  <Th color={"white"}>Ações</Th>
                </Tr>
              </Thead>
              <Tbody>
                {articles?.map((book: any, index: any) => (
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
                    <Td>
                      <Text
                        maxW="180px"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                      >
                        {book.magazine.name}
                      </Text>
                    </Td>

                    <Td>{book?.company}</Td>
                    <Td>{book.volume}</Td>
                    <Td className="capitalize">{switchName(book.status)}</Td>

                    <Td>
                      <div className="w-full h-full ">
                        <Link href={`/dashboard/artigos/${book.id}`}>
                          <button className="text-[#005183]">Editar</button>
                        </Link>
                      </div>
                      <button
                        className="text-red-500"
                        onClick={() => {
                          deletArticle(book.id, book?.name);
                        }}
                      >
                        Deletar
                      </button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <div className="flex items-center justify-center my-2">
            <Pagination totalPages={totalPages} pageParam="page" />
          </div>

        
        </div>
      )}
    </section>
  );
};

export default ArticleHome;
