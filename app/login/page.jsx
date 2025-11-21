"use client"

import Link from "next/link";
import { signIn } from "next-auth/react"
import { redirect } from "next/navigation";
import LoginForm from "@/components/login-form";

export default function LoginPage() {
    async function handleLogin(formData) {
        const email = formData.get('email');
        const password = formData.get('password');

        const response = await signIn("credentials", {
            redirect: false,
            email: email,
            password: password
        })

        if (!response.ok) {
            alert("login gagal")
            return
        }

        alert("login Success")
        redirect("/dashboard")
    }

  return (
     <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}      
/* <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div> */