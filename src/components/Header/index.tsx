"use client";

type User = {
  name: string;
  email: string;
  role: string;
  avatar: string;
};
import { Avatar } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Filter from "../Filter";
const Header = ({ search, value, onChange, handleMenu }: any) => {
  const { data: session } = useSession();
 const handleSubmitFilter = (filterValues:any)=>{
   console.log(filterValues)
 }
  return (
    <div className="w-full h-28 flex items-center justify-between pl-[8%] py-2 bg-white ">
      {/* <div className="w-full flex items-center gap-2">
        <input
        value={value}
        onChange={onChange}
          type="search"
          className="w-2/3 h-9 outline-none border-[1px] border-gray-300 rounded-md pl-4 px-4 "
          placeholder={"Filtar nome"}
        />
        <div className="bg-[#14b7a1] w-12 h-9 rounded-md flex items-center justify-center" onClick={search}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6  text-white cursor-pointer "
          
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        </div>
        
      </div>
  */}
      <Filter onSubmitFilter={handleSubmitFilter}/>
      
    </div>
  );
};

export default Header;
