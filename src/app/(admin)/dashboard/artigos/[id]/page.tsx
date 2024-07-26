"use client";
import Spinner from "@/components/Spinner";
import React, { useState, useEffect, useRef } from "react";
import ApiController, { baseURL } from "@/components/utils/api";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Articles, article } from "@/components/utils/validation";
import ArticleController from "@/hooks/article"; //Hook responsavel pela logica dos artigos
import { useSession } from "next-auth/react";
import TextEditor from "@/components/Editor";

const ArticleID = ({ params }: { params: { id: string } }) => {

   const {data:session,status} = useSession()
   //@ts-ignore
    const token = session?.user.token
  const fileInputRef = useRef(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,

    formState: { errors },
  } = useForm<Articles>({
    mode: "all",
    resolver: zodResolver(article),
  });
  const router = useRouter();
  const selectCat = watch("categoryId");
  const slug = params.id;
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState<any>("");
  const [content, setContent] = useState("");
  
  const [newAvatar, setNewAvatar] = useState<any>("");
 
 


  const  getArticleById =  async  () => {
   try {
    const response = await ApiController.getArticle(slug,token);
 
    Object.keys(response).forEach((key: any) => {
      setValue(key, response[key] as any);
    });
    setAvatar(response.cover)
    setContent(response.description)
    setLoading(false);
  
    return;
   } catch (error) {
    console.log(error)
   }
 
  };
  const getCategories = async () => {
    try {
      const response = await ApiController.getCategories();

      setCategories(response);
      
      return;
    } catch (error) {
      console.log(error);
    }
  };
  const clearAvatar = ()=>{
    if(fileInputRef.current){
      //@ts-ignore
      fileInputRef.current.value = "";
    }
    setAvatar("");
    setNewAvatar("")
    return
  }
 const upload = (e: React.ChangeEvent<HTMLInputElement>)=>{
    setLoading(true);
    const files = e.target.files as any;
    if (files) {
      // Se um arquivo foi fornecido, atualize a URL
      setNewAvatar(files[0]);
      setLoading(false);
    }

    return;
  };
  const filterCategory = categories.filter(
    (name: any) => Number(name.id) === Number(selectCat)
  );

  const onSubmit = handleSubmit(async (data: any) => {
    const formData = new FormData();
    formData.append("newCover", newAvatar);
    formData.append("cover", avatar);
    formData.append("description",content)

    for (const key in data) {
      formData.append(key, data[key] as any);
    }
    //@ts-ignore
    const del = await Swal.fire({
      position: "center",
      title: "Tem certeza?",
      text: `Você adicionar editar o  Artigo ${data?.name}?`,
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#d55",
      confirmButtonText: "Adicionar",
      confirmButtonColor: "#00FF00",
    });
    if (del.isConfirmed) {
      try {
        //deleta a categoria e apos exibe  um modal Categoria deletada com sucesso!

         await ApiController.updateArticle(slug,token,formData)
          await Swal.fire(
            "Artigo atualizado com sucesso!!",
            "Clica no botão para continuar!",
            "success"
          );
          router.push("/dashboard/artigos");

          return;
        
      } catch (error) {
        console.log(error);
        //Exibe o modal de erro caso exista um
        //@ts-ignore
        await Swal.fire(
          "Erro ao atualizar o artigo!",
          "Clica no botão para continuar!",
          "error"
        );
      }
    }
  });
  useEffect(() => {
    if(status === "authenticated"){
    
    getArticleById()
    getCategories()
    }
  }, [status]);
  if (loading) {
    return (
      <section className="w-full h-screen flex items-center justify-center">
        <Spinner />
      </section>
    );
  }

  return (
    <section className="container mx-auto h-full  flex  flex-col items-center  p-2 gap-4  bg-white ">
    <form
      className="w-full md:w-[80%] mx-auto   rounded-md  py-2 px-2 shadow-[0_3px_10px_rgb(0,0,0,0.2)] "
      encType="multipart/form-data"
      onSubmit={onSubmit}
    >
      <h1 className="text-xl text-center text-gray-400 uppercase py-4">
        Criar Artigo{" "}
      </h1>
      <div className="w-full md:flex md:flex-row">
        <div className="w-full md:w-[65%] flex flex-col gap-3  px-4 py-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="">Autor Artigo</label>
            <input
              {...register("author")}
              type="text"
              className="w-full h-7 outline-none border-[1px] border-gray-400 rounded-sm pl-2"
              placeholder="Autor"
            />
          </div>
          {errors.author && (
            <p className="text-red-400 text-sm">{errors.author.message}</p>
          )}
          <div className="flex flex-col gap-1">
            <label htmlFor="">Nome Artigo</label>
            <input
              {...register("name")}
              type="text"
              className="w-full h-7 outline-none border-[1px] border-gray-400 rounded-sm pl-2"
              placeholder="Título"
            />
          </div>
          {errors.name && (
            <p className="text-red-400 text-sm">{errors.name.message}</p>
          )}

          <div className="flex flex-col gap-1">
            <label htmlFor="">Volume Artigo</label>
            <input
              {...register("volume")}
              type="text"
              className="w-full h-7 outline-none border-[1px] border-gray-400 rounded-sm pl-2"
              placeholder="Volume"
            />
          </div>
          {errors.volume && (
            <p className="text-red-400 text-sm">{errors.volume.message}</p>
          )}
          <div className="flex flex-col gap-1">
            <label htmlFor="">Editora do Artigo</label>
            <input
              {...register("company")}
              type="text"
              className="w-full h-7 outline-none border-[1px] border-gray-400 rounded-sm pl-2"
              placeholder="Editora"
            />
          </div>
          {errors.company && (
            <p className="text-red-400 text-sm">{errors.company.message}</p>
          )}

          <div className="w-full flex-col  md:flex md:flex-row items-center justify-between">
            <p>Filtrar revistas categoria</p>
            <select
              className="w-full md:w-[50%] h-7 outline-none border-[1px] border-gray-400 rounded-sm pl-2"
              {...register("categoryId")}
            >
              <option value="">Selecionar</option>
              {categories.map((cat: any, index: any) => (
                <option key={index} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          {errors.categoryId && (
            <p className="text-red-400 text-sm">
              {errors.categoryId.message as any}
            </p>
          )}
          {filterCategory && (
            <>
              <div className="w-full flex-col  md:flex md:flex-row items-center justify-between">
                <p>Relacionar artigo a revista </p>

                <select
                  {...register("magazineId")}
                  className="w-full md:w-[50%] h-7 outline-none border-[1px] border-gray-400 rounded-sm pl-2"
                >
                  {filterCategory.map((magazine: any, index: number) => (
                    <React.Fragment key={index}>
                      {magazine.magazine.map((name: any, index: number) => (
                        <option key={index} value={name.id}>
                          {name.slug}
                        </option>
                      ))}
                    </React.Fragment>
                  ))}
                </select>
              </div>

              {errors.magazineId && (
                <p className="text-red-400 text-sm">
                  {errors.magazineId.message as any}
                </p>
              )}
            </>
          )}
          <div className="w-full flex-col  md:flex md:flex-row items-center justify-between">
            <p>Status do Artigo</p>
            <select
              className="w-full md:w-[50%] h-7 outline-none border-[1px] border-gray-400 rounded-sm pl-2"
              {...register("status")}
            >
              <option value="free">Gratuito</option>
              <option value="recommended">Recomendado</option>
              <option value="trend">Tendencias</option>
            </select>
          </div>
        </div>

        <div className="w-full  h-[370px]  md:w-[35%] flex flex-col   gap-3 px-4 py-4">
          <div className="flex gap-3 w-full h-full">
            <div className="w-full h-full">
              <div className="w-full  h-full flex flex-col gap-6 items-center justify-center">
                <div className=" w-full h-full bg-[#14b7a1] rounded-md flex items-center justify-center">
                  <input
                    type="file"
                    hidden
                    id="file"
                    ref={fileInputRef}
                    onChange={upload}
                  />
                  {loading ? (
                    <Spinner />
                  ) : (
                    <>
                      {avatar || newAvatar ? (
                        <div className="w-full h-full flex items-center justify-center relative">
                          <img
                            src={ newAvatar ? URL.createObjectURL(newAvatar) : avatar}
                            alt=""
                            className="w-full h-full px-2 py-2 object-cover"
                          />
                          <button
                            onClick={clearAvatar}
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
          </div>
        
        </div>
      </div>

      <TextEditor
        placeholder="Escrever artigo..."
        content={content}
        setContent={setContent}
      />

      <div className="w-full  rounded-md flex items-center justify-center py-4">
        <button
          className="w-40 py-2  bg-[#14b7a1] rounded-md  text-white "
          type="submit"
        >
          Criar Artigo
        </button>
      </div>
    </form>
  </section>
  );
};

export default ArticleID;
