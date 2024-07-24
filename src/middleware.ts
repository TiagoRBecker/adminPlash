export {default} from "next-auth/middleware"
/*import { NextResponse } from 'next/server'

 
// This function can be marked `async` if using `await` inside
export async  function middleware(request: any,response:any) {
     const token =   request.cookies.get('next-auth.session-token')?.value
     
    if(!token){
        return NextResponse.rewrite(new URL('/', request.url))
    }
    
  
}
*/
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/dashboard/:path*']
}