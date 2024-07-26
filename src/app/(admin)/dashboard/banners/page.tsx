"use client"
import Spinner from "@/components/Spinner";
import ApiController, { baseURL, url } from "@/components/utils/api";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import Swal from "sweetalert2";


const deletBanner = async () => {
  const request = await fetch(`${url}/banners`, {
    method: "GET",
    cache: "no-cache",
  });
  const response = await request.json();
  return response;
};
const BannersList =  () => {
const [data, setData] = useState([])
const[loading, setLoading] = useState(true)
useEffect(()=>{getBanner()},[])
const {data:session} = useSession()
const getBanner = async () => {
  try {
    const response = await ApiController.getBanners()
    
 
    setData(response)
    setLoading(false)
  } catch (error) {
    console.log(error)
  }
  
  return 
};
const deletBanner = async (id:any,name:string) => {

 const del = await Swal.fire({
   position: "center",
   title: "Tem certeza?",
   text: `Você deseja apagar o banner ${name} ?`,
   showCancelButton: true,
   cancelButtonText: "Cancelar",
   cancelButtonColor: "#333",
   confirmButtonText: "Remover",
   confirmButtonColor: "red",
 });
 if (del.isConfirmed) {
   try {
      //@ts-ignore
      const token = session?.user.token 
     
       await ApiController.deleteBanner(id,token)

    
       await Swal.fire(
       
         "Banner deletado com sucesso!!",
         "Clica no botão para continuar!",
         "success"
       );
       await getBanner()
       
       return;
     
   } catch (error) {
     console.log(error);
     await Swal.fire(
       "Erro ao deletar o banner!",
       "Clica no botão para continuar!",
       "error"
     );
   }
 }
};
if(loading){
  return(
    <div className="w-full h-screen flex items-center justify-center">
      <Spinner/>
    </div>
  )
}
  return (
  
    <section className="container mx-auto h-full  flex  flex-col items-center  p-2 gap-4  bg-white ">
      <div className="w-full flex flex-col md:flex-row items-center justify-between ">
      <h1 className="uppercase text-gray-400">Banners Cadastrados </h1>
         <Link href={"/dashboard/banners/add_banner"} className="text-white font-bold">
         <button className="px-4 py-2 bg-[#14b7a1]  rounded-md  flex items-center gap-2">
           
           <svg
               xmlns="http://www.w3.org/2000/svg"
               fill="none"
               viewBox="0 0 24 24"
               strokeWidth={1.5}
               stroke="currentColor"
               className="w-6 h-6  text-white"
             >
               <path
                 strokeLinecap="round"
                 strokeLinejoin="round"
                 d="M12 4.5v15m7.5-7.5h-15"
               />
             </svg>
            Adicionar 
          </button>
            </Link>
       </div>
        <div className="w-full grid grid-cols-1 md:grid md:grid-cols-5 gap-3 mt-10">
          {data.map(
            (
              banner: { id: number; name: string; cover: string },
              index: number
            ) => (
              <div
                className="w-full  flex flex-col gap-3 relative  "
                key={index}
              >
                <button onClick={()=>{deletBanner(banner.id,banner.name)}} className="absolute top-2 right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-red-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>
                <img
                  src={banner.cover}
                  alt={banner.name}
                  className="w-full h-[250px] object-cover rounded-md"
                />
                <span className="text-xl text-gray-400">{banner.name}</span>
              </div>
            )
          )}
        </div>
        {data.length === 0 && (
          <div className=" w-full h-screen flex flex-col items-center justify-center gap-4">
            <p>Nenhum banner cadastrado!</p>
           
          </div>
        )}
      </section>
   
  );
};

export default BannersList;
