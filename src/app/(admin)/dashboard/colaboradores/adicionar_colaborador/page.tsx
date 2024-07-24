"use client";
import { User, user } from "@/components/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { baseURL } from "@/components/utils/api";
import { sessionHook } from "@/hooks/session";
import { useSession } from "next-auth/react";
import { comission } from "@/components/Mock";
const AddEmployee = () => {
     const {data:session} :any= useSession()
     
    
  const router = useRouter();
  const [avatar, setAvatar] = useState<any>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("")
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>({
    mode: "all",
    resolver: zodResolver(user),
  });
  //Funçao de upload que faz o envio da imagem para backend
  const upload = async (e: any) => {
    setLoading(true);
    const file = e.target.files[0];
  
    if (file) {
      setAvatar(file);
      setLoading(false);
      return;
    }
  };


  //Funçao que carrega os dados para backend
  const onSubmit = handleSubmit(async (data) => {
   
  
  const formData = new FormData() 
   formData.append("profile",avatar)

   for (const key in data as any) {
    formData.append(key, (data as any)[key]);
  }
     
    //Lib para questionar se deseja cadastrar novo usuario
    const Add = await Swal.fire({
      position: "center",
      title: "Tem certeza?",
      text: `Você deseja criar o colaborador ${data.name}?`,
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#d55",
      confirmButtonText: "Adicionar",
      confirmButtonColor: "#00FF00",
    });
    //Caso seja true envia os dados e cadastra o novo usuario
    if (Add.isConfirmed) {
      try {
        //@ts-ignore
        const token = session?.user.token 
        //deleta a categoria e apos exibe  um modal Categoria deletada com sucesso!
        const addEmployee = await fetch(`${baseURL}create-employee`, {
          method: "POST",
           headers:{
            Authorization:`Bearer ${token}`
           },
          body: formData ,
        });
         if(addEmployee.status === 400){
          const response = await addEmployee.json()
          setError(response.message)
          return
         }
        await Swal.fire(
          "Usuário criado com sucesso!",
          "Clica no botão para continuar!",
          "success"
        );
        router.push("/dashboard/colaboradores");
        return;
      } catch (error) {
        //Exibe o erro de forma amigavel na tela
        console.log(error);

        await Swal.fire(
          "Erro no servidor tente novamente mais tarde!",
          "Clica no botão para continuar!",
          "error"
        );
      }
        
    }
    
  });

  return (
    <section className="container mx-auto h-full  flex  flex-col items-center   gap-4  bg-white  rounded-sm p-2">
      <h1 className="text-xl font-bold uppercase text-[#005183]">
        Adiconar Colaborador
      </h1>
      <div className="w-full  flex flex-col items-center justify-center gap-2">
        {loading ? (
          <p>Carregando aguarde...</p>
        ) : (
          <>
            <img
              src={ avatar ? URL.createObjectURL(avatar) :"/user.png"}
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
             {error  && (
              <p className="text-sm text-red-500">{error}</p>
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

export default AddEmployee;
