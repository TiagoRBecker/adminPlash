"use client";
import { useEffect, useState } from "react";
import useCategory from "@/hooks/category";
import { baseURL, url } from "@/components/utils/api";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";
import { useSession } from "next-auth/react";
const EditCat = ({ params }: { params: { id: string } }) => {
  const {data: session} = useSession()
  const slug = params.id;
  const router = useRouter();
  const [editCategory, setEditCategory] = useState<any>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  //Funçao que faz o envio dos dados para backend para ser editado.

  //Busca a categoria pelo id assim que o componente e montado
  useEffect(() => {
    if (slug) {
      getCategoryById();
    }
  }, []);
  const getCategoryById = async () => {
    const getCategoryById = await fetch(`${url}/category/${slug}`, {
      method: "GET",
    });
    const response = await getCategoryById.json();
    setEditCategory(response.name);

    setLoading(false);

    return response;
  };

  const handleEditCategory = async (e: any) => {
    e.preventDefault();

    try {
       //@ts-ignore
       const token = session?.user?.token 
      const editCat = await fetch(`${baseURL}update-category/${slug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:`Bearer ${token}`
        },

        body: JSON.stringify({ slug, editCategory }),
      });
       const response = await editCat.json()
      
      if (editCat.status === 200) {
        await Swal.fire(
          "Categoria alterada  com sucesso!!",
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
        "Erro ao alterar a categoria!",
        "Clica no botão para continuar!",
        "error"
      );
    }
  };

  if (loading) {
    return (
      <section className="w-full h-screen flex items-center justify-center">
        <Spinner />
      </section>
    );
  }

  return (
    <section className=" w-full h-screen flex flex-col items-center justify-center">
      <h1 className="text-center text-[#005183] text-xl uppercase mb-4 font-bold">
        Editar Categoria
      </h1>
      <form method="POST" className="w-1/2">
        <div className="">
          <label htmlFor="">Categoria</label>
          <input
            type="text"
            className="w-full outline-none border-[1px] border-gray-400 rounded-md pl-2 py-2"
            value={editCategory}
            onChange={(e) => setEditCategory(e.target.value)}
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
            onClick={handleEditCategory}
          >
            Editar Categoria
          </button>
        </div>
      </form>
    </section>
  );
};

export default EditCat;
