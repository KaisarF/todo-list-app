'use client'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import bgShape from "@/../public/bg-shape.svg"
import Cookies from "js-cookie"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "../axios"

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await axios.post('/login', formData)
            const token = response.data.content.token
            const role = response.data.content.user.role
            if (token && role === 'USER') {
                Cookies.set('role', role, { expires: 7 }) 
                Cookies.set('user', response.data.content.user.fullName, { expires: 7 }) 
                Cookies.set('token', token, { expires: 7 })
                console.log("Login successful:", response.data.content.token)
                router.push('/dashboard')
            }else if (token && role === 'ADMIN') {
                Cookies.set('role', role, { expires: 7 }) 
                Cookies.set('user', response.data.content.user.fullName, { expires: 7 }) 
                Cookies.set('token', token, { expires: 7 })
                console.log("Login successful:", response.data.content.token)
                router.push('/adminDashboard')
            } else {
                console.error("Login failed: Invalid role or token")
                
            }
    }
        catch (error) {
            console.error("Login failed:", error)
            // Handle error (e.g., show a notification)
        }
    }

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-[#FAFAFB]" >
        <div className="bg-[url('/bg-shape.svg')] w-full h-screen bg-no-repeat bg-position-[0_-140px] bg-contain flex flex-col items-center justify-center">

            <h1 className=" text-[56px]  font-[700] text-[#44444F]">Sign In</h1>
            <p className="my-5 text-[#92929D]">Just sign in if you have an account in here. Enjoy our Website</p>
            <Card className="w-full max-w-sm">
            
            <CardContent>
                <form>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <Label className="bg-white translate-y-4 translate-x-2 w-max px-1 py-1" htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="password" className=" bg-white translate-y-4 translate-x-2 w-max px-1 py-1">Password</Label>
                        <Input 
                        id="password" 
                        type="password"
                        placeholder="********"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})} 
                        required />
                        
                    </div>
                </div>
                </form>
            </CardContent>
                <div className="flex items-center justify-between px-6 ">
                    <div className="flex items-center gap-3">
                        <Checkbox id="remember" />
                        <Label htmlFor="remember">Remember me</Label>
                    </div>
                    <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                        >
                        Forgot your password?
                    </a>
                </div>
            <CardFooter className="flex-col gap-2">
                <Button 
                type="submit" 
                className="w-full"
                onClick={handleSubmit}>
                Login
                </Button>
                
            </CardFooter>
            </Card>
            <p className="mt-5 text-[#92929D]">Dont have an account? <a href="/register" className="text-[#0062FF]">Register</a></p>
        </div>
    </div>
  )
}
