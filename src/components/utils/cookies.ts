'use server'
import { cookies } from 'next/headers'

 
export async function createCookie(data:any) {
  const oneDay = 24 * 60 * 60;
  cookies().set({
    name: 'token',
    value: data,
    httpOnly: true,
    path: '/dashboard',
    maxAge:oneDay
  })
  }
  export  async function getCookies() {
    const cookieStore = await cookies()
    const token = await  cookieStore.get('token')?.value
  
    return token
  }
  export  async function deleteCookie() {
    cookies().delete('token')
  }