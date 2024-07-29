"use client";
import Filter from "@/components/Filter";
import { Pagination } from "@/components/Pagination";
import Loading from "@/components/Spinner";
import { baseURL, url } from "@/components/utils/api";
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
import Swal from "sweetalert2";

const sponsors = () => {
  const {data:session,status} = useSession()
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<any>(true);
  const [totalPages, setTotalPages] = useState(0);
  const query = useSearchParams();
  const page = query.get("page") || 1;
  const getSponsors = async () => {
     //@ts-ignore
     const token = session?.user.token 
    const sponsors = await fetch(`${baseURL}sponsors?page=${page}`, {
      method: "GET",
      cache: "no-cache",
      headers:{

        Authorization:`Bearer ${token}`
      },
    });
    const response = await sponsors.json();
   
    setData(response.sponsors);
    setTotalPages(response.finalPage)
    setLoading(false)
    return response;
  };
  const handleDeletEvent = async (id: number, name: string) => {
    const del = await Swal.fire({
      position: "center",
      title: "Tem certeza?",
      text: `Deseja deletar o  Patrocinador ${name}?`,
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#d55",
      confirmButtonText: "Deletar",
      confirmButtonColor: "#00FF00",
    });

    if (del.isConfirmed) {
      try {
        setLoading(true)
        //@ts-ignore
        const token = session?.user.token 
        const deletArticle = await fetch(`${baseURL}sponsor/delete/${id}`, {
          method: "DELETE",
          headers:{

            Authorization:`Bearer ${token}`
          },
        });
        if(deletArticle.status === 200){
          await Swal.fire(
            `${name} deletado com sucesso!!`,
            "Clica no botão para continuar!",
            "success"
          );
          await getSponsors()
          return
        }

      
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
  };
  const labels = {
    select: "Mostrar",
    author: "E-mail",
    name: "Nome",
    company: "Empresa",
    volume: "Telefone",
    
    filterButton: "Filtrar",
  };

  const placeholders = {
    select: "Mostrar",
    author: "E-mail",
    name: "Nome",
    company: "Empresa",
    volume: "Telefone",
   
    
  };
  const handlFilter = async (filterValues?: any) => {
    setLoading(true);
    const {
      selectvalue,
      authorValue,
      nameValue,
      companyValue,
      volumeValue,
  
    
    } = filterValues;
    try {
      //@ts-ignore
      const token = session?.user.token;
      const magazines = await fetch(
        `${baseURL}sponsors?name=${nameValue}&email=${authorValue}&company=${companyValue}&phone=${volumeValue}&take=${selectvalue}`,
        {
          method: "GET",
          cache: "no-cache",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const response = await magazines.json();
       setData(response.sponsors)
      setTotalPages(response.total)
      setLoading(false)
      return
    } catch (error) {
      console.log(error);
      setLoading(false)
    }

    return;
  };
  useEffect(() => {
    if(status === "authenticated"){
      getSponsors();
    }
   
  }, [status,page]);
   if(loading){
    return(
      <Loading/>
    )
   }
  return (
    <section className="container mx-auto h-full  flex  flex-col items-center  px-4 gap-4  bg-white  rounded-sm p-2">
        <div className="w-full flex flex-col md:flex-row items-center justify-between px-4">
        <h1  className="uppercase text-gray-400">Patrocinadores</h1>
        <div className=" flex items-center justify-center mt-4">
          <Link
           href={"/dashboard/sponsors/add_sponsors"}
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
              Adiconar 
            </button>
          </Link>
        </div>
      </div>
    <div className="w-full flex items-center justify-between px-4">
     <Filter
       onSubmitFilter={handlFilter}
       labels={labels}
       placeholders={placeholders}
       showName={true}
       showCompany={true}
       showAuthor={true}
       swhowCat={true}
       showVol={true}
      
     />
   </div>
      
      {data.length <= 0 ? (
        <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
          <p className="text-gray-400">Nenhuma patrocinador cadastrado!</p>
        
         
        </div>
      ) : (
        <div className="w-full h-full flex flex-col">
          <TableContainer width={"100%"}>
            <Table variant="simple" fontSize={14}>
              <TableCaption>Eventos</TableCaption>
              <Thead background={"#14b7a1"}>
                <Tr>
                  <Th color={"white"}>Image</Th>
                  <Th color={"white"}>Nome</Th>
                  <Th color={"white"}>Razão Social</Th>
                  <Th color={"white"}>E-mail</Th>
                  <Th color={"white"}>Telefone</Th>
                  <Th color={"white"}>Rede Social</Th>

                  <Th color={"white"}>Ações</Th>
                </Tr>
              </Thead>
              {data?.map((sponsor: any, index: number) => (
                <Tbody key={index}>
                  <Tr>
                    <Td>
                      <img
                        src={sponsor.cover}
                        alt={sponsor.company}
                        className="w-14 h-10 object-contain"
                      />
                    </Td>
                    <Td>{sponsor.name}</Td>
                    <Td>{sponsor.company}</Td>
                    <Td>{sponsor.email}</Td>
                    <Td>{sponsor.phone}</Td>
                    <Td>
                      <Link href={sponsor.url} target="_blank">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6 text-gray-400"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                          />
                        </svg>
                      </Link>
                    </Td>

                    <Td className="">
                    <div className="w-full h-full ">
                        <Link href={`/dashboard/sponsors/${sponsor.id}`}>
                          <button className="text-[#005183]">Editar</button>
                        </Link>
                      </div>
                      <button
                        className="text-red-500"
                        onClick={() =>
                          handleDeletEvent(sponsor.id, sponsor.name)
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
              <Pagination totalPages={totalPages} pageParam="page" />
            </div>
        
        </div>
      )}
    </section>
  );
};

export default sponsors;
