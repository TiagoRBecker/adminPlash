"use client"
import Spinner from "@/components/Spinner";
import { baseURL, url } from "@/components/utils/api";
import { Event, events } from "@/components/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import { ptBR } from "date-fns/locale/pt-BR";
import TextEditor from "@/components/Editor";
import { HStack, Tag, TagCloseButton, TagLabel } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

type Data = {
  id: number;
  name: string;
  organizer: string;
  cover: string;
  banner: string;
  descript: string;
  date_event_initial: string;
  date_event_end: string;
  location: string;
  award: string;
  facebook: string;
  youutbe: string;
  instagram: string;
  x: string;
  modality: string;
  sponsors: [
    {
      id: number;
      name: string;
      cover: string;
      createDate: string;
      upDateDate: string;
      eventsofMonthId: number;
    }
  ];
};
;
const EventID =  ({ params }: { params: { id: string } }) => {
  const {data:session,status} = useSession()
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    watch,

    formState: { errors },
  } = useForm<Event>({
    mode: "all",
    resolver: zodResolver(events),
  });

   const id = watch("sponsorID")
  const fileInputRefImage = useRef<HTMLInputElement>(null);
  const fileInputRefBanner = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [ loading , setLoading] = useState(true)
  const [banner,setBanner] = useState<any>("")
  const [newBanner,setNewBanner] = useState<any>("")
  const [cover,setCover] = useState<any>("")
  const [newCover,setNewCover] = useState<any>("")
  const [date_initial, setDataInitial] = useState<any>(new Date());
  const [date_end, setDateEnd] = useState<any>(new Date());
  const [ sponsors, setSponsors] = useState([])
  const [employees,setEmployees] = useState([])
  const [sponsorrEvent,setSponsorsEvent] = useState([])
  const [content, setContent] = useState("");
 
  const getEvent = async ()=>{
    try {
      //@ts-ignore
      const token = session?.user.token 
      const request = await fetch(`${baseURL}event/${params.id}`, 
        { 
        method: "GET",
          cache:"no-cache",
        
        headers:{
   
        Authorization:`Bearer ${token}`
      },});
      
     
  
        const response = await request.json();
       
        const eventDateIniti = new Date(Number(response.date_event_initial));
        const eventDateEnd = new Date(Number(response.date_event_end));
        Object.keys(response).forEach((key: any) => {
          setValue(key, response[key] as any);
        });
        setBanner(response.banner)
        setCover(response.cover)
        setContent(response.descript)
    
       setDataInitial(eventDateIniti)
       setDateEnd(eventDateEnd)
       setSponsorsEvent(response.sponsors)
  
       setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
    //@ts-ignore
   
     

  
   return

  }
  const  addEmployee = () => {
    
    const filteredEmployee:any = employees.find((employee:any) => employee.id === Number(id));
    if (filteredEmployee) {
      const checkIDArray = sponsors.some((emp:any) => emp.id === filteredEmployee.id);
      if (!checkIDArray) {
        setSponsors((prev:any) => [...prev, filteredEmployee] as any);
      }
    }
  } 
  const getSponsors = async () => {
    //@ts-ignore
     const token = session?.user.token 
     const sponsors = await fetch(`${baseURL}sponsors`, {
       method: "GET",
       cache: "no-cache",
       headers:{
 
         Authorization:`Bearer ${token}`
       },
     });
     const response = await sponsors.json()
     
     setEmployees(response.sponsors)
     setLoading(false)
    
     return;
   };
  const handleUploadBanner = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const files = e.target.files as any;
    if (files) {
      // Se um arquivo foi fornecido, atualize a URL
      setNewBanner(files[0]);
      setLoading(false);
    }

    return;
  };
  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const files = e.target.files as any;
    if (files) {
      // Se um arquivo foi fornecido, atualize a URL
      setNewCover(files[0]);
      setLoading(false);
    }

    return;
  };

  const clearAvatarImage = () => {
    if (fileInputRefImage.current) {
      fileInputRefImage.current.value = "";
    }
    setCover(null);
    setNewCover(null)
  };
  const clearAvatarBanner = () => {
    if (fileInputRefBanner.current) {
      fileInputRefBanner.current.value = "";
    }
    setBanner(null);
    setNewBanner(null)
  };
  const handleDateInitChange = (date: Date | [Date, Date] | null) => {
    setDataInitial(date);
  };
  const handleDateEndtChange = (date: Date | [Date, Date] | null) => {
    setDateEnd(date);
  };
  
   const onSubmit = handleSubmit(async(data)=>{
    const formData = new FormData();
    
    formData.append("banner", banner)
    formData.append("descript", content)
    formData.append("cover",cover)
    formData.append("newBanner",newBanner)
    formData.append("newCover",newCover)
    formData.append("date_event_initial", date_initial?.getTime())
    formData.append("date_event_end", date_end?.getTime())
    formData.append("sponsors",JSON.stringify(sponsors) as any)

    for (const key  in data) {
      // @ts-ignore
      formData.append(key,  data[key] as any);
    }
    const addEvent = await Swal.fire({
      position: "center",
      title: "Tem certeza?",
      text: `Você deseja adicionar um novo evento   ${name}?`,
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#d55",
      confirmButtonText: "Adicionar",
      confirmButtonColor: "#00FF00",
    });
    if (addEvent.isConfirmed) {
      try {
        //deleta a categoria e apos exibe  um modal Categoria deletada com sucesso!
        //@ts-ignore
        const token = session?.user.token 
        const addArticle = await fetch(`${baseURL}update-event/${params.id}`, {
          method: "POST",
          headers:{

            Authorization:`Bearer ${token}`
          },
          body: formData,
        });
       const response = await addArticle.json()
    
        if (addArticle.status === 200) {
          await Swal.fire(
            "Evento criado com sucesso!!",
            "Clica no botão para continuar!",
            "success"
          );

          router.push("/dashboard/events/event");
          return;
        }
      } catch (error) {
        console.log(error);
        //Exibe o modal de erro caso exista um
        await Swal.fire(
          "Erro ao criar o evento!",
          "Clica no botão para continuar!",
          "error"
        );
      }
    }
    
    
   })
   const removeSponsors =(id:any)=>{
    setSponsors((prev:any) => {
      const pos = prev.findIndex((item:any) => item.id === Number(id));
      const newArrayEmployee = prev.filter((value:any, index:any) => index !== pos);
      return newArrayEmployee;
    });
   }
   const removeSponsorsByEvent = async (id:number,name:string) => {
     const eventID = params.id
    const del = await Swal.fire({
      position: "center",
      title: "Tem certeza?",
      text: `Você deseja remover o patrocinador ${name} da revista?`,
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
        const removeEmployeeResponse = await fetch(
          `${baseURL}removeSponsorEvent`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({eventID,id}),
          }
        );

        if (removeEmployeeResponse.status === 200) {
          await Swal.fire(
            "Colaborador removido com sucesso!!",
            "Clica no botão para continuar!",
            "success"
          );
          await getEvent()
          
          return;
        }
      } catch (error) {
        console.log(error);
        await Swal.fire(
          "Erro ao remover o colaborador!",
          "Clica no botão para continuar!",
          "error"
        );
      }
    }
  };
 

  useEffect(()=>{
    if(status === "authenticated"){
      getEvent()
      getSponsors()
    }
     
    },[status])
  // Funçao de formatar data e hora
 if(loading){
  return(
    <div className="w-full h-screen flex items-center justify-center">
      <Spinner/>
    </div>
  )
 }
 
  return (
  
      
      <section className="w-full h-full py-10 mt-16">
      <form
        className="w-[80%] mx-auto flex flex-col    rounded-md  py-2 px-2 shadow-[0_3px_10px_rgb(0,0,0,0.2)] "
        encType="multipart/form-data"
        onSubmit={onSubmit}
      >
        <h1 className="text-xl text-center text-gray-400 uppercase py-4">
          Cadastrar evento
        </h1>

        <div
          className="flex flex-col  mt-4 
            "
        >
          <label htmlFor="">Evento Nome</label>
          <input
            {...register("name")}
            type="text"
            className="w-full h-9 outline-none border-[1px] border-gray-400 rounded-sm pl-2"
            placeholder="Nome evento"
          />
           {errors.name && (
              <p className="text-red-400 text-sm">
                {errors.name.message}
              </p>
            )}
        </div>
        <div
          className="flex flex-col  mt-4
            "
        >
          <label htmlFor="">Responsavél pelo Evento</label>
          <input
           {...register("organizer")}
            type="text"
            className="w-full h-9 outline-none border-[1px] border-gray-400 rounded-sm pl-2"
            placeholder="Responsavel"
          />
          {errors.organizer && (
              <p className="text-red-400 text-sm">
                {errors.organizer.message}
              </p>
            )}
        </div>
        <div
          className="flex flex-col  mt-4 
            "
        >
          <label htmlFor="">E-mail</label>
          <input
            {...register("email")}
            type="email"
            className="w-full h-9 outline-none border-[1px] border-gray-400 rounded-sm pl-2"
            placeholder="@email"
          />
           {errors.email && (
              <p className="text-red-400 text-sm">
                {errors.email.message}
              </p>
            )}
        </div>

        <div
          className="flex flex-col  mt-4 
            "
        >
          <label htmlFor="">Telefone</label>
          <input
            {...register("phone")}
            type="number"
            className="w-full h-9 outline-none border-[1px] border-gray-400 rounded-sm pl-2"
            placeholder="numero telefone"
          />
           {errors.phone && (
              <p className="text-red-400 text-sm">
                {errors.phone.message}
              </p>
            )}
        </div>
        <div className="w-full flex gap-1">
          <div className="w-[60%]">
            <label htmlFor="">Banner Evento</label>
            <div className=" w-full min-h-[350px] bg-[#14b7a1] rounded-md flex items-center justify-center mx-auto">
              <input
                type="file"
                hidden
                id="banner"
                onChange={handleUploadBanner}
                ref={fileInputRefBanner}
              />
              {loading ? (
                <Spinner />
              ) : (
                <>
                  {banner || newBanner ? (
                    <div className="w-full h-full flex items-center justify-center relative">
                      <img
                        src={ newBanner ? URL.createObjectURL(newBanner as any): banner}
                        alt=""
                        className="w-full h-[350px] px-2 py-2 object-cover"
                      />
                      <button
                        onClick={clearAvatarBanner}
                        className="absolute top-2 right-4"
                      >
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
                    </div>
                  ) : (
                    <div className=" w-full h-44 bg-[#14b7a1] rounded-md flex items-center justify-center ">
                      <label
                        htmlFor="banner"
                        className="   px-3 py-1  text-white rounded-md  text-sm  cursor-pointer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-12 h-12 text-white"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                          />
                        </svg>
                      </label>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="w-[40%]">
            <label htmlFor="">Imagem Evento</label>
            <div className=" w-full min-h-[350px] bg-[#14b7a1] rounded-md flex items-center justify-center mx-auto">
              <input
                type="file"
                hidden
                id="file"
                onChange={handleUploadImage}
                ref={fileInputRefImage}
              />
              {loading ? (
                <Spinner />
              ) : (
                <>
                  {cover || newCover ? (
                    <div className="w-full h-full flex items-center justify-center relative">
                      <img
                        src={ newCover ? URL.createObjectURL(newCover as any): cover}
                        alt=""
                        className="w-full h-[350px] px-2 py-2 object-cover"
                      />
                      <button
                        onClick={clearAvatarImage}
                        className="absolute top-2 right-4"
                      >
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
                    </div>
                  ) : (
                    <div className=" w-full h-44 bg-[#14b7a1] rounded-md flex items-center justify-center ">
                      <label
                        htmlFor="file"
                        className="   px-3 py-1  text-white rounded-md  text-sm  cursor-pointer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-12 h-12 text-white"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                          />
                        </svg>
                      </label>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-1">
          <div className="w-[50%] flex flex-col mt-4  ">
            <label htmlFor="">Data Inícial </label>

            <DatePicker
              id="date"
              selected={date_initial}
              onChange={handleDateInitChange}
              value={date_initial.toLocaleString("pt-br")}
              showTimeSelect
              dateFormat="dd/MM/yyyy"
              locale={ptBR}
              placeholderText="Selecione a Data do evento"
              className="w-full h-full outline-none border-[1px] border-gray-400 rounded-sm py-2 pl-3"
              minDate={new Date()}
            />
          </div>
          <div className="w-[50%] flex flex-col mt-4  ">
            <label htmlFor="">Data Final </label>

            <DatePicker
              id="date"
              selected={date_end}
              onChange={handleDateEndtChange}
              value={date_end?.toLocaleString("pt-BR")}
              showTimeSelect
              dateFormat="dd/MM/yyyy"
              locale={ptBR}
              placeholderText="Selecione a Data do evento"
              className="w-full h-full outline-none border-[1px] border-gray-400 rounded-sm py-2 pl-3"
              minDate={new Date()}
            />
          </div>
        </div>
        
      
        <div className="w-full  flex flex-col mt-4 items-center justify-between">
              <p className="text-left w-full">
                Patrocinadores
              </p>
              <div className="flex w-full ">
                <select
                  className="w-full h-7 outline-none border-[1px] border-gray-400 rounded-sm pl-2"
                  {...register("sponsorID")}
                >
                  <option >Se necessário selecione um patrocinador</option>
                  {employees?.map((employee: any, index: any) => (
                    <>
                      <option key={index} value={employee.id}>
                        {employee.name}
                      </option>
                    </>
                  ))}
                </select>
              
                <button
                  type="button"
                  className="w-[50px]  bg-[#14b7a1] h-7 flex items-center justify-center text-white"
                  onClick={addEmployee}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </button>
              </div>
             {errors.sponsorID && (
              <p className="text-red-400 text-sm w-full text-left">
                {errors.sponsorID.message}
              </p>
             
            )}
            
              <div className="w-full flex flex-wrap">
              <HStack spacing={4}>
                {sponsors?.map((employee: any, index: any) => (
                  <Tag
                    size={"sm"}
                    key={index}
                    borderRadius="full"
                    variant="solid"
                    colorScheme="green"
                  >
                    <TagLabel>{employee.name} </TagLabel>
                    <TagCloseButton
                      onClick={() =>removeSponsors(employee.id)}
                    />
                  </Tag>
                ))}
              </HStack>
            </div>
            <h3 className="w-full text-left mt-4">Patrocinadores do Evento</h3>
            <div className="w-full flex items-center  flex-wrap">
              
              {
                sponsorrEvent?.map((sponsor:any,index:number)=>(
                  <div className="w-[250px] relative"> <button onClick={()=>{removeSponsorsByEvent(sponsor.id,sponsor.name)}} className="absolute top-2 right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center"><svg
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
                        </svg></button>
                   
                    <img src={sponsor.cover} alt={sponsor.name} className="w-full h-40" />
                  </div>
                ))
              }

            </div>
            </div>
            <div className="mt-4">
          <TextEditor
          placeholder="Descriçao do Evento ..."
          content={content}
          setContent={setContent}
        />
        </div>
        <div className="w-full  rounded-md flex items-center justify-center">
          <button
            className="w-40 py-2  bg-[#14b7a1] rounded-md  text-white "
            type="submit"
          >
            Editar Evento
          </button>
        </div>
        
      </form>
    </section>
  
  );
};

export default EventID;
