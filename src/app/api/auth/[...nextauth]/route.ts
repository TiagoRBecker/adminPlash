import NextAuth ,{AuthOptions} from "next-auth"


import { authOptions } from "@/components/utils/authoption"

const handler = NextAuth(authOptions as any)

export { handler as GET, handler as POST }