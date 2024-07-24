import React from "react";
import Chart from "./chartOrder";



const ChartContainer = () => {

  return (
    <div className="w-full h-full">
      <h1 className="w-full text-left text-[24px] font-bold  lg:text-[19px] text-dark-brown tracking-[-.0065em]  mb-4">
      Relatório  total anual de Pedidos
      </h1>
      <div className="pt-4 pb-[14px] px-[14px] lg:px-[28px] lg:mb-[12px] lg:pt-[27px]">
        <Chart />
      </div>
    

      <hr className="w-[86%] h-[2px] bg-medium-brown border-0 mx-auto opacity-20 " />
     
     
    </div>
  );
};

export default ChartContainer;