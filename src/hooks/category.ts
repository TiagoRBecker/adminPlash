import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Swal from "sweetalert2";
interface CategoryHook {
    category: string;
    setCategory: React.Dispatch<React.SetStateAction<string>>;
    getIdCategory: () => Promise<any>;
    addCategory: () => Promise<any>;
    editCat: (slug?: string) => Promise<any>; // slug agora é opcional
}
const useCategory = (slug:string | null) => {
     const router = useRouter()
    const [category, setCategory] = useState<string>("");
    const [error,setError] = useState(false)
    
   //Busca a categoria selecionada
    const getIdCategory = async () => {
        const res = await fetch(`http://localhost:5000/category/${slug}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        })
        const data = await res.json()
        setCategory(data.name)
        return data
    };
    //Adiciona uma nova categoria
    const addCategory = async () => {

       
       if(category === ""){
        setError(true)
        return 
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
        })
        if (del.isConfirmed) {
            try {
                //deleta a categoria e apos exibe  um modal Categoria deletada com sucesso!
                const addCat = await fetch(`http://localhost:5000/create-category`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ category})
                })
                if (addCat.status === 200) {
                    await Swal.fire(
                        "Categoria adicionada com sucesso!!",
                        "Clica no botão para continuar!",
                        "success"
                    );
                    router.push("/dashboard/categorias")
                    return
                }




            } catch (error) { 
                console.log(error)
                //Exibe o modal de erro caso exista um
                await Swal.fire(
                    "Erro ao adicionar a categoria!",
                    "Clica no botão para continuar!",
                    "error"
                );
            }
        }
        
    }
   //Edita a Categoria selecionada
    const editCat = async (slug?:string) => {
      console.log("Aqui esta o slug",slug)
      console.log("Aqui esta o category",category)
        
      
       const del = await Swal.fire({
           position: "center",
           title: "Tem certeza?",
           text: `Você quer editar a categoria ${category}?`,
           showCancelButton: true,
           cancelButtonText: "Cancelar",
           cancelButtonColor: "#d55",
           confirmButtonText: "Editar",
           confirmButtonColor: "#00FF00",
       })
       if (del.isConfirmed) {
           try {
               //deleta a categoria e apos exibe  um modal Categoria deletada com sucesso!
               const editCat = await fetch(`http://localhost:5000/update-category`, {
                   method: "PUT",
                   headers: {
                       "Content-Type": "application/json"
                   },
                   body: JSON.stringify({slug, category})
               })
               if (editCat.status === 200) {
                   await Swal.fire(
                       "Categoria editada com sucesso!!",
                       "Clica no botão para continuar!",
                       "success"
                   );
                   router.push("/dashboard/categorias")
                   return
               }




           } catch (error) { 
               console.log(error)
               //Exibe o modal de erro caso exista um
               await Swal.fire(
                   "Erro ao editar a categoria!",
                   "Clica no botão para continuar!",
                   "error"
               );
           }
       }
    };

    

    return {
        category,
        setCategory,
        error,
        getIdCategory,
        addCategory,
        editCat
    };
};

export default useCategory;