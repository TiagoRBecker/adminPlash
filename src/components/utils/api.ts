export const baseURL = "http://77.37.69.19/admin/";
export const url = "http://77.37.69.19/public";
export const authUrl = "http://77.37.69.19/auth";
//"http://191.101.70.103:5000"
//http://77.37.69.19:443
class Api {
  async getMagazines(currentPage: string, token: string) {
    //@ts-ignore
    try {
      const magazines = await fetch(`${baseURL}magazines?page=${currentPage}`, {
        method: "GET",
        cache: "no-cache",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await magazines.json();
      return response;
    } catch (error) {
      console.log(error);
    }

    return;
  }
  async getMagazine(slug: string, token: string) {
    try {
      const getMagazine = await fetch(`${baseURL}magazine/${slug}`, {
        method: "GET",
        cache: "no-cache",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await getMagazine.json();
      return response;
    } catch (error) {
      console.log(error);
    }
  }
  async createMagazine(formData: any, token: string) {
    try {
      //Adiciona a categoria e apos exibe  um modal Categoria adicionada com sucesso!
      //@ts-ignore

      const createMagazine = await fetch(`${baseURL}create-magazine`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const response = await createMagazine.json();
      return response;
    } catch (error) {
      console.log(error);
      //Exibe o modal de erro caso exista um
    }
  }
  async updateMagazine(formData: any, token: string, slug: string) {
    try {
      //Apos concluido com sucesso exibe  o modal de revista atualizada e redireciona para rota de exibição das revistas

      const updateMagazine = await fetch(`${baseURL}update-magazine/${slug}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const response = await updateMagazine.json();
      return response;
    } catch (error) {
      console.log(error);
      //Exibe o modal de erro caso exista um
    }
  }
  async deleteMagazines(id: string, name: string, token: string) {
    try {
      const deleteMagazine = await fetch(`${baseURL}delet-magazine`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, name }),
      });
      //@ts-ignore
      const response = await deleteMagazine.json();
      return response;
    } catch (error) {
      console.log(error);

      //@ts-ignore
      //Exibe o modal de erro caso exista um
    }
  }
  async getArticles(page: string, token: string) {
    try {
      const articles = await fetch(`${baseURL}articles?page=${page}`, {
        method: "GET",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await articles.json();
      return response;
    } catch (error) {
      console.log(error);
    }
  }
  async getArticle(slug: string, token: string) {
    try {
      const article = await fetch(`${baseURL}article/${slug}`, {
        method: "GET",
        cache: "no-cache",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await article.json();
      return response;
    } catch (error) {
      console.log(error);
    }
  }
  async createArticle(formData: any, token: string) {
    try {
      //deleta a categoria e apos exibe  um modal Categoria deletada com sucesso!

      const createArticle = await fetch(`${baseURL}create-article`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const response = await createArticle.json();
      return response;
    } catch (error) {
      console.log(error);
      //Exibe o modal de erro caso exista um
    }
  }
  async updateArticle(slug: string, token: string, formData: any) {
    try {
      //deleta a categoria e apos exibe  um modal Categoria deletada com sucesso!

      const updateArticle = await fetch(`${baseURL}update-article/${slug}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const response = await updateArticle.json();
      return response;
    } catch (error) {
      console.log(error);
      //Exibe o modal de erro caso exista um
      //@ts-ignore
    }
  }
  async deleteArticle(token: string, name: string, id: string) {
    try {
      const deleteArticle = await fetch(`${baseURL}delet-article`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, name }),
      });

      const response = await deleteArticle.json();
      return response;
    } catch (error) {
      console.log(error);
    }
  }
  async getCategories() {
    const getCat = await fetch(`${url}/categories`, {
      method: "GET",
    });
    const response = await getCat.json();
    return response;
  }
  async getCategory(slug: string) {
    try {
      const category = await fetch(`${url}/category/${slug}`, {
        method: "GET",
      });
      const response = await category.json();
      return response;
    } catch (error) {
      console.log(error);
    }
  }
  async createCategory() {}
  async updateCategory(slug: string, token: string, editCategory: string) {
    try {
      const editCat = await fetch(`${baseURL}update-category/${slug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({ slug, editCategory }),
      });
      const response = await editCat.json();
      return response;
    } catch (error) {
      console.log(error);
    }
  }
  async deleteCategories(token: string, id: string) {
    try {
      const deletCat = await fetch(`${baseURL}delet-category`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });
      const response = await deletCat.json();
      return response;
    } catch (error) {
      console.log(error);
    }
  }
  async getOneCategory(slug: string) {
    const getCat = await fetch(`${url}/category/${slug}`, {
      method: "GET",
    });
    const response = await getCat.json();
    return response;
  }
  async getEmployees(token: string) {
    try {
      const employeeResponse = await fetch(`${baseURL}employees`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await employeeResponse.json();

      return response;
    } catch (error) {
      console.log(error);
    }

    return;
  }
  async removeEmployee(token: string, slug: string, id: string) {
    try {
      const removeEmployeeResponse = await fetch(
        `${baseURL}removeEmplooyeMagazine`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ slug, id }),
        }
      );
      const response = await removeEmployeeResponse.json();
      return response;
    } catch (error) {
      console.log(error);
    }
  }
  async getDvls(page: string, token: string) {
    try {
      const getDvlForPay = await fetch(`${baseURL}dvls?page=${page}`, {
        method: "GET",
        cache: "no-cache",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await getDvlForPay.json();
      return response;
    } catch (error) {
      console.log(error);
    }
  }
  async getDVLName(slug: string, token: string) {
    try {
      //@ts-ignore
    
      const getDvl = await fetch(`${baseURL}dvl/${slug}`, {
        method: "GET",
        cache: "no-cache",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await getDvl.json();
      return response;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  async updateDvl(slug:string,token:string,pay:number){
    try {
      const update = await fetch(
        `${baseURL}dvl/${slug}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
  
          body: JSON.stringify({ pay}),
        }
      );
      const response = await update.json();
    } catch (error) {
      console.log(error)
    }
   
  }
  async getBanners() {
    try {
      const banners = await fetch(`${url}/banners`, {
        method: "GET",
        cache: "no-cache",
      });
      const response = await banners.json();
      return response;
    } catch (error) {
      console.log(error);
    }
  }
  async createBanner(token: string, formData: any) {
    try {
      const addArticle = await fetch(`${baseURL}create-banners`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const response = await addArticle.json();
      return response;
    } catch (error) {
      console.log(error);
    }
  }
  async deleteBanner(id: string, token: string) {
    try {
      //@ts-ignore

      const deletBanner = await fetch(`${baseURL}delet-banners`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });
      const response = await deletBanner.json();

      return response;
    } catch (error) {
      console.log(error);
    }
  }
  async UploadPdf(token: string, formData: any) {
    try {
      const upload = await fetch(`${baseURL}upload/pdf`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const response = await upload.json();
      return response;
    } catch (error) {
      console.log(error);
    }
  }
}
const ApiController = new Api();
export default ApiController;
