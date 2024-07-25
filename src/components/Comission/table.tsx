
"use client"
import { Table, TableCaption, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import Link from "next/link";

const tableEmployyes = ({dvls}:any) => {
   
    return (  
        <TableContainer width={"100%"}>
        <Table variant="simple">
          <TableCaption> Últimos dvls pagos</TableCaption>
          <Thead background={"#14b7a1"}>
            <Tr>
            <Th color={"white"}>Image</Th>
              <Th color={"white"}>Nome</Th>
            
              <Th color={"white"}>Pago</Th>
              <Th color={"white"}>Status</Th>

             
            </Tr>
          </Thead>
          <Tbody>
            {dvls?.map((dvl: any, index: number) => (
              <Tr key={index}>
               
                <Td><img src={dvl.picture} alt={dvl.name}  className="w-16 h-16 object-cover"/></Td>
                <Td>{dvl.name}</Td>
               
                <Td className="text-green-500">
                  {Number(dvl.paidOut).toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </Td>
               
                <Td>
                  {dvl.toReceive === dvl.price ? (
                    <p className="text-red-500">Finalizado</p>
                  ) : (
                    <p className="text-blue-500">Ativo</p>
                  )}
                </Td>
             
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      

        )
}
 
export default tableEmployyes;