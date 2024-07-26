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
      
      return response;
    } catch (error) {}
  };
  const currentDate = new Date();

  const eventToStart = data.filter(
    (date: any) =>
      new Date(Number(date.date_event_initial)) >= currentDate &&
      new Date(Number(date.date_event_end)) > currentDate
  );
  const eventEnd = data.filter(
    (date: any) =>
      new Date(Number(date.date_event_initial)) < currentDate &&
      new Date(Number(date.date_event_end)) < currentDate
  );
  const eventNow = data.filter(
    (date: any) =>
      new Date(Number(date.date_event_initial)) <= currentDate &&
      new Date(Number(date.date_event_end)) >= currentDate
  );

  const getDate = (dateIniti: any, dateEnd: any) => {
    const dateStart = new Date(Number(dateIniti));
    const dateFinal = new Date(Number(dateEnd));
    const month = dateStart.getMonth() + 1;
    const startDay = dateStart.getDate();
    const endDay = dateFinal.getDate();

    let nameMonth;
    switch (month) {
      case 1:
        nameMonth = "Janeiro";
        break;
      case 2:
        nameMonth = "Fevereiro";
        break;
      case 3:
        nameMonth = "Março";
        break;
      case 4:
        nameMonth = "Abril";
        break;
      case 5:
        nameMonth = "Maio";
        break;
      case 6:
        nameMonth = "Junho";
        break;
      case 7:
        nameMonth = "Julho";
        break;
      case 8:
        nameMonth = "Agosto";
        break;
      case 9:
        nameMonth = "Setembro";
        break;
      case 10:
        nameMonth = "Outubro";
        break;
      case 11:
        nameMonth = "Novembro";
        break;
      case 12:
        nameMonth = "Dezembro";
        break;
      default:
        nameMonth = "";
    }
    return `${startDay}/${endDay} ${nameMonth}`;
  };
  useEffect(() => {
    if (status === "authenticated") {
      getEvents();
    }
  }, [status]);
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
              <Link href={`/events/${events.id}`}>
                <button className="w-full h-14 bg-gray-400 flex items-center justify-center text-white uppercase">
                  <TimerComponent eventTimestamp={events.date_event_initial} />
                </button>
              </Link>
            </div>
          ))}
        </div>
      
    </div>
  );
};

export default Events;
