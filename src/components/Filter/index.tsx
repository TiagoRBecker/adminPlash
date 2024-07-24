"use client";
import { useState } from "react";
import { Select, Input } from "@chakra-ui/react";
import { NumericFormat } from "react-number-format";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import { ptBR } from "date-fns/locale/pt-BR";

const Filter = ({
  onSubmitFilter,
  selectShow,
  labels,
  placeholders,
  showAuthor,
  showDate,
  showPrice,
  showName,
  showCompany,
  showCat,
  showVol,
}: any) => {
  const [selectvalue, setSelectValue] = useState("");
  const [authorValue, setAuthorValue] = useState("");
  const [nameValue, setNameValue] = useState("");
  const [companyValue, setCompanyValue] = useState("");
  const [volumeValue, setVolumeValue] = useState("");
  const [categoryValue, setCategoryValue] = useState("");
  const [categoryValueArticle, setCategoryValueArticle] = useState("");
  const [date_initial, setDateInitial] = useState<Date | null>(null);
  const [price, setPrice] = useState(0);

  const handleDateInitChange = (date: Date | null) => {
    setDateInitial(date);
  };

  const handleFilterSubmit = () => {
    // Aqui você poderia chamar a função de retorno de chamada
    onSubmitFilter({
      selectvalue,
      authorValue,
      nameValue,
      companyValue,
      volumeValue,
      categoryValue,
      categoryValueArticle,
      price,
      date_initial,
    });
  };

  return (
    <form className="w-full flex flex-col md:flex-row items-center justify-start gap-2">
      <div className="w-full md:max-w-[140px] flex flex-col items-center justify-center">
        <label className="text-left w-full">{labels?.select}</label>
        <Select
         
          value={selectvalue}
          onChange={(e) => setSelectValue(e.target.value)}
        >
          <option value="15">15</option>
          <option value="30">30</option>
          <option value="60">60</option>
        </Select>
      </div>
      {showName && (
        <div className="w-full md:max-w-[140px] flex flex-col">
          <label htmlFor="">{labels.name}</label>
          <Input
            placeholder={placeholders.name}
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
          />
        </div>
      )}
      {showVol && (
        <div className="w-full md:max-w-[140px] flex flex-col">
          <label htmlFor="">{labels.volume}</label>
          <Input
            placeholder={placeholders.volume}
            value={volumeValue}
            onChange={(e) => setVolumeValue(e.target.value)}
          />
        </div>
      )}
      {showAuthor && (
        <div className="w-full md:max-w-[140px] flex flex-col">
          <label htmlFor="">{labels?.author}</label>
          <Input
            placeholder={placeholders.author}
            value={authorValue}
            onChange={(e) => setAuthorValue(e.target.value)}
          />
        </div>
      )}
      {showPrice && (
        <div className="w-full md:max-w-[140px] flex flex-col">
          <label htmlFor="">Preço</label>
          <NumericFormat
            value={Number(price)}
            //@ts-ignore
            onValueChange={(values: any) => {
              setPrice(Number(values.value));
            }}
            className="w-full h-full outline-none border-[1px] border-gray-200 rounded-md pl-2 py-2"
            placeholder="Insira o preço"
            displayType={"input"}
            thousandSeparator={true}
            prefix={"R$ "}
            decimalSeparator={"."}
            decimalScale={2}
            fixedDecimalScale={true}
          />
        </div>
      )}
      {showCompany && (
        <div className="w-full md:max-w-[140px] flex flex-col">
          <label htmlFor="">{labels?.company}</label>
          <Input
            placeholder={placeholders.company}
            value={companyValue}
            onChange={(e) => setCompanyValue(e.target.value)}
          />
        </div>
      )}

      {selectShow && (
        <div className="w-full md:max-w-[140px] flex flex-col items-center justify-center">
          <label className="text-left w-full">{labels?.cat}</label>
          <Select
            placeholder={placeholders.cat}
            value={categoryValueArticle}
            onChange={(e) => setCategoryValueArticle(e.target.value)}
          >
            <option value="free">Gratuito</option>
            <option value="recommended">Recomendado</option>
            <option value="trend">Tendências</option>
          </Select>
        </div>
      )}
      {showCat && (
        <div className="w-full md:max-w-[140px] flex flex-col">
          <label htmlFor="">{labels?.cat}</label>
          <Input
            placeholder={placeholders.cat}
            value={categoryValue}
            onChange={(e) => setCategoryValue(e.target.value)}
          />
        </div>
      )}
      {showDate && (
        <div className="w-full md:max-w-[140px] flex flex-col">
          <label htmlFor="">Buscar por Data </label>
          <DatePicker
            selected={date_initial}
            onChange={handleDateInitChange}
            dateFormat="dd/MM/yyyy"
            locale={ptBR}
            placeholderText="dd/mm/yyyy"
            className="w-full h-full outline-none border-[1px] border-gray-400 rounded-sm py-2 pl-3"
          />
        </div>
      )}
      <div className="w-full md:max-w-[140px] flex flex-col items-center justify-center h-full mt-6">
        <label htmlFor="" className="hidden md:block">
          {""}
        </label>
        <button
          className="w-full px-4 py-2 bg-[#14b7a1] flex items-center justify-center rounded-md text-white"
          onClick={handleFilterSubmit}
        >
          Filtrar
        </button>
      </div>
    </form>
  );
};

export default Filter;
