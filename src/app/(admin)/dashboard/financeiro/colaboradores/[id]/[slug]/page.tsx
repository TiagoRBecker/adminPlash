"use client";
import { baseURL } from "@/components/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import { useSearchParams } from "next/navigation";
import Spinner from "@/components/Spinner";
import Swal from "sweetalert2";
const payMagazine = ({ params }: { params: { slug: string; id: string } }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dvl, setDvl] = useState<any | null>(null);
  const [pay, setPay] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState(false);
  const searchParams = useSearchParams();

  const c = searchParams.get("commission");
  
  const paidOutRounded = Math.ceil(Number(dvl?.paidOut * Number(c)));
  const slug = params.slug;
  useEffect(() => {
    if (status === "authenticated") {
      getDVLName();
      return;
    }
  }, [status]);

  const getDVLName = async () => {
    try {
      //@ts-ignore
      const token = session?.user.token;
      const getDvl = await fetch(`${baseURL}employee/commision/${slug}`, {
        method: "GET",
        cache: "no-cache",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await getDvl.json();

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
    if (pay > paidOutRounded) {
       
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "O valor á pagar e maior do que o colaborado tem para receber. Tente novamente!",
      });
      return;
    }

    try {
      const payCommission = await Swal.fire({
        position: "center",
        title: "Tem certeza?",
        text: `Você deseja pagar a comissão da revista ${dvl.name}?`,
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        cancelButtonColor: "#d55",
        confirmButtonText: "Adicionar",
        confirmButtonColor: "#00FF00",
      });
      if (payCommission.isConfirmed) {
        //deleta a categoria e apos exibe  um modal Categoria deletada com sucesso!
        //@ts-ignore
        const token = session?.user.token;
        const update = await fetch(
          `${baseURL}employee/commision/update/${slug}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },

            body: JSON.stringify({ pay }),
          }
        );
        if (update.status === 200) {
          const response = await update.json();
          await Swal.fire(
            "Comissão paga com sucesso !!",
            "Clica no botão para continuar!",
            "success"
          );
          router.push(`/dashboard/financeiro/colaboradores/${params?.id}`);
          return;
        }
      }
    } catch (error) {
      console.log(error);
      //Exibe o modal de erro caso exista um
      await Swal.fire(
        "Erro ao criar o evento!",
        "Clica no botão para continuar!",
        "error"
      );
    }
  };
 

  if (loading) {
    return <Spinner />;
  }
  return (
    <section className="container mx-auto h-full  flex  flex-col items-center  p-2 gap-4  bg-white ">
      <div className="w-full">
        <h1 className=" text-gray-500 text-2xl mb-8 text-center">
          Pagar Divisão de Lucro para a revista {dvl?.name}
        </h1>

        <div className="w-full h-full flex flex-col md:flex-row md:w-[40%] mx-auto md:h-[500px] gap-3 ">
          <div className="w-full md:w-[70%]">
            <img src="/vol2.png" alt="" className="w-full h-full" />
          </div>
          <div className="w-full md:w-[30%] flex flex-col gap-3">
            <h1 className="uppercase font-bold">{dvl?.name}</h1>
            <span></span>
            <span className="text-red-500">
              Total á Pagar{" "}
              {Math.ceil(Number(dvl?.paidOut)).toLocaleString(
                "pt-br",
                {
                  style: "currency",
                  currency: "BRL",
                }
              )}
            </span>
            <span className="text-green-500">
              Total Recebido{" "}
              {Number(dvl?.toReceive).toLocaleString("pt-br", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </div>
        </div>

        <form
          className="w-full flex items-center justify-center md:flex flex-col mx-auto   md:w-[40%] gap-3  mt-10"
          onSubmit={updateDvl}
        >
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="">Pagar Valor </label>
            <NumericFormat
              value={Number(pay)}
              onValueChange={(values) => setPay(Number(values.value as any))}
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
          <button className="px-4 py-2 bg-[#14b7a1]  rounded-md text-white">
            Pagar
          </button>
        </form>
      </div>
    </section>
  );
};

export default payMagazine;
