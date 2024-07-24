import Swal from "sweetalert2";
import { baseURL,url } from "@/components/utils/api";
//Hook responsavel por fazer a logica de cadastrar e editar os colaboradores
class ArticleService {
    private baseURL: string;
    private url  : string
    constructor() {
      this.baseURL = baseURL ;
      this.url = url
    }
    async getArticles(setArticles:any,setLoading:any,setTotalPages:any,page:string,token:string) {
      setLoading(true)
      const currentPage = page || 1
    const get = await fetch(`${this?.baseURL}articles?page=${currentPage}`, {
      method: "GET",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    
      },
    });

    if (get.status === 200) {
      const response = await get.json();
      setArticles(response.getArticles);
      setTotalPages(response.finalPage)
      setLoading(false);
      return;
    }
  };
   async  getCategories (setCategories:any,setLoading:any) {
    const getCat = await fetch(`${this.url}/categories`, {
      method: "GET",
   
    });
    const response = await getCat.json();
    setCategories(response);
    setLoading(false)
    return
  };
  async getArticleById  (slug:any,setValue:any,setLoading:any,setAvatar:any,setUrl:any,token:string)  {
    const getArticle = await fetch(`${this.baseURL}article-edit/${slug}`, {
      method: "GET",
      headers:{
        Authorization: `Bearer ${token}`,
      }
    });
    const response = await getArticle.json();
    console.log(response)
    Object.keys(response).forEach((key: any) => {
      setValue(key, response[key] as any);
    });
    setAvatar(response.cover)
    setUrl(response.articlepdf)
    setLoading(false);
    return;
  };
   filterCategory(categories:any,selectCat:string){
     const filterCat = categories.filter(
        (name: any) => Number(name.id) === Number(selectCat)
      );
      return filterCat
  }
   upload(e: React.ChangeEvent<HTMLInputElement>,setLoading:any,setAvatar:any){
    setLoading(true);
    const files = e.target.files as any;
    if (files) {
      // Se um arquivo foi fornecido, atualize a URL
      setAvatar(files[0]);
      setLoading(false);
    }

    return;
  };

 editUpload(e: React.ChangeEvent<HTMLInputElement>,setLoading:any,setNewAvatar:any){
    setLoading(true);
    const files = e.target.files as any;
    if (files) {
      // Se um arquivo foi fornecido, atualize a URL
      setNewAvatar(files[0]);
      setLoading(false);
    }

    return;
  };
  

   
  

}
 const ArticleController = new ArticleService()
export default ArticleController;