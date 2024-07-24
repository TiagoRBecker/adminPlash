import { baseURL, url } from "@/components/utils/api";
import { authOptions } from "@/components/utils/authoption";
import { Avatar } from "@chakra-ui/react";
import { getServerSession } from "next-auth";
import Swal from "sweetalert2";

//Hook responsavel por fazer a logica de cadastrar e editar os colaboradores
class Magazine {
  private baseURL: string;
  private url: string;

  constructor() {
    this.baseURL = baseURL;
    this.url = url;
  }

  async getByMagazine(
    slug: string,
    setValue: any,
    setEmployeesMagazine: any,
    setLoading: any,
    setAvatar: any,
    setUrl: any,
    token: string
  ) {
    const getArticle = await fetch(`${this.baseURL}magazine/${slug}`, {
      method: "GET",
      cache: "no-cache",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const response = await getArticle.json();
  
    Object.keys(response).forEach((key: any) => {
      setValue(key, response[key] as any);
    });

    setEmployeesMagazine(response.employees);
    setAvatar(response.cover);
    setUrl(response.magazine_pdf);
    setLoading(false);
    return;
  }
  async getCategories(setCategories: any) {
    const getCat = await fetch(`${this.url}/categories`, {
      method: "GET",
    });
    const response = await getCat.json();
    setCategories(response);
  }
  async removeEmployee(
    slug: string,
    id: string,
    getByMagazine: any,
    token: string
  ) {
    const del = await Swal.fire({
      position: "center",
      title: "Tem certeza?",
      text: `Você deseja remover o colaborador da revista?`,
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#333",
      confirmButtonText: "Remover",
      confirmButtonColor: "red",
    });
    if (del.isConfirmed) {
      try {
        const removeEmployeeResponse = await fetch(
          `${this.baseURL}removeEmplooyeMagazine`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ slug, id }),
          }
        );

        if (removeEmployeeResponse.status === 200) {
          await Swal.fire(
            "Colaborador removido com sucesso!!",
            "Clica no botão para continuar!",
            "success"
          );
          await getByMagazine();
          return;
        }
      } catch (error) {
        console.log(error);
        await Swal.fire(
          "Erro ao remover o colaborador!",
          "Clica no botão para continuar!",
          "error"
        );
      }
    }
  }
  upload(
    e: React.ChangeEvent<HTMLInputElement>,
    setLoading: any,
    setAvatar: any
  ) {
    setLoading(true);
    const files = e.target.files as any;
    if (files) {
      // Se um arquivo foi fornecido, atualize a URL
      setAvatar(files[0]);
      setLoading(false);
    }

    return;
  }
  async uploadPdf(
    e: React.ChangeEvent<HTMLInputElement>,
    setUrl: any,
    setLoading: any
  ) {
    const files = e.target.files as any;
    
    if (files) {
      // Se um arquivo foi fornecido, atualize a URL
     
      
    
      setUrl(files[0]);
      setLoading(false);
    }
  }
  async editUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    setLoading: any,
    setNewAvatar: any
  ) {
    setLoading(true);

    const files = e.target.files as any;
    if (files) {
      setNewAvatar(files[0]);
      setLoading(false);
    }

    return;
  }
  editUploadPdf(
    e: React.ChangeEvent<HTMLInputElement>,
    setLoading: any,
    setNewPdf: any
  ) {
    setLoading(true);
    const files = e.target.files as any;
    if (files) {
      // Se um arquivo foi fornecido, atualize a URL
      setNewPdf(files[0]);
      setLoading(false);
    }

    return;
  }
  clearAvatar = (setAvatar: any) => {
    setAvatar("");
  };

  clearPdf = (setUrl: any) => {
    setUrl("");
  };
  addEmployee(employees: any, employeesID: any, id: any, setEmployeesID: any) {
    const filteredEmployee = employees.find(
      (employee: any) => employee.id === Number(id)
    );
    if (filteredEmployee) {
      const checkIDArray = employeesID.some(
        (emp: any) => emp.id === filteredEmployee.id
      );
      if (!checkIDArray) {
        setEmployeesID((prev: any) => [...prev, filteredEmployee]);
      }
    }
  }
  handleRemoveEmployee(id: string, setEmployeesID: any) {
    setEmployeesID((prev: any) => {
      const pos = prev.findIndex((item: any) => item.id === Number(id));
      const newArrayEmployee = prev.filter(
        (value: any, index: any) => index !== pos
      );
      return newArrayEmployee;
    });
  }
}

const MagazineController = new Magazine();
export default MagazineController;
