export const baseURL = "http://77.37.69.19:443/admin/"
export const url = "http://77.37.69.19:443/public"
export const authUrl = "http://77.37.69.19:443/auth"
//"http://191.101.70.103:5000"
class Categories  {
  
  async getCategories(){
    const getCat = await fetch(`${url}/categories`,{
      method:"GET"
    })
    const response = await getCat.json()
    return response
  }
  async getOneCategory(slug:string){
    const getCat = await fetch(`${url}/category/${slug}`,{
      method:"GET"
    })
    const response = await getCat.json()
    return response
  }
}
const CategoriesApi = new Categories();
export default CategoriesApi;
