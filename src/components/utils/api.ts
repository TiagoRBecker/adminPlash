export const baseURL = "https://71b6-2804-4b0-11a2-100-6d58-349b-6ca8-effe.ngrok-free.app/admin/"
export const url = "https://71b6-2804-4b0-11a2-100-6d58-349b-6ca8-effe.ngrok-free.app"
//"http://localhost:5000"
//"http://191.101.70.103:5000"
class Categories  {
  
  async getCategories(){
    const getCat = await fetch(`${baseURL}/categories`,{
      method:"GET"
    })
    const response = await getCat.json()
    return response
  }
  async getOneCategory(slug:string){
    const getCat = await fetch(`${baseURL}/category/${slug}`,{
      method:"GET"
    })
    const response = await getCat.json()
    return response
  }
}
const CategoriesApi = new Categories();
export default CategoriesApi;
