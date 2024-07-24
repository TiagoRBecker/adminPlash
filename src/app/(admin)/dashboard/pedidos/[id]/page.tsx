"use client";
import Spinner from "@/components/Spinner";
import { baseURL } from "@/components/utils/api";
import { Order, order } from "@/components/utils/validation";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
type Orders = {
  id: number;
  items: [
    {
      id: number;
      title: string;
      quantity: number;
      model: string;
    }
  ];
  user: {
    name: string;
    lastName: string;
  };
  amout: number;
  codeEnv: string;
  complement: string;
  country: string;
  createDate: string;
  neighborhood: string;
  phone: string;
  state: string;
  status: string;
  street: String;
  street_number: string;
  updateAt: string;
  userId: number;
  zip_code: string;
};
const OrderId = ({ params }: { params: { id: string } }) => {
   
  const {data:session,status} = useSession()
  useEffect(()=>{
    if(status === "authenticated"){
      getOrderID()
      return
    }
  
  },[status])
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Orders | null>(null);

  const getOrderID = async () => {
       
       try {
        //@ts-ignore
        const token = session?.user.token
        const order = await fetch(`${baseURL}order/${params.id}`, {
    
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization:`Bearer ${token}`
          },
        });
        const response = await order.json();
        setOrders(response);
        setLoading(false);
       } catch (error) {
         console.log(error)
       }
     
    return;
  };
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    watch,

    formState: { errors },
  } = useForm<Order>({
    mode: "all",
    resolver: zodResolver(order),
  });
  const cod = watch("codEnv");

  const onSubmit = handleSubmit(async (data) => {
    const del = await Swal.fire({
      position: "center",
      title: "Tem certeza?",
      text: `Você adicionar editar a Ordem de serviço ${orders?.id}?`,
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#d55",
      confirmButtonText: "Adicionar",
      confirmButtonColor: "#00FF00",
    });
    if (del.isConfirmed) {
      try {
        
         //@ts-ignore
        const token = session?.user.token
        const updateOrder = await fetch(`${baseURL}order/${params.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            
           Authorization:`Bearer ${token}`
          },

          body: JSON.stringify({ data }),
        });

        if (updateOrder.status === 200) {
          await Swal.fire(
            "Ordem de serviço  atualizada com sucesso!!",
            "Clica no botão para continuar!",
            "success"
          );
          router.push("/dashboard/pedidos");

          return;
        }
      } catch (error) {
        //Exibe o modal de erro caso exista um
        await Swal.fire(
          "Erro ao atualizar a ordem de serviço!",
          "Clica no botão para continuar!",
          "error"
        );
      }
    }
  });

  if (loading) {
    return (
      <div className=" w-full h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }
  
  return (
    <section className="container mx-auto h-full  flex  flex-col items-center  p-2 gap-4  bg-white ">
      <div className="w-full gap-3 h-full flex-col-reverse md:flex md:flex-row justify-center">
        <div className="w-full md:w-[70%]">
          <h1 className="py-2">Produtos para entrega</h1>
          <div className="w-full border-b-[1px] border-gray-400 flex gap-4">
          <TableContainer width={"100%"}>
            <Table variant="simple" py={20}>
              <TableCaption>Detalhes do pedido</TableCaption>
              <Thead background={"#14b7a1"}>
                <Tr>
                  <Th color={"white"}>Data</Th>
                  <Th color={"white"}>Modelo</Th>
                  <Th color={"white"}>Nome</Th>
                  <Th color={"white"}>Volume</Th>
                  <Th color={"white"}>Qtd</Th>
                  <Th color={"white"}>Status</Th>
                </Tr>
              </Thead>
              {orders?.items.map((item, index:number) => (
                 <Tbody key={index}>
                <Tr>
                  <Td>
                    {
                      new Date(orders?.createDate as any).toLocaleDateString(
                        "pt-br"
                      ) as any
                    }
                  </Td>
                  <Td className="capitalize">{item?.model}</Td>
                  <Td>{item?.title}</Td>
                  <Td>{item?.quantity}</Td>
                  <Td>1</Td>
                  <Td className="capitalize">
                    {item?.model === "Digital" ? "Biblioteca" : orders?.status}
                  </Td>
                </Tr>
             </Tbody>
              ))}
            </Table>
            </TableContainer>
          </div>
          <form className="w-full py-4 " onSubmit={onSubmit}>
            <div className="w-full flex flex-col md:flex md:flex-row  gap-4">
              <div className="w-full md:w-[50%] flex flex-col gap-2">
                Atualizar Status
                <select
                  className="w-full py-3 border-[1px] border-gray-400 rounded-md pl-2 outline-none"
                  {...register("status")}
                >
                  <option value="">Selecionar Status</option>
                  <option value="enviado">Enviado</option>
                  <option value="entregue">Entregue</option>
                </select>
                {errors.status && (
                  <p className="text-red-600">{errors.status.message}</p>
                )}
              </div>
              <div className="w-full md:w-[50%] flex flex-col gap-2">
                <label htmlFor="">Codigo de Rastreio</label>
                <input
                  {...register("codEnv")}
                  type="text"
                  className="w-full py-3 border-[1px] border-gray-400 rounded-md pl-2 outline-none"
                  placeholder="Insira o codigo dos correios"
                />
                {errors.codEnv && (
                  <p className="text-red-600">{errors.codEnv.message}</p>
                )}
              </div>
            </div>
            <div className="w-full flex items-center justify-center pt-4">
              <button
                type="submit"
                className="w-40 bg-[#14b7a1] text-white rounded-md py-2"
              >
                Atualizar Ordem
              </button>
            </div>
          </form>
        </div>
        <div className="w-full py-4 md:w-[30%] bg-[#14b7a1] flex flex-col gap-3 px-4 rounded-md">
          <h1 className="text-center text-lg font-bold text-white">
            Detalhes Comprador
          </h1>
          <div className="flex flex-col gap-2">
            <div className="w-full px-1 md:w-[400px] bg-white rounded-md h-10 flex items-center pl-2">
              <h1>
                Nome:{orders?.user.name} {orders?.user.lastName}
              </h1>
            </div>
            <div className=" bg-white rounded-md h-10 flex items-center pl-2">
              <Link
                target="_blank"
                href={`https://api.whatsapp.com/send?phone=55${orders?.phone}&text=Seu%20pedido%20acaba%20de%20ser%20enviado.%20Obrigado%20por%20escolher%20nossos%20servi%C3%A7os!%0AAcompanhar%20Pedido:%20${cod}`}
              >
                <p>Telefone:{orders?.phone}</p>
              </Link>
            </div>
            <div className=" bg-white rounded-md h-10 flex items-center pl-2">
              <p>Complemento: {orders?.complement}</p>
            </div>
            <div className=" bg-white rounded-md h-10 flex items-center pl-2">
              <p>
                End:{orders?.street} / N°{orders?.street_number}
              </p>
            </div>
            <div className=" bg-white rounded-md h-10 flex items-center pl-2">
              <p>Bairro:{orders?.neighborhood}</p>
            </div>
            <div className=" bg-white rounded-md h-10 flex items-center pl-2">
              <p>Cidade: </p>
            </div>
            <div className=" bg-white rounded-md h-10 flex items-center pl-2">
              <p>Cep: {orders?.zip_code}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderId;
