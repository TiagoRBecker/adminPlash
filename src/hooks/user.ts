import { useState } from "react"

const useEmployee  = (slug:string | null) => {
    const [data , setData] = useState({})
   const getUserId = async  ()=>{
    const  get = await fetch(`http://localhost:5000/users/${slug}`,{method:"GET"})
     const data = await get.json()
      setData(data)
     return 

   }
  const editUser = async ()=>{

  }
   return{
       data,
       setData,
       getUserId
   }
}
 
export default useEmployee;