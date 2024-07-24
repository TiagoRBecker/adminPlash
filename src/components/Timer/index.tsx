"use client";
import { useState, useEffect } from "react";

const TimerComponent = ({ eventTimestamp }:any) => {
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    // Calcula o tempo restante inicial
    const now = new Date().getTime();
    const timeDifference = eventTimestamp - now;
    setTimeRemaining(timeDifference);

    // Atualiza o tempo restante a cada segundo
    const interval = setInterval(() => {
      const currentTime = new Date().getTime();
      const newTimeRemaining = eventTimestamp - currentTime;
      setTimeRemaining(newTimeRemaining);
    }, 1000);

    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(interval);
  }, [eventTimestamp]);

  // Função para formatar o tempo restante
  const formatTimeRemaining = (time:number) => {
    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);

    const formattedDays = String(days).padStart(2, "0");
    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");
    return (
      <div className="flex flex-col  gap-2 ">
        <div className="flex  gap-2">
          <div className="flex flex-col items-center justify-center">
          <div className="flex items-center">
            <p className="text-[28px] flex items-center justify-center">
              {formattedDays}
            </p>
            <p>:</p>
          </div>
          <p className="text-[11px]">Dias</p>
          </div>
          <div className="flex flex-col items-center justify-center">
          <div className="flex items-center">
            <p className="text-[28px] flex items-center justify-center">
              {formattedHours}
            </p>
            <p>:</p>
          </div>
          <p className="text-[11px]">Horas</p>
          </div>
          <div className="flex flex-col items-center justify-center">
          <div className="flex items-center">
            <p className="text-[28px] flex items-center justify-center">
              {formattedMinutes}
            </p>
            <p>:</p>
          </div>
          <p className="text-[11px]">Min</p>
          </div>
          <div className="flex flex-col items-center justify-center">
          <div className="flex items-center">
            <p className="text-[28px] flex items-center justify-center">
              {formattedSeconds}
            </p>
            <p>:</p>
          </div>
          <p className="text-[11px]">Sec</p>
          </div>
         
    
          
        
          
        </div>
      
      </div>
    );
  };

  return <>{formatTimeRemaining(timeRemaining)}</>;
};

export default TimerComponent;
