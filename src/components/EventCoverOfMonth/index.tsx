
import { url } from "../utils/api";

const getCovers = async () => {
    const request = await fetch(`${url}/cover-events`, {
      method: "GET",
      cache: "no-cache",
    });
    const response = await request.json();
   
    return response;
  };



const Eventes = async () => {
 const data = await getCovers()

 const currentDate = new Date()
const date = new Date(Number(data[0]?.date_event))
 
  return (
    <div className="w-full h-full" >
      {data?.map((event:any, index:any) => (
        <div key={index}>
          <div className="w-full flex flex-col gap-2  md:flex-row item justify-between ">
          <h1 className="w-full text-left text-[24px] font-bold  lg:text-[19px] text-dark-brown tracking-[-.0065em]  mb-4">
        Votação capa do mês
      </h1>
          { currentDate > date ?
            <span className="w-1/2 h-[40px] bg-red-600 text-white py-2 px-2 rounded-md font-semibold">Encerrado</span>
          :
          <span className="w-1/2 h-[40px] bg-[#14b7a1] text-white py-2 px-2 rounded-md font-semibold">
              Encerramento:{" "}
              {new Date(Number(data[0].date_event)).toLocaleDateString()}
            </span>

           }
            
          </div>
          <div className="w-full  h-full grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 py-5">
          
             
          {
          data[0].cover?.map((event:any,index:number)=>(
            <div
            key={index}
            className="w-full h-full flex flex-col   shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]   rounded-md"
          >
            <img
              src={event.cover}
              alt={event.name}
               className="w-full h-[240px] object-fill "
            />

            <p className="w-full text-base truncate text-gray-600  px-1 py-2  ">
              {event.name}
            </p>
            <p className="w-full text-base truncate text-white bg-[#14b7a1] px-1 text-center py-2 ">
              Votos: {event.countLike}
            </p>

            
          </div>
          ))
         }
        
          </div>
        </div>
      ))}
    </div >
  );
};

export default Eventes;
