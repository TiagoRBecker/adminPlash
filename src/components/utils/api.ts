export const baseURL = "http://localhost:443/admin/"
export const url = "http://localhost:443"
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
