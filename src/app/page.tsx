"use client";

import Loading from "@/components/Spinner";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { useState } from "react";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erroText, setErrorText] = useState("");
  const [error, setError] = useState(false);
  const [sucess, setSucess] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleLogin = async (e: any) => {
    setError(false);
    setSucess(false)
    setLoading(true);
    e.preventDefault();

    try {
      const login: any = await signIn("credentials", {
        redirect: false,
        email,
        password,
      
      });
     if (login.error){
      setError(true)
      setErrorText(login.error)
      setLoading(false);
      return;
     }
       // Verifica se existe callbackUrl
    const urlParams = new URLSearchParams(login.url.split("?")[1]);
    const callbackUrl = urlParams.get("callbackUrl");
    setSucess(true)
    
    // Redireciona para callbackUrl se existir, caso contrário, redireciona para "/"
    router.push(callbackUrl ? callbackUrl : "/dashboard");
    // router.push(login.cal)
     
    } catch (error) {
      console.log(error);
      return;
    }
  };
  if (loading) {
    return (<div className="w-full flex ">
      <Loading text={"Autenticando aguarde ...."} />
   
      </div>);
  }
  return (
    <section className="w-full h-screen overflow-y-hidden ">
      <div className="w-full h-full flex">
        <div className="w-full  h-full flex items-center flex-col ">
          <div className="w-full h-52 flex flex-col items-center justify-center">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-44 h-16 object-fill "
            />
            <p className="tracking-[6px] uppercase text-2xl font-bold ">
              Adminstrativo
            </p>
          </div>
          <div className="w-full h-8 flex items-center justify-center">
            {error && <p className="text-red-600">{erroText}</p>}
            {sucess && <p className="text-green-400">Autenticado com sucesso!</p>}
            
          </div>

          <form
            action=""
            onSubmit={handleLogin}
            className="w-full md:w-[450px] flex items-center justify-center flex-col gap-3 "
          >
            <h1>Acessar sua conta</h1>
            {/* Adicione seus elementos do formulário aqui */}
            <div className="flex flex-col w-full gap-2 px-2">
              <label htmlFor="">E-mail</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                placeholder="Email@email.com"
                className="w-full h-10 pl-3 outline-none border-[1px] border-gray-300 rounded-md"
              />
            </div>
            <div className="flex flex-col w-full gap-2 px-2">
              <label htmlFor="">Senha</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="*******"
                className="w-full pl-3 h-10 outline-none border-[1px] border-gray-300 rounded-md"
              />
            </div>

            <div className="w-full flex items-center justify-center">
              <button
                type="submit"
                className="px-4 py-2 bg-[#14b7a1] text-white rounded"
              >
                ENTRAR
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Signin;
