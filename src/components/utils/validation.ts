
import * as z from "zod";
import { comission } from "../Mock";

export const user = z.object({
  name: z.string().min(1, { message: "Necessário  preencher o campo nome" }),
  email: z
    .string()
    .email({ message: "Insira um email válido" })
    .min(1, { message: "Necessário  preencher o email" }),
  phone: z.string().min(11, {
    message: "Necessário  preencher o campo telefone com 11 dígitos",
  }),
  profession: z.string().min(1, {
    message: "Necessário  preencher o campo Creci",
  }),
  password: z.string().min(6, {
    message: "Necessário  preencher o campo Senha",
  }),
  commission: z.string().min(1, {
    message: "Necessário  preencher o comissão",
  }),
});
export const article = z.object({
  name: z.string().min(1, { message: "Campo Obrigatorio" }),

  author: z.string().min(1, { message: "Campo Obrigatorio" }),
 
  company: z.string().min(1, { message: "Campo Obrigatorio" }),
  status: z.enum(['free', 'recommended',"most-read","trend"]),
 
  categoryId: z.any().refine(
    (value) => {
      return value !== "" && value !== null;
    },
    { message: "Selecione uma opção válida" }
  ),

  articleId: z.any().refine(
    (value) => {
      return value !== "" && value !== null;
    },
    { message: "Selecione uma opção válida" }
  ),
  magazineId: z.any().refine(
    (value) => {
      return value !== "" && value !== null;
    },
    { message: "Selecione uma opção válida" }
  ),
});
export const magazine = z.object({
  name: z.string().min(1, { message: "Campo Obrigatorio" }),
  volume: z.string().min(1, { message: "Campo Obrigatorio" }),
  author: z.string().min(1, { message: "Campo Obrigatorio" }),
  company: z.string().min(1, { message: "Campo Obrigatorio" }),
  subCategory: z.string().min(1, { message: "Campo Obrigatorio" }),
  model: z.string().min(1, { message: "Campo Obrigatorio" }),
  description: z.string().min(1, { message: "Campo Obrigatorio" }),
  categoryId: z.any().refine(
    (value) => {
      return value !== "" && value !== null;
    },
    { message: "Selecione uma opção válida" }
  ),
  employeeId: z.optional(z.any()),

  articleId: z.any().refine(
    (value) => {
      return value !== "" && value !== null;
    },
    { message: "Selecione uma opção válida" }
  ),
 
  
});

export const login = z.object({
  email: z
    .string()
    .email({ message: "Insira um email válido." })
    .min(1, { message: "Campo Obrigatorio" }),
  password: z.string().min(6, { message: "Campo Obrigatorio" }),
});
export const filter = z.object({
  categories: z.string().refine(
    (value) => {
      return value !== "" && value !== null;
    },
    { message: "Selecione uma opção válida" }
  ),
  city: z.string().refine(
    (value) => {
      return value !== "" && value !== null;
    },
    { message: "Selecione uma opção válida" }
  ),
  district: z.string().refine(
    (value) => {
      return value !== "" && value !== null;
    },
    { message: "Selecione uma opção válida" }
  ),
  bedrooms: z.string().optional(),
  suite: z.string().optional(),
  garage: z.string().optional(),

  rangePricelow: z.string().refine(
    (value) => {
      return value !== "" && value !== null;
    },
    { message: "Selecione uma opção válida" }
  ),
  rangePriceHigh: z.string().refine(
    (value) => {
      return value !== "" && value !== null;
    },
    { message: "Selecione uma opção válida" }
  ),
});
export const events = z.object({
  name: z.string().min(1,{message:"Necessário preencher  o campo  nome"}),
  email: z.string().min(1,{message:"Necessário preencher  o email"}),
  phone: z.string().min(11,{message:"Necessário preencher  o campo telefone"}),
  organizer: z.string().min(1,{message:"Necessário preencher  o campo  organizador"}),
  sponsorID: z.string().min(1, { message: "Necessário adicionar um patrocinador" }).optional(),

 
  
})
export const coverEvent = z.object({
  name: z.string().min(1,{message:"Necessário preencher  o campo  nome"}),

  desc: z.string().min(11,{message:"Necessário preencher o campo descrição"}),
 

 
  
})
export const order = z.object({
  status: z.string().min(1,{message:"Necessário atualizar  o campo  Status"}),
  codEnv: z.string().min(1,{message:"Necessário preencher  o campo  com o código de envio"}),
})
export const sponsor = z.object({
  name: z.string().min(1,{message:"Necessário preencher o campo nome"}),
  url: z.string().min(1,{message:"Necessário preencher  o campo  rede social"}),
  email: z.string().min(1,{message:"Necessário preencher  o email"}),
  phone: z.string().min(11,{message:"Necessário preencher  o campo telefone"}),
  company: z.string().min(5,{message:"Necessário preencher  o campo empresa"}),
})
export type Login = z.infer<typeof login>;
export type User = z.infer<typeof user>;
export type Articles = z.infer<typeof article>;
export type Magazine = z.infer<typeof magazine>;
export type Filter = z.infer<typeof filter>;
export type Event = z.infer<typeof events>;
export type Order = z.infer<typeof order>;
export type Sponsor = z.infer<typeof sponsor>;
export type Covers = z.infer<typeof coverEvent>;


