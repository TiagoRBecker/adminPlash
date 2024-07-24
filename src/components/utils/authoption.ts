import CredentialsProvider from "next-auth/providers/credentials";
import { baseURL, url } from "./api";
import { NextAuthOptions } from "next-auth";


export const authOptions :NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,

  },

  pages: {
    signOut: "/",
    signIn: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req):Promise<any> {
        const authLogin = await fetch(`${url}/signin/admin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ credentials }),
        });
        if(authLogin.status === 404){
          throw new Error("E-mail não cadastrado no sistema")
        }
        if(authLogin.status === 401){
          throw new Error("E-mail ou senha invalidos!")
        }
        if (authLogin.status === 200) {
          const data = await authLogin.json();
          return {
            ...data
          }
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }:any) => {
      if (user) {
        token.user = user;
      }
      return token;
    },
    session: async ({ session, token }:any) => {
      if (token) {
        session.user = token.user;
      }
      return session;
    },
  },
};
