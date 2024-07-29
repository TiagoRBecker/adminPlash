"use client";
import { useEffect, useRef, useState } from "react";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { baseURL } from "@/components/utils/api";
import { Checkbox, CheckboxGroup, Stack } from "@chakra-ui/react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";
import { useForm } from "react-hook-form";
import { sponsor, Sponsor } from "@/components/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
const Add_sponsors = () => {
  const {data:session} = useSession()
    const router = useRouter();
    const[cover,setCover] = useState("")
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {
      register,
      handleSubmit,
      
  
      formState: { errors },
    } = useForm<Sponsor>({
      mode: "all",
      resolver: zodResolver(sponsor),
    });
    
    const [ loading ,setLoading] = useState(false)
  
    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoading(true);
        const files = e.target.files as any;
        if (files) {
          // Se um arquivo foi fornecido, atualize a URL
          setCover(files[0]);
          setLoading(false);
        }
    
        return;
      };
      //limpar o input file
      const clearAvatar = () => {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setCover("");
      };

    const onSubmit = handleSubmit(async (data) => {
     
      const formData = new FormData()
      formData.append("file",cover as string)
      formData.append("name",data.name as string)
      formData.append("url",data.url as string)
      formData.append("email",data.email as string)
      formData.append("phone",data.phone as string)
      formData.append("company",data.company as string)
 
    
      const addEvent = await Swal.fire({
        position: "center",
        title: "Tem certeza?",
        text: `Você deseja adicionar um novo  ${data.name}?`,
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
          const addArticle = await fetch(`${baseURL}sponsor-create`, {
            method: "POST",
            headers:{

              Authorization:`Bearer ${token}`
            },
            body: formData,
          });
  
          
          
          
          if(!addArticle.ok){
             const response = await addArticle.json()
              
            Swal.fire({
              icon: "error",
              title: `${response.error}`,
             
              
            });
            return
          }
          await Swal.fire(
            "Patrocinador criado com sucesso!!",
            "Clica no botão para continuar!",
            "success"
          );

          router.push("/dashboard/sponsors");
          return;
        } catch (error) {
          console.log(error);
          //Exibe o modal de erro caso exista um
          await Swal.fire(
            "Erro ao criar o patrocinador!",
            "Clica no botão para continuar!",
            "error"
          );
        }
      }
      
    });
   
   
  
    return ( 
        <section className="w-full h-full mt-20 flex  flex-col items-center px-4 gap-4">
        <form
          className="w-full md:w-1/2 mx-auto flex flex-col    rounded-md  py-2 px-2 shadow-[0_3px_10px_rgb(0,0,0,0.2)] "
          encType="multipart/form-data"
          onSubmit={onSubmit}
        >
          <h1 className="text-xl text-center text-gray-400 uppercase py-4">
            Cadastrar Patronicador
          </h1>
          <div className="flex flex-col  mt-1 ">
            <label htmlFor="">Nome do Patrocinador</label>
            <input
             
             {...register("name")}
              type="text"
              className="w-full h-9 outline-none border-[1px] border-gray-400 rounded-md pl-2"
              placeholder="Nome do patrocinador "
            />
              {errors.name && (
              <p className="text-red-400 text-sm">
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="flex flex-col  mt-1 ">
            <label htmlFor="">Razão Social </label>
            <input
             
             {...register("company")}
              type="text"
              className="w-full h-9 outline-none border-[1px] border-gray-400 rounded-md pl-2"
              placeholder="Nome da empresa "
            />
              {errors.company && (
              <p className="text-red-400 text-sm">
                {errors.company.message}
              </p>
            )}
          </div>
          <div className="flex flex-col  mt-1 ">
            <label htmlFor="">E-mail</label>
            <input
             
             {...register("email")}
              type="email"
              className="w-full h-9 outline-none border-[1px] border-gray-400 rounded-md pl-2"
              placeholder="@email "
            />
              {errors.email && (
              <p className="text-red-400 text-sm">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="flex flex-col  mt-1 ">
            <label htmlFor="">Telefone</label>
            <input
             
             {...register("phone")}
              type="tel"
              className="w-full h-9 outline-none border-[1px] border-gray-400 rounded-md pl-2"
              placeholder="telefone "
            />
              {errors.phone && (
              <p className="text-red-400 text-sm">
                {errors.phone.message}
              </p>
            )}
          </div>
          <div className="flex flex-col  mt-1 ">
            <label htmlFor="">Rede Social</label>
            <input
              
             {...register("url")}
              type="text"
              className="w-full h-9 outline-none border-[1px] border-gray-400 rounded-md pl-2"
              placeholder="Digite a url do patrocinador "
            />
              {errors.url && (
              <p className="text-red-400 text-sm">
                {errors.url.message}
              </p>
            )}
          </div>
          <div className=" w-full h-52 bg-[#14b7a1] mt-1 rounded-md flex items-center justify-center mx-auto">
          <input type="file" hidden id="file" onChange={handleUpload}  ref={fileInputRef} />
          {loading ? (
            <Spinner />
          ) : (
            <>
              {cover ? (
                <div className="w-full h-full flex items-center justify-center relative">
                  <img
                    src={URL.createObjectURL(cover as any)}
                    alt=""
                    className="w-full h-52 px-2 py-2 object-cover"
                  />
                  <button onClick={clearAvatar} className="absolute top-2 right-4">
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

          
         
          <div className="w-full  rounded-md flex items-center justify-center mt-2">
            <button
              className="w-40 py-2  bg-[#14b7a1] rounded-md  text-white "
              type="submit"
            >
              Criar Patrocinador
            </button>
          </div>
        </form>
      </section>
     );
}
 
export default Add_sponsors;