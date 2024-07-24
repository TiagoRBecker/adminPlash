"use client";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import { ptBR } from "date-fns/locale/pt-BR";
import { baseURL, url } from "@/components/utils/api";
import { Checkbox, CheckboxGroup, Stack } from "@chakra-ui/react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";
import { useSession } from "next-auth/react";
import { EOF } from "dns";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const AddEvent = () => {
  const {data:session,status} = useSession()
  useEffect(() => {
    if(status === 'authenticated'){
      getCovers();
      return
    }
   
  }, [status]);
   
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState(false)
  const [descript, setDescript] = useState("");
  const [value, onChange] = useState<any>(new Date());
  const [covers, setCovers] = useState([]);
  const [selectedValues, setSelectedValues] = useState<any>([]);
  const [loading ,setLoading] = useState(true)
  const handleCheckboxChange = (value: string) => {
    // Verifica se o valor já está presente no array de valores selecionados
    if (selectedValues.includes(value)) {
      // Se já estiver presente, remove o valor do array
      setSelectedValues(selectedValues.filter((val: any) => val !== value));
    } else {
      // Caso contrário, adiciona o valor ao array
      setSelectedValues([...selectedValues, value]);
    }
  };
  const handleDateInitChange = (date: Date | [Date, Date] | null) => {
    onChange(date);
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
     if(name === "" || descript === "" || selectedValues.length <= 0){
      Swal.fire({
        icon: "error",
        title: "Por favor preencha os campos corretamente",
        text: `Verificar campos vazios antes de cadastrar um novo evento`,
        footer: 'Alerta de campo vazio!!!!'
      });
      setError(true)
      return
     }
    const date_event = value?.getTime();
    const addEvent = await Swal.fire({
      position: "center",
      title: "Tem certeza?",
      text: `Você deseja adicionar um novo  ${name}?`,
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#d55",
      confirmButtonText: "Adicionar",
      confirmButtonColor: "#00FF00",
    });
    if (addEvent.isConfirmed) {
      try {
        //deleta a categoria e apos exibe  um modal Categoria deletada com sucesso!
        //@ts-ignore
        const token = session?.user.token 
        const addArticle = await fetch(`${baseURL}create-event-cover`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:`Bearer ${token}`
          },
          body: JSON.stringify({ selectedValues, name, date_event }),
        });

        if (addArticle.status === 200) {
          await Swal.fire(
            "Evento criado com sucesso!!",
            "Clica no botão para continuar!",
            "success"
          );

          router.push("/dashboard/covers_events");
          return;
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
    }
    
  };
  const getCovers = async () => {
    //@ts-ignore
    const token = session?.user.token
    const request = await fetch(`${baseURL}magazines`, {
      method: "GET",
      cache:"no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization:`Bearer ${token}`
      },
    });
    const response = await request.json();
   
    setCovers(response.magazine);
    setLoading(false)
    return;
  };
  if(loading)
  return(
 <section className="w-full h-screen flex items-center justify-center">
     <Spinner/>
 </section>
 )
  return (
    <section className="container mx-auto h-full  flex  flex-col items-center  px-4 gap-4   rounded-sm p-2">
      <form
        className="w-[80%] mx-auto flex flex-col gap-4   rounded-md  py-2 px-2 shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white"
        encType="multipart/form-data"
        onSubmit={handleSubmit}
      >
        <h1 className="text-xl text-center text-gray-400 uppercase py-4">
          Cadastrar evento
        </h1>
        <div className="flex flex-col gap-1">
          <label htmlFor="">Evento Nome</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            className={error ? "w-full h-7 outline-none border-[1px] border-red-600 rounded-sm pl-2":"w-full h-7 outline-none border-[1px] border-gray-400 rounded-sm pl-2"}
            placeholder="Nome evento"
          />
        </div>
      
          <div className="w-full h-16  flex flex-col mt-4 gap-2 ">
            <label htmlFor="">Data Encerramento do evento </label>

            <DatePicker
              id="date"
              selected={value}
              onChange={handleDateInitChange}
              value={value?.toLocaleString("pt-BR")}
              showTimeSelect
              dateFormat="dd/MM/yyyy"
              locale={ptBR}
              placeholderText="Selecione a Data do evento"
              className="w-full h-full outline-none border-[1px] border-gray-400 rounded-sm py-2 pl-3"
              minDate={new Date()}
            />
          </div>
          <div className="flex flex-col gap-1">
          <label htmlFor="">Descrição do evento</label>
          <textarea
            value={descript}
            onChange={(e) => setDescript(e.target.value)}
          
            className={error ? "w-full h-7 outline-none border-[1px] border-red-600 rounded-sm pl-2  min-h-[250px]":"w-full h-7 outline-none border-[1px] border-gray-400 rounded-sm pl-2 min-h-[250px]"}
            placeholder="Descrição do evento!"
          />
        </div>
       
        <div className="flex flex-col gap-1">
          <label htmlFor="">Revistas Cadastradas no sistema</label>
        <CheckboxGroup colorScheme="green">
          <Stack spacing={[1, 5]} direction={["column", "row"]}>
            {covers?.map((cover: any, index) => (
              <div
                key={cover.id}
                style={{ position: "relative", display: "inline-block" }}
              >
                <img
                  src={cover.cover}
                  alt={cover.name}
                  className="w-28 h-36 object-cover"
                />
                <Checkbox
                  position={"absolute"}
                  top={2}
                  right={2}
                  border={error? "red":"green"}
                  value={String(cover.id)}
                  onChange={(e) => handleCheckboxChange(e.target.value)}
                >
                  {/* Ícone do checkbox */}
                </Checkbox>
              </div>
            ))}
          </Stack>
        </CheckboxGroup>
        </div>
        <div className="w-full  rounded-md flex items-center justify-center">
          <button
            className="w-40 py-2  bg-[#14b7a1] rounded-md  text-white "
            type="submit"
          >
            Criar Evento
          </button>
        </div>
      </form>
    </section>
  );
};

export default AddEvent;
