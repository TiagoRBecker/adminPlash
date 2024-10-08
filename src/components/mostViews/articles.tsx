import { url } from "../utils/api";
export type Magazine = {
  id:number,
  name:string,
  author:string,
  cover:string,
  volume:string
  model:string,
  views:number

}
const getArticlesMostViews = async ()=>{
    const request = await fetch(`${url}/articles-most-views`,{method:"GET", cache:"no-cache"})
    const response = await request.json()
    return response
}
const articlesMostViews = async () => {
    const data = await getArticlesMostViews()
    
    
    return ( 
        <div className="w-full h-full ">
         <h1 className="text-[24px] font-bold  lg:text-[29px] text-dark-brown tracking-[-.0065em]  mb-4">
        Artigos mais Visualizados
      </h1>
      
    {
      data.length > 0 ?
      <div className="w-full   grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 py-5">
      {
          data?.map((magazine:Magazine,index:number)=>(
              <div className="w-full  flex flex-col gap-1 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]   relative" key={index}>
             
              <img
                src={magazine.cover}
                alt={magazine.name}
                   className="w-full h-[240px] object-cover "
              />
              <h2 className="text-gray-400  px-1 ">
                Volume {magazine.volume}
              </h2>
  
              <p className="w-full text-base truncate text-gray-600  px-1 py-2">
                {magazine.name}
              </p>
              <p className="w-full text-base truncate text-white bg-[#14b7a1] px-1 text-center py-2 ">Visualizações {magazine.views}</p>
  
            
            </div>
  
          ))
      }
      </div>
      :
      <div className="">
        <p className="text-gray-500">Nenhum artigo visualizado no momento</p>
        
      </div>
    }
   
    </div> );
}
 
export default articlesMostViews;