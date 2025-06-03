import bcrypt from "bcrypt";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./prisma";

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },


  providers: [
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const user = await prisma.user.findUnique({
            where:{
                email: credentials.email
            }
        })
    
        if(!user) {
            return null;
        }
        if(!user.isAdmin){
            return null
        }
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
      
        console.log(isPasswordValid)
        if (!isPasswordValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = Number(token.id)
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id, 
          name: token.name,
          email: token.email,
        },
      };
    },
  },
};