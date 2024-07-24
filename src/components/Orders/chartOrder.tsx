"use client";

import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TooltipPositionerFunction,
  ChartType,
  ChartEvent,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { baseURL } from "../utils/api";
import { useSession } from "next-auth/react";

function getWindowSize() {
  if (typeof window !== "undefined") {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  }
  return { innerWidth: 0, innerHeight: 0 }; // Default values when executed in a non-browser environment
}

type ChartData = {
  day: string;
  amount: number;
};

type TooltipContext = {
  dataset: {
    label?: string;
  };
  parsed: {
    y: number;
  };
};

type ChartContainerProps = {
  chartData: ChartData[];
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

declare module "chart.js" {
  interface TooltipPositionerMap {
    myCustomPositioner: TooltipPositionerFunction<ChartType>;
  }
}

const Chart = () => {

  const [windowSize, setWindowSize] = useState(getWindowSize());
  const [orderDB, setOrdersDB] = useState([]);


  ChartJS.defaults.color = "hsl(28, 10%, 53%)";
  ChartJS.defaults.font.size = 11.5;
  ChartJS.defaults.font.weight = 300;

  const tickPadding = windowSize.innerWidth < 1024 ? 8 : 2;
  const fontSize = windowSize.innerWidth < 1024 ? 11.5 : 13;
  const {data:session,status} = useSession()

  const options = {
    // turn cursor to point if chartElement (bar) is hovered by targeting the css of the event
    onHover: (event: ChartEvent, chartElement: string | any[]) => {
      if (Array.isArray(chartElement) && chartElement.length > 0) {
        const target = event.native?.target;
        if (target instanceof HTMLElement) {
          target.style.cursor = "pointer";
        }
      } else {
        const target = event.native?.target;
        if (target instanceof HTMLElement) {
          target.style.cursor = "default";
        }
      }
    },
    responsive: true,

    plugins: {
      legend: {
        position: "top" as const,
        display: false,
      },

      title: {
        display: false,
        text: "Chart.js Bar Chart",
      },
      tooltip: {
        displayColors: false,
        xAlign: "center" as const,
        yAlign: "bottom" as const,
        caretSize: 0,

        caretPadding: 6,
        backgroundColor: "hsl(25, 47%, 15%)",
        callbacks: {
          title: function () {
            return "";
          },
          label: function (context: TooltipContext) {
            let label = "";
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "BRL",
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        display: false,
      },
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          padding: tickPadding, // Increase the padding between bars and labels
          font: {
            size: fontSize,
          },
        },
      },
    },
    layout: {
      padding: {
        top: 11,
        // bottom: -2,
      },
    },
    maintainAspectRatio: false,
  };

    const monthNames = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];

  
    const orders = async () => {
      //@ts-ignore
      const token = session?.user.token;
      const request = await fetch(`${baseURL}chart`, {
        method: "GET",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      const response = await request.json();
    
      const monthlyAmounts = response.reduce((acc:any, order:any) => {
        const orderDate = new Date(order.createDate);
        const month = orderDate.getMonth(); // Mês de 0 a 11
  
        // Inicializa o total do mês se não existir
        if (!acc[month]) {
          acc[month] = 0;
        }
  
        // Adiciona o amount da ordem ao total do mês
        acc[month] += order.amout / 100;
  
        return acc;
      }, Array(12).fill(0)); // Cria um array de 12 meses inicializado com 0
  
      setOrdersDB(monthlyAmounts);
    };

  useEffect(() => {
    if(status === "authenticated"){
      orders();
      return
    }
    

    function handleWindowResize() {
      const newWindowSize = getWindowSize();
      setWindowSize(newWindowSize);
    }

    // Initial calculation
    handleWindowResize();

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [status]);

  
  const backgroundColors = orderDB.map((c:any) => {
    if (c <= 250) {
      return "red";
    } else {
       return "green";
    }
  });
  
  const hoverBackgroundColors = orderDB.map((c:any) => {
    if (c > 0) {
      return "#B4DFE5";
    } else {
      return "#ff2c2c";
    }
  });
 
  const data = {
    labels:monthNames,
    datasets: [
      {
        data:orderDB ,
        backgroundColor: backgroundColors,
        borderRadius: windowSize.innerWidth < 1024 ? 4 : 5,
        hoverBackgroundColor: hoverBackgroundColors,
        borderSkipped: false,
        barThickness: windowSize.innerWidth < 1024 ? 32 : 45,
        color:
          "hsl(25.090909090909097, 47.41379310344826%, 45.490196078431374%)",
      },
    ],
  };
  return (
    <Bar options={options} data={data} className="h-[220px] lg:max-h-[198px]" />
  );
};

export default Chart;
