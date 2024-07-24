"use client";
import Spinner from "@/components/Spinner";
import { baseURL } from "@/components/utils/api";
import { Order, order } from "@/components/utils/validation";
import {
  Box,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import Swal from "sweetalert2";
type User = {
  id: number;
  name: string;
  lastName: string;
  avatar: string;
  amout: number;
  codeEnv: string;
  complement: string;
  country: string;
  createDate: string;
  district: string;
  phone: string;
  state: string;
  status: string;
  adress: String;
  numberAdress: string;
  updateAt: string;
  userId: number;
  city: string;
  cep: string;
  email:string
};
const OrderId = ({ params }: { params: { id: string } }) => {
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === "authenticated") {
      getOrderID();
      return;
    }
  }, [status]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [total, setTotal] = useState<Number | null>(null);
  const [pay, setPay] = useState(0);

  const getOrderID = async () => {
    try {
      //@ts-ignore
      const token = session?.user.token;
      const order = await fetch(`${baseURL}users/${params.id}`, {
        method: "GET",
        cache: "no-cache",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await order.json();
     
      setTotal(response.user.availableForWithdrawal);
      setUser(response.user);
      setLoading(false);
      return;
    } catch (error) {
      console.log(error);
      return;
    }
  };
  //@ts-ignore
  const dvlTotal = user?.dvlClient.reduce(
    (acc: any, currentValue: any) => acc + currentValue.price,
    0
  );

  //Calcula valor a receber
  //@ts-ignore
  const receive = user?.dvlClient.reduce(
    (acc: any, currentValue: any) => acc + currentValue.paidOut,
    0
  );
  //Calcula o pago
  //@ts-ignore
  const payDvl = user?.dvlClient.reduce(
    (acc: any, currentValue: any) => acc + currentValue.toReceive,
    0
  );

  const onSubmit = async (e: any) => {
    e.preventDefault();
    const custom = "flex items-center";
    //@ts-ignore
    if (Number(pay) > Number(total)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        //@ts-ignore
        text: `Valor inserido superior ao saque disponivél. Inisira  um valor maior ou menor que ${Number(
          total as any
        ).toLocaleString("pt-br", { style: "currency", currency: "BRL" })}`,
      });
      return;
    }
    const updateFincance = await Swal.fire({
      position: "center",
      title: "Tem certeza?",
      text: `Deseja atualizar o dvl para o cliente  ${user?.name}?`,
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#d55",
      confirmButtonText: "Adicionar",
      confirmButtonColor: "#00FF00",
    });
    if (updateFincance.isConfirmed) {
      try {
        //Atualiza o saque solicitado pelo cliente
        //@ts-ignore
        const token = session?.user.token;
        const updateStatus = await fetch(
          `${baseURL}user/finance/${params.id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
        
                Authorization: `Bearer ${token}`,
              
            },
            body:JSON.stringify({pay})
          }
        );
         const response = await updateStatus.json()
        
        if (updateStatus.status === 200) {
          await Swal.fire(
            "Saque disponível atualizado com sucesso !!",
            "Clica no botão para continuar!",
            "success"
          );
          router.push("/dashboard/financeiro/clientes");

          return;
        }
      } catch (error) {
        //Exibe o modal de erro caso exista um
        await Swal.fire(
          "Erro ao atualizar a revista!",
          "Clica no botão para continuar!",
          "error"
        );
      }
    }
  };

  if (loading) {
    return (
      <div className=" w-full h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }
 
  return (
    <section className="container h-full mx-auto mt-12 py-10 px-4">
      <div className="w-full grid grid-cols-1 gap-3">
      <div className="w-full h-full py-4  bg-[#14b7a1] flex flex-col gap-3 px-4 rounded-md">
          <h1 className="text-center text-lg font-bold text-white">
            Dados do Usuário
          </h1>
          <div className="flex flex-col gap-2">
            <div className="w-full h-24 flex items-center justify-center">
              <img
                src={"/1.png"}
                alt={user?.name}
                className="w-24 h-24 rounded-full flex items-center justify-center object-cover"
              />
            </div>
            <div className="w-full bg-white rounded-md h-10 flex items-center pl-2">
              <h1 className="">
                ID: <strong>{user?.id}</strong>
               
              </h1>
            </div>
            <div className="w-full bg-white rounded-md h-10 flex items-center pl-2">
              <h1 className="capitalize">
                Nome: <strong>{user?.name}</strong>{" "}
                <strong>{user?.lastName}</strong>
              </h1>
            </div>
            <div className="w-full bg-white rounded-md h-10 flex items-center pl-2">
              <h1 className="">
                Email: <strong>{user?.email}</strong>
               
              </h1>
            </div>

            <div className="w-full bg-white rounded-md h-10 flex items-center pl-2">
              <p className="capitalize">
                Complemento: <strong>{user?.complement}</strong>
              </p>
            </div>
            <div className="w-full bg-white rounded-md h-10 flex items-center pl-2">
              <p className="capitalize">
                End: <strong>{user?.adress}</strong> / N°
                <strong> {user?.numberAdress}</strong>
              </p>
            </div>
            <div className="w-full bg-white rounded-md h-10 flex items-center pl-2">
              <p>
                Bairro: <strong>{user?.district}</strong>
              </p>
            </div>
            <div className="w-full bg-white rounded-md h-10 flex items-center pl-2">
              <p className="capitalize">
                Cidade: <strong>{user?.city}</strong>
              </p>
            </div>
            <div className="w-full bg-white rounded-md h-10 flex items-center pl-2">
              <p>
                Cep: <strong>{user?.cep}</strong>
              </p>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col ">
          <h1 className="py-2">Pagar Saque Solicitado</h1>
          <div className="w-full  grid grid-cols-2 md:grid md:grid-cols-4">
            <Box shadow={"2xl"} bg="white" p={8} color="black" w={"90%"}>
              <h2 className="text-center">Total</h2>
              <div className="w-full flex items-center justify-center gap-2">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-10 h-10 text-black"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </span>
                <p className="font-bold">
                  {Number(dvlTotal * 2).toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </div>
            </Box>
            <Box shadow={"2xl"} bg="#d96060" p={8} color="white" w={"90%"}>
              <h2 className="text-center">A Receber</h2>
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
                <p>
                  {Number(receive).toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </div>
            </Box>
            <Box shadow={"2xl"} bg="green" p={8} color="white" w={"90%"}>
              <h2 className="text-center">Pago</h2>
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
                <p>
                  {Number(payDvl).toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </div>
            </Box>
            {Number(total) < 30 ? (
              <Box shadow={"2xl"} bg="red" p={8} color="white" w={"90%"}>
                <h2 className="text-center">Dispoivel para saque</h2>
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
                  <p>
                    {Number(total).toLocaleString("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                </div>
              </Box>
            ) : (
              <Box shadow={"2xl"} bg="green" p={8} color="white" w={"90%"}>
                <h2 className="text-center">Dispoivel para saque</h2>
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
                  <p>
                    {Number(total).toLocaleString("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                </div>
              </Box>
            )}
          </div>

        {Number(total) > 30 && 
            <form className="w-full py-4 " onSubmit={onSubmit}>
              <div className="w-full flex  gap-4">
                <div className="w-full flex flex-col gap-2">
                  <label htmlFor="" className="font-bold">Valor do Pagamento</label>
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
                    className="w-full py-3 border-[1px] border-gray-400 rounded-md pl-2 outline-none"
                  />
                </div>
              </div>
              <div className="w-full flex items-center justify-center pt-4">
                <button
                  type="submit"
                  className="w-[50%] bg-[#14b7a1] text-white rounded-md py-2"
                >
                  Atualizar Pagamento
                </button>
              </div>
            </form>
}
        </div>
        
      </div>
    </section>
  );
};

export default OrderId;
