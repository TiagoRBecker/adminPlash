"use client"
import { Table, TableCaption, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";


const tableEmployyes = ({employees}:any) => {
   
    return (  
 <TableContainer width={"100%"}>
    <Table variant="simple" fontSize={14}>
      <TableCaption>Colaboradores</TableCaption>
      <Thead background={"#14b7a1"}>
        <Tr>
          <Th color={"white"}>Image</Th>
          <Th color={"white"}>Nome</Th>
          <Th color={"white"}>Email</Th>
       
       
        
       
        </Tr>
      </Thead>
        {employees?.map((employee: any, index:number) => (
      <Tbody key={index}>
          <Tr>
            <Td>
              <img
                src={employee.avatar}
                alt={employee.name}
                className="w-14 h-14 rounded-full object-cover"
              />
            </Td>
            <Td>{employee.name}</Td>
            <Td>{employee?.email}</Td>

         
        

      
          
          </Tr>
      </Tbody>
        ))}
    </Table>
  </TableContainer> );
}
 
export default tableEmployyes;