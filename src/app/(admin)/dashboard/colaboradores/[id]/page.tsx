"use client";
import { User, user } from "@/components/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { baseURL } from "@/components/utils/api";
import Swal from "sweetalert2";
import Spinner from "@/components/Spinner";
import { useSession } from "next-auth/react";
import { comission } from "@/components/Mock";

const EditEmploye = ({ params }: { params: { id: string } }) => {
  const {data:session,status} = useSession()
  const [avatar, setAvatar] = useState<string>("");
 const [newAvatar,setNewAvatar] = useState<any>("")
  const [loading, setLoading] = useState(true);
  const slug = params.id;
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<User>({
    mode: "all",
    resolver: zodResolver(user),
  });

  useEffect(() => {
    if(status === "authenticated"){

      getUserId();
    }
  }, [status]);
     const getUserId = async () => {
      //@ts-ignore
      const token = session?.user.token

    const get = await fetch(`${baseURL}employee/${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization:`Bearer ${token}`
      },
     
    });
    if(get.status == 200){
      const data = await get.json();
 
      setAvatar(data?.avatar)
     //Funçao para setar os values que vem  do banco de dados
     //setValue("inputname", data.name..)
     Object?.entries(data)?.forEach(([key, value]: any) => {
       setValue(key as keyof User, value);
     });
     setLoading(false)
    }
   
  };
 //Funçao caso usuario queira trocar a foto 
  const upload = async (e: any) => {
     const file = e.target.files[0]
     
    if(file){
      setNewAvatar(file);
      setLoading(false);
      return;
    }
    
    
    }
  
 //Funçao que envia os dados para backend
  const onSubmit = handleSubmit(async (data:any) => {
     const formData = new FormData()
     formData.append("avatar",avatar)
     formData.append("newProfile",newAvatar)
     for (const key in data) {
      formData.append(key, data[key] as any);
    }
    //Lib que faz o visual para cliente , questiona se ele realmente quer mudar os dados
    const edit = await Swal.fire({
      position: "center",
      title: "Tem certeza?",
      text: `Você deseja alterar o colaborador ${data.name}?`,
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#d55",
      confirmButtonText: "Adicionar",
      confirmButtonColor: "#00FF00",
    });
    //Caso  a funçao acima seja true , os dados sao enviados para backend 
    if (edit.isConfirmed) {
      try {
        //@ts-ignore
        const token = session?.user.token 
        //deleta a categoria e apos exibe  um modal Categoria deletada com sucesso!
        const addCat = await fetch(`${baseURL}employee-update/${slug}`, {
          method: "POST",
          headers:{
            Authorization:`Bearer ${token}`
           },
          body: formData,
        });

        await Swal.fire(
          "Usuário editado com sucesso!",
          "Clica no botão para continuar!",
          "success"
        );
        router.push("/dashboard/colaboradores");
      } catch (error) {
        //Caso de erro exibe o erro de forma amigavel na tela
        console.log(error);
        //Exibe o modal de erro caso exista um
        await Swal.fire(
          "Erro ao editar o usuário!",
          "Clica no botão para continuar!",
          "error"
        );
      }
    }
  });
 if(loading){
  return(
    <section className="w-full h-screen flex items-center justify-center">
      <Spinner/>
    </section>
  )
 }
  
  return (
    <section className="container mx-auto h-full  flex  flex-col items-center   gap-4  bg-white  rounded-sm p-2">
      <h1 className="text-xl font-bold uppercase text-[#005183]">
        Editar Colaborador 
      </h1>
      <div className="w-full  flex flex-col items-center justify-center gap-2">
        {loading ? (
          <p>Carregando aguarde...</p>
        ) : (
          <>
            <img
              src={ newAvatar ? URL.createObjectURL(newAvatar) :avatar}
              alt="Perfil"
              className="w-20 h-20 object-cover rounded-full"
            />
            <input id="file" type="file" hidden onChange={upload} />
            <label
              className="cursor-pointer bg-[#14b7a1] px-4 text-white py-1 rounded-md"
              htmlFor="file"
            >
              Carregar Imagem
            </label>
          </>
        )}
      </div>
      <div className="w-full ">
        <form
          encType="multipart/form-data"
          onSubmit={onSubmit}
          className="w-full h-full flex flex-col items-center justify-center mx-auto px-5"
        >
          <div className="flex flex-col w-full">
            <label htmlFor="" className="text-lg text-gray-400">
              Nome
            </label>
            <input
              {...register("name")}
              type="text"
              className="w-full outline-none border-[1px] border-gray-400 rounded-md pl-2 py-2"
              placeholder="Digite o nome"
              accept="image/*"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="" className="text-lg text-gray-400">
              Email
            </label>
            <input
              {...register("email")}
              type="text"
              className="w-full outline-none border-[1px] border-gray-400 rounded-md pl-2 py-2"
              placeholder="Digite o email"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="" className="text-lg text-gray-400">
              Profissão
            </label>
            <input
              {...register("profession")}
              type="text"
              className="w-full outline-none border-[1px] border-gray-400 rounded-md pl-2 py-2"
              placeholder="Digite a profissão"
            />
            {errors.profession && (
              <p className="text-sm text-red-500">{errors.profession.message}</p>
            )}
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="" className="text-lg text-gray-400">
              Telefone
            </label>
            <input
              {...register("phone")}
              type="text"
              className="w-full outline-none border-[1px] border-gray-400 rounded-md pl-2 py-2"
              placeholder="Digite o telefone"
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>
          
          <div className="flex flex-col w-full">
            <label htmlFor="" className="text-lg text-gray-400">
             Comissão
            </label>
            <select
              {...register("commission")}
              
              className="w-full outline-none border-[1px] border-gray-400 rounded-md pl-2 py-2"
              placeholder="Digite o telefone"
            >
              {
                comission.map((comission:any, index:number)=>(
                  <option value={comission.value}>{comission.name}</option>
                ))
              }
             
            </select>
            {errors.commission && (
              <p className="text-sm text-red-500">{errors.commission.message}</p>
            )}
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="" className="text-lg text-gray-400">
              Senha
            </label>
            <input
              {...register("password")}
              type="text"
              className="w-full outline-none border-[1px] border-gray-400 rounded-md pl-2 py-2"
              placeholder="Digite a senha"
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[#14b7a1] rounded-md text-white mt-4"
          >
            Adicionar Colaborador
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditEmploye;
