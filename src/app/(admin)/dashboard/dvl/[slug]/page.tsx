"use client";
import Spinner from "@/components/Spinner";
import ApiController, { baseURL } from "@/components/utils/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { NumericFormat } from "react-number-format";
import Swal from "sweetalert2";
import Link from "next/link";
const DvlID = ({ params }: { params: { slug: string } }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const search = useSearchParams();
  const price: any = search.get("price");
  const slug = params.slug;

  useEffect(() => {
    if (status === "authenticated") {
      getDVLName();
    }
  }, [status]);
  const [dvl, setDvl] = useState<any | null>(null);
  const [pay, setPay] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState(false);

  const getDVLName = async () => {
    try {
      //@ts-ignore
      const token = session?.user.token;

      const response = await ApiController.getDVLName(slug, token);
     console.log(response)
      setDvl(response); 
      setLoading(false);
      return;
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const updateDvl = async (e: any) => {
    e.preventDefault();

    setErrorText(false);
    if (Number(pay) === 0) {
      setErrorText(true);
      return;
    }
    if (pay > dvl.paidOut) {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "O valor á pagar e maior do que o colaborado tem para receber. Tente novamente!",
      });
      return;
    }

    const payCommission = await Swal.fire({
      position: "center",
      title: "Tem certeza?",
      text: `Você deseja pagar as comissões  da revista ${dvl.name}?`,
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#d55",
      confirmButtonText: "Adicionar",
      confirmButtonColor: "#00FF00",
    });
    if (payCommission.isConfirmed) {
      //deleta a categoria e apos exibe  um modal Categoria deletada com sucesso!
      //@ts-ignore
      try {
        //@ts-ignore
        const token = session?.user.token;
        await ApiController.updateDvl(slug, token, pay);
        await Swal.fire(
          //@ts-ignore
          `Todos as reivistas com o nome ${dvl.name} foram pagas com sucesso! `,
          "Clica no botão para continuar!",
          "success"
        );
        router.push("/dashboard/dvl");
      } catch (error) {
        await Swal.fire(
          //@ts-ignore
          `Erro ao tentar atualizaro dvl ! `,
          "Clica no botão para continuar!",
          "error"
        );
      }
    }
  };

  if (loading) {
    return (
      <section className="w-full h-screen py-10 flex items-center justify-center">
        <Spinner />
      </section>
    );
  }
  return (
    <section className="container mx-auto h-full  flex  flex-col items-center  p-2 gap-4  bg-white ">
      <div className="w-full ">
        

        <div className="w-full h-full flex flex-col md:flex-row md:w-[60%] mx-auto md:h-[600px] gap-3 ">
          <div className="w-full md:w-[50%]">
            <img
              src={dvl?.picture}
              alt=""
              className="w-full h-[600px] object-cover"
            />
          </div>
          <div className="w-full md:w-[50%] border-[1px] border-gray-200  p-2 flex items-center justify-between flex-col gap-3">
            <div className="w-full">
              <h1 className="uppercase font-bold">{dvl?.name}</h1>
              <span className="text-blue-400">
                Data da compra{" "}
                {new Date(dvl?.createDate).toLocaleString("pt-br")}
              </span>
              <div className="w-full flex items-center justify-between font-bold text-green-500 mb-[6px] ">
              <span>Total do DVL</span>
            <span>
                
                {Number(price * 2).toLocaleString("pt-br", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
              </div>
            </div>
            <div className="w-full">
            <div className="w-full flex items-center justify-between font-bold text-red-500 mb-[6px] ">
              <span>Pagar</span>
            <span className="">
                
                {Number(dvl?.paidOut).toLocaleString("pt-br", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
              </div>
              <div className="w-full flex items-center justify-between font-bold text-green-500 mb-[6px] ">
               <span>
               Recebido
               </span>
               
              <span >
              
                {Number(dvl?.toReceive).toLocaleString("pt-br", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
             </div>
              <form
                className="w-full flex items-center justify-center md:flex flex-col mx-auto   gap-3  mt-10"
                onSubmit={updateDvl}
              >
                <div className="w-full flex flex-col gap-2">
                  <label htmlFor="">Pagar Valor </label>
                  <NumericFormat
                    value={Number(pay)}
                    onValueChange={(values) =>
                      setPay(Number(values.value as any))
                    }
                    displayType={"input"}
                    thousandSeparator={true}
                    prefix={"R$ "}
                    decimalSeparator={"."}
                    decimalScale={2}
                    fixedDecimalScale={true}
                    className="w-full h-full outline-none border-[1px] border-gray-400 rounded-sm py-2 pl-3"
                  />
                  {errorText && (
                    <p className="text-sm text-red-600">
                      Prrencha o campo com o valor corretamente!
                    </p>
                  )}
                </div>
                <button className="w-full px-4 py-2 bg-[#14b7a1]  rounded-md text-white">
                  Pagar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DvlID;
