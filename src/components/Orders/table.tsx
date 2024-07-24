"use client";
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
import Link from "next/link";
type Orders ={
  id:number,
  status:string
updateAt:string
createDate:string
userId:number
userMasterId:number | null
codeEnv:string
user:
  {
    name:string,
    lastName:string,
    email:string,
    adress:string,
    city:string,
    district:string,
    cep:string,
    complement:string
  }
}
const Orders = ({ data }: any) => {
  return (
    <div className="w-full h-full flex flex-col  ">
       <h1 className="w-full text-left text-[24px] font-bold  lg:text-[19px] text-dark-brown tracking-[-.0065em]  mb-4">
        Ultimos pedidos adicionados
      </h1>
      <TableContainer width={"100%"}>
        <Table variant="simple">
          <TableCaption>Ultimos pedidos adicionados</TableCaption>
          <Thead background={"#14b7a1"}>
            <Tr>
              <Th color={"white"}></Th>
              <Th color={"white"}>ID</Th>
              <Th color={"white"}>Nome</Th>
              <Th color={"white"}>Email</Th>
              <Th color={"white"}>Status</Th>
              <Th color={"white"}> ID Correios</Th>
              <Th color={"white"}> Data</Th>
            </Tr>
          </Thead>
          {data?.map((order: Orders, index: number) => (
            <Tbody key={index}>
              <Tr>
                <Td>
                  <Link href={`/dashboard/pedidos/${order.id}`}>
                    <img src={"/new.png"} alt="new" />
                  </Link>
                </Td>
                <Td>{order.id}</Td>
              <Td>{order.user.name}</Td>
              <Td>{order.user.email}</Td>
              <Td className="capitalize">{order.status}</Td>
              <Td>{order.codeEnv ? order.codeEnv: "Objeto não postado."}</Td>
                <Td>{new Date(order.createDate).toLocaleString("pt-br")}</Td>
              </Tr>
            </Tbody>
          ))}
        </Table>
      </TableContainer>
    </div>
  );
};

export default Orders;
