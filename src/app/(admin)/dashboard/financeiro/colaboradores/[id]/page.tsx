"use client";
import Spinner from "@/components/Spinner";
import { baseURL } from "@/components/utils/api";
import {
  Box,
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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import Swal from "sweetalert2";

const EmployeeId = ({ params }: { params: { id: string } }) => {
   const router = useRouter()
  const slug = params.id;
  const { data: session, status } = useSession();
  const [employee, setEmployee] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [pay ,setPay] = useState(0)
  const [errorText, setErrorText] = useState(false)
  useEffect(() => {
    if (status === "authenticated") {
      getUserId();
      return;
    }
  }, [status]);
  const getUserId = async () => {
    //@ts-ignore
    const token = session?.user.token;
    const get = await fetch(`${baseURL}employee/${slug}`, {
      method: "GET",
      cache:"no-cache",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (get.status == 200) {
      const data = await get.json();
      setEmployee(data);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="w-full h-screen flex items-center justify-center">
        <Spinner />
      </section>
    );
  }
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = employee.magazines?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePrevClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentItems && currentItems.length === itemsPerPage) {
      setCurrentPage(currentPage + 1);
    }
  };
  const updateCommissionEMployee = async (e: any, id:number) => {
    e.preventDefault();
    setErrorText(false);
    if (Number(pay) === 0) {
      setErrorText(true);
      return;
    }
    if (pay > employee.availableForWithdrawal) {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "O valor á pagar e maior do que o colaborado tem para receber. Tente novamente!",
      });
      return;
    }

    try {
      const payCommission = await Swal.fire({
        position: "center",
        title: "Tem certeza?",
        text: `Você deseja pagar a comissão para o colaborador ${employee.name}?`,
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        cancelButtonColor: "#d55",
        confirmButtonText: "Adicionar",
        confirmButtonColor: "#00FF00",
      });
      if (payCommission.isConfirmed) {
        //deleta a categoria e apos exibe  um modal Categoria deletada com sucesso!
        //@ts-ignore
        const token = session?.user.token;
        const update = await fetch(
          `${baseURL}employee/finance`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },

            body: JSON.stringify({ pay, id }),
          }
        );
        if (update.status === 200) {
          const response = await update.json();
          await Swal.fire(
            "Comissão paga com sucesso !!",
            "Clica no botão para continuar!",
            "success"
          );
          router.push(`/dashboard/financeiro/colaboradores`);
          return;
        }
      }
    } catch (error) {
      console.log(error);
      //Exibe o modal de erro caso exista um
      await Swal.fire(
        "Erro ao criar o evento!",
        "Clica no botão para continuar!",
        "error"
      );
    }
  };
  return (
    <section className="container mx-auto h-full  flex  flex-col items-center  p-2 gap-4  bg-white ">
      <div className="w-full h-full mt-12 gap-3 flex-col-reverse md:flex md:flex-row justify-center md:gap-3">
        <div className="w-full md:w-[70%]">
          <div className="border-b-[1px] border-gray-400 flex gap-4">
            <TableContainer width={"100%"}>
              <h1 className="w-full text-left text-xl py-4 text-gray-400">
                Comissão Revistas
              </h1>
              <Table variant="simple">
                <TableCaption>DVLS á pagar</TableCaption>
                <Thead background={"#14b7a1"}>
                  <Tr>
                    <Th color={"white"}></Th>
                    <Th color={"white"}>Nome</Th>
                    <Th color={"white"}>Preço Revista</Th>
                    <Th color={"white"}>Receber</Th>
                    <Th color={"white"}>Recibido</Th>
                    <Th color={"white"}>Pagar</Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {employee.dvl_employee?.map((dvl: any, index: number) => (
                    <Tr key={index}>
                      <Td>
                        <img
                          src={dvl.picture}
                          alt={dvl.name}
                          className="w-16 h-16 object-cover"
                        />
                      </Td>
                      <Td>{dvl.name}</Td>

                      <Td>
                        <p>
                          {Number(dvl.price).toLocaleString("pt-br", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </p>
                      </Td>
                      <Td>
                        <p className="text-red-500">
                          {Number(dvl?.paidOut).toLocaleString("pt-br", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </p>
                      </Td>
                      <Td>
                        <p className="text-green-500">
                          {Number(dvl.toReceive).toLocaleString("pt-br", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </p>
                      </Td>
                      <Td>
                        {dvl.paidOut === 0 ? (
                          <p className="text-red-500">Finalizado</p>
                        ) : (
                          <Link
                            href={`/dashboard/financeiro/colaboradores/${employee.id}/${dvl.id}`}
                          >
                            <p className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-8 h-8 text-white"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                />
                              </svg>
                            </p>
                          </Link>
                        )}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </div>
          <div className="flex justify-between w-full mt-4">
            <button
              className="bg-[#14b7a1] text-white rounded-md px-4 py-2 cursor-pointer"
              onClick={handlePrevClick}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            <button
              className="bg-[#14b7a1] text-white rounded-md px-4 py-2 cursor-pointer"
              onClick={handleNextClick}
              disabled={!currentItems || currentItems.length < itemsPerPage}
            >
              Próximo
            </button>
          </div>
        </div>
        <div className="w-full mt-4 md:w-[30%] flex flex-col gap-3 px-4">
          <div className="w-full h-full py-4  bg-[#14b7a1] flex flex-col gap-3 px-4 rounded-md">
            <h1 className="text-center text-lg font-bold text-white">
              Dados do Usuário
            </h1>
            <div className="flex flex-col gap-2">
              <div className="w-full h-24 flex items-center justify-center">
                <img
                  src={employee.avatar}
                  alt={employee?.name}
                  className="w-24 h-24 rounded-full flex items-center justify-center object-cover"
                />
              </div>
              <div className="w-full bg-white rounded-md h-10 flex items-center pl-2">
                <h1 className="">
                  ID: <strong>{employee?.id}</strong>
                </h1>
              </div>
              <div className="w-full bg-white rounded-md h-10 flex items-center pl-2">
                <h1 className="capitalize">
                  Nome: <strong>{employee?.name}</strong>{" "}
                  <strong>{employee?.lastName}</strong>
                </h1>
              </div>
              <div className="w-full bg-white rounded-md h-10 flex items-center pl-2">
                <h1 className="">
                  Email: <strong>{employee?.email}</strong>
                </h1>
              </div>

              <div className="w-full bg-white rounded-md h-10 flex items-center pl-2">
                <p className="capitalize">
                  Profissão: <strong>{employee?.profession}</strong>
                </p>
              </div>
              <div className="w-full bg-white rounded-md h-10 flex items-center pl-2">
                <p className="capitalize">
                  Telefone: <strong>{employee?.phone}</strong>
                </p>
              </div>
            </div>
            {
              Number(employee.availableForWithdrawal) > 50 ? 
               <div>
              <Box shadow={"2xl"} bg="green" p={8} color="white" w={"100%"}>
              <h2 className="text-center">Disponível para saque!</h2>
              <div className="w-full flex items-center justify-center gap-2">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-10 h-10 text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </span>
                <p className="font-bold">
                  {Number(employee.availableForWithdrawal).toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </div>
            </Box>
            <form
                className="w-full flex items-center justify-center md:flex flex-col mx-auto   gap-3 "
                onSubmit={(e:any)=>{updateCommissionEMployee(e,employee.id)}}
              >
                <div className="w-full flex flex-col gap-2">
                  <NumericFormat
                    value={Number(pay)}
                    onValueChange={(values) =>
                      setPay(Number(values.value as any))
                    }
                    displayType={"input"}
                    thousandSeparator={true}
                    prefix={"R$ "}
                    decimalSeparator={"."}
                    decimalScale={2}
                    fixedDecimalScale={true}
                    className="w-full h-full outline-none border-[1px] border-gray-400 rounded-sm py-2 pl-3"
                  />
                 
                </div>
                <button className="w-full px-4 py-2 bg-white  rounded-md text-black">
                  Pagar
                </button>
              </form>
              </div>
              :
              <Box shadow={"2xl"} bg="red" p={8} color="white" w={"100%"}>
              <h2 className="text-center">Disponível para saque!</h2>
              <div className="w-full flex items-center justify-center gap-2">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-10 h-10 text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </span>
                <p className="font-bold">
                  {Number(employee.availableForWithdrawal).toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </div>
            </Box>
            }
            
          </div>
         
        </div>
      </div>
    </section>
  );
};

export default EmployeeId;
