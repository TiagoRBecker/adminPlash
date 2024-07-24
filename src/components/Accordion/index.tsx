"use client"
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
} from "@chakra-ui/react";
 type Props ={
    name:string,
    name_button:string
 }
const Accordio = ({name , name_button}:Props) => {
  return (
    <Accordion  allowMultiple border={0}>
      <AccordionItem border={"none"} color={"black"} pb={4}>
        <h2>
          <AccordionButton>
            <Box
              as="span"
              display="flex"
              gap="3"
              flex="1"
              textAlign="left"
              color={"black"}
            >
           {name_button}
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}  color={"black"}>
          {name}
          </AccordionPanel>
        
        </h2>
      </AccordionItem>
      
    </Accordion>
  );
};

export default Accordio;
