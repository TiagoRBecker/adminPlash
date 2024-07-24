"use client";
import { useEffect, useState } from "react";
import useCategory from "@/hooks/category";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { baseURL } from "@/components/utils/api";
import { useSession } from "next-auth/react";
const addNewCategory = () => {
  
   const {data: session} = useSession()
  const router = useRouter();
 
  const [category, setCategory] = useState("");

  const [error, setError] = useState(false);
  //Adiciona uma nova categoria
  
  const addCategory = async (e: any) => {
    e.preventDefault();

    if (category === "") {
      setError(true);
      return;
    }

    const del = await Swal.fire({
      position: "center",
      title: "Tem certeza?",
      text: `Você adicionar a nova categoria ${category}?`,
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#d55",
      confirmButtonText: "Adicionar",
      confirmButtonColor: "#00FF00",
    });
    if (del.isConfirmed) {
      try {
        //@ts-ignore
        const token:any = session?.user?.token 
        //deleta a categoria e apos exibe  um modal Categoria deletada com sucesso!
        const addCat = await fetch(`${baseURL}create-category`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
             Authorization:`Bearer ${token}`
          },
          body: JSON.stringify({ category}),
        });
        if (addCat.status === 200) {
          await Swal.fire(
            "Categoria adicionada com sucesso!!",
            "Clica no botão para continuar!",
            "success"
          );
          router.push("/dashboard/categorias");
          return;
        }
      } catch (error) {
        console.log(error);
        //Exibe o modal de erro caso exista um
        await Swal.fire(
          "Erro ao adicionar a categoria!",
          "Clica no botão para continuar!",
          "error"
        );
      }
    }
  };


  return (
    <section className="container mx-auto h-full  flex  flex-col items-center  p-2 gap-4  bg-white ">
      <h1 className="text-center text-[#005183] text-xl uppercase mb-4 font-bold">
        Adicionar Categoria
      </h1>
      <form method="POST" className="w-full py-4 md:w-1/2" onSubmit={addCategory}>
        <div className="">
          <label htmlFor="">Categoria</label>
          <input
            type="text"
            className="w-full outline-none border-[1px] border-gray-400 rounded-md pl-2 py-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          {error && (
            <p className="text-red-500 text-center">
              Necessário preencher o campo da categoria!
            </p>
          )}
        </div>
      

        <div className="flex items-center justify-center w-full mt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-[#14b7a1]  rounded-md text-white"
          >
            Adicionar Categoria
          </button>
        </div>
      </form>
    </section>
  );
};

export default addNewCategory;
