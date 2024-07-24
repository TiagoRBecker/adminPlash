"use client"

import { useSession } from "next-auth/react"


export const sessionHook =  ()=> {
     const { data:session} = useSession()
    return session
}