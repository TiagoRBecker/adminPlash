export type User = {
 id:string;
 name:string,
 email:string,
 phone:string,
 avatar:string,
 role:string,
 creci:string,
 creciUF:string,
 houses?:Houses[]  

}
export type Houses  = {

    id:string,
    name:string,
    code:string
    descript:string
    price:number
    bedrooms:string
    UF:string
    city:string
    address:string
    district:string
    meters:string
    garage:string
    images:string[],
    categories:{
        id:string
        name:string
    }
    User?:{
        id:string;
        name:string,
        email:string,
        phone:string,
        avatar:string,
        role:string,
        creci:string,
        creciUF:string,
    }
    suite:string
    createAt:string
    updateAt:string
    map:(house:any,index:number)=>void
   

}
export type Categories = {
    id:string
    name:string
    subCategory?:subCategory[]
}
export type subCategory = {
    id:string,
    name:string
}
