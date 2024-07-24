"use client"
import { Table, TableCaption, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import Link from "next/link";

const tableEmployyes = ({users}:any) => {
   
    return (  
 <TableContainer width={"100%"}>
    <Table variant="simple" fontSize={14}>
      <TableCaption>Usuários</TableCaption>
      <Thead background={"#14b7a1"}>
        <Tr>
          <Th color={"white"}>Image</Th>
          <Th color={"white"}>Nome</Th>
          <Th color={"white"}>Email</Th>
       
       
        
       
        </Tr>
      </Thead>
        {users?.map((user: any, index:number) => (
      <Tbody key={index}>
          <Tr>
            <Td>
              <img
                src={"/user.png"}
                alt={user.name}
                className="w-14 h-14 rounded-full object-cover"
              />
            </Td>
            <Td>{user.name}</Td>
            <Td>{user?.email}</Td>

         
        

      
          
          </Tr>
      </Tbody>
        ))}
    </Table>
  </TableContainer> );
}
 
export default tableEmployyes;