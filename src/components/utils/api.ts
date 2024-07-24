export const baseURL = "https://ede9-177-22-167-216.ngrok-free.app/admin/"
export const url = "https://ede9-177-22-167-216.ngrok-free.app"
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
