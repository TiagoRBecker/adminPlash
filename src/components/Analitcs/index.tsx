"use client"
import {
  Stat,
  StatArrow,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";

const googleAnalits = () => {
  return (
    <div className="w-full h-full">
     <h1 className="text-[24px] font-bold  lg:text-[29px] text-dark-brown tracking-[-.0065em] ">
        Google Analitcs
      </h1>
      <StatGroup width={"100%"} display="flex" gap={5}>
        <Stat boxShadow={"base"} p={[3, 3]}>
          <StatLabel>Visitantes</StatLabel>
          <StatNumber>345,670</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            23.36%
          </StatHelpText>
        </Stat>

        <Stat boxShadow={"base"} p={[3, 3]}>
          <StatLabel>Clicks</StatLabel>
          <StatNumber>45</StatNumber>
          <StatHelpText>
            <StatArrow type="decrease" />
            9.05%
          </StatHelpText>
        </Stat>
        <Stat boxShadow={"base"} p={[3, 3]}>
          <StatLabel>Dispositivos</StatLabel>
          <StatNumber>30</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            29.05%
          </StatHelpText>
        </Stat>
      </StatGroup>
     
    </div>
  );
};

export default googleAnalits;
