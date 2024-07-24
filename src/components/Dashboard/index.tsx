"use client";
import Link from "next/link";
import { menuLinks } from "../Mock";
import {  useRouter } from "next/navigation";

import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
} from "@chakra-ui/react";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
const Dash = ({ onClose }: any) => {
  const {data:session} = useSession()
 

  
  return (
    <div className="w-full h-full">
      <nav className="w-full h-full flex flex-col gap-2">
        <Accordion  border={0}>
          {menuLinks.map((links, index) => (
         
              <AccordionItem border={"none"} key={index} color={"white"} pb={4}>
                <h2>
                  <AccordionButton>
                    <Box
                      as="span"
                      display="flex"
                      gap="3"
                      flex="1"
                      textAlign="left"
                      color={"white"}
                    >
                      {links.icon} {links.name}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  {links.links.map((link, index) => (
                    <AccordionPanel
                      pb={4}
                      pl={14}
                      key={index}
                      color={"white"}
                      onClick={onClose}
                    >
                      <Link href={link.path}>{link.name}</Link>
                    </AccordionPanel>
                  ))}
                </h2>
              </AccordionItem>
              
           
          ))}
          <AccordionItem border={"none"}  pb={4}  >
            <Box w={"100"} display={"flex"} gap={2} bg={"rgb(35, 175, 219)"} py={5} borderRadius={3} alignItems={"center"} justifyContent={"space-around"}>
             <div className="flex gap-3 items-center ">
              <img src="/user.png" alt="Perfil" className="w-10 h-10 rounded-full object-fill" />
              <div className="flex flex-col text-white">
               <h1 className="font-bold">{session?.user?.name}</h1>
               <p>Editor  Chefe </p>
              </div>
             </div>
             <div className="flex items-center">
             <svg onClick={()=>signOut()} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="w-10 h-10 text-white cursor-pointer"><path d="M7 6a7.75 7.75 0 1 0 10 0"></path><path d="M12 4l0 8"></path></svg>
             </div>

            </Box>
               
          </AccordionItem>
        </Accordion>
      </nav>
    </div>
  );
};

export default Dash;
