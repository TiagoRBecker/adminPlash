"use client";
import TimerComponent from "@/components/Timer";
import { baseURL, url } from "@/components/utils/api";
import Link from "next/link";
import Loading from "../Spinner";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const Events = () => {
  const { data: session, status } = useSession();
  const [data, setData] = useState([]);
  const[ loading , setLoading] = useState(true)
  const getEvents = async () => {
    try {
      //@ts-ignore
      const token = session?.user.token;
      const events = await fetch(`${baseURL}event/last`, {
        method: "GET",
        cache: "no-cache",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const response = await events.json();
       
      setData(response);
setLoading(false)
      return response;
    } catch (error) {
      console.log(error)
    }
  };
  const currentDate = new Date();

  useEffect(() => {
    if (status === "authenticated") {
      getEvents();
      return
    }
  }, [status,<TimerComponent/>]);
  if(loading){
    return(
    <div className="w-full h-full">
      <p className="text-gray-300">Carregando conteudo aguarde...</p>
    </div>
    )
  }
  return (
    <div className="w-full h-full">
      <h1 className="w-full text-left text-[24px] font-bold  lg:text-[19px] text-dark-brown tracking-[-.0065em]  mb-4">
        Últimos eventos adicionados
      </h1>
      
      <div className="w-full  h-full grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 py-5">
        {data.map((events: any, index: number) => (
          <div className="w-full h-full " key={index}>
            <img
              src={events.cover}
              alt={events.name}
              className="w-full object-cover h-[240px] md:object-fill "
            />
            <p className="font-bold text-sm py-1 truncate">{events.name}</p>

            <p>{events.city}</p>
            {currentDate > new Date(Number(events.date_event_end)) ? (
              <p className="text-white w-full bg-red-600 flex items-center justify-center py-2 h-14">
                Encerrado
              </p>
            ) : currentDate >= new Date(Number(events.date_event_initial)) &&
              currentDate < new Date(Number(events.date_event_end)) ? (
              <p className="text-white w-full bg-[#14b7a1] flex items-center justify-center py-2 h-14">
                Rolando Agora
              </p>
            ) : (
              <p className="w-full bg-[#d9d9d9] flex items-center justify-center py-2 h-14">
                <TimerComponent eventTimestamp={events.date_event_initial} />
              </p>
            )}
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default Events;
