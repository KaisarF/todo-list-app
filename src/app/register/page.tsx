'use client'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import { Checkbox } from "@/components/ui/checkbox"
import { Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectGroup,
    SelectLabel,
    SelectItem  
 } from "@/components/ui/select"
 import { Textarea } from "@/components/ui/textarea"

import Cookies from "js-cookie"
import Image from "next/image"
import eyeOff from "@/../public/eyeOff.svg"
import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "../axios"

export default function LoginPage() {
    const [formData, setFormData] = useState({
        firstName:"",
        lastName: "",
        email: "",
        password: "",
        passwordConfirmation: "",
    })
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({ passwordConfirmation: "" });
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

         if (formData.password !== formData.passwordConfirmation) {
            setErrors({ passwordConfirmation: "Passwords do not match" });
            return; // Prevent submission if passwords don't match
        }

        const registerData = {
            fullName: `${formData.firstName} ${formData.lastName}`,
            email: `${formData.email}@squareteam.com`,
            password: formData.password,
        }
        try {
            const response = await axios.post('/register', registerData)
            const token = response.data.content.token
            const role = response.data.content.user.role
            if (token && role === 'USER') {
                Cookies.set('role', role, { expires: 7 }) 
                Cookies.set('user', response.data.content.user.fullName, { expires: 7 }) 
                Cookies.set('token', token, { expires: 7 })
                console.log("Login successful:", response.data.content.token)
                router.push('/dashboard')
            }
    }
        catch (error) {
            console.error("Login failed:", error)
            // Handle error (e.g., show a notification)
        }
    }

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-[#FAFAFB]" >
        <div className="bg-[url('@/../public/bg-shape.svg')] w-full h-screen bg-no-repeat bg-position-[0_-140px] bg-contain flex flex-col items-center justify-center">

            <h1 className=" text-[46px] font-[700] text-[#44444F]">Register</h1>
            <p className="my-5 text-[#92929D]">Let’s Sign up first for enter into Square Website. Uh She Up!</p>
            <Card className="w-full max-w-lg">
            
            <CardContent >
                <form>
                <div className="flex flex-col gap-3">
                    <div className="flex flex-row gap-2">
                        <div className="w-full">
                            <Label className="bg-white translate-y-2 translate-x-2 w-max p-0.5" htmlFor="firstName">first name</Label>
                            <Input
                                id="firstName"
                                type="text"
                                // placeholder="first name"
                                value={formData.firstName}
                                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                required
                            />
                        </div>
                        <div className="w-full">
                            <Label className="bg-white translate-y-2 translate-x-2 w-max p-0.5" htmlFor="lastName">last name</Label>
                            <Input
                                id="lastName"
                                type="text"
                                // placeholder="last name"
                                value={formData.lastName}
                                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                
                            />
                        </div>
                    </div>
                    <div className="flex flex-row items-center justify-center gap-2">
                        <div className="w-full flex gap-2">
                            <Input
                                placeholder="+62"
                                disabled
                                className="border-[#50B5FF] text-[#50B5FF] bg-white w-15 placeholder:text-[#50B5FF]  "
                            />
                            <div className="w-max">
                                {/* <Label className="bg-white translate-y-2 translate-x-2 w-max p-0.5" htmlFor="phoneNumber">last name</Label> */}
                                <Input
                                    id="phoneNumber"
                                    type="number"
                                    placeholder="phone number"
                                    // value={formData.lastName}
                                    // onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                    disabled
                                />
                            </div>
                        </div>
        
                            <Select>
                                <SelectTrigger className="w-full" >
                                    <SelectValue placeholder="Your Country" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup >
                                        <SelectLabel >country</SelectLabel>
                                        <SelectItem value="indonesia">indonesia</SelectItem>
                                        <SelectItem value="malaysia">malaysia</SelectItem>
                                        <SelectItem value="singapore">singapore</SelectItem>
                                        <SelectItem value="thailand">thailand</SelectItem>
                                        <SelectItem value="vietnam">vietnam</SelectItem>
                                        <SelectItem value="brunei">brunei</SelectItem>
                                        <SelectItem value="laos">laos</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                             </Select>


                    </div>
                    <div className="relative w-full">
                        <label htmlFor="email" className="sr-only">
                            Mail Address
                        </label>

                        <Input
                            id="email"
                            name="email"
                            type="text"
                            placeholder="Mail Address"
                            className="
                            block w-full 
                            border border-gray-300
                            rounded-md
                            focus:outline-none focus:ring-2 focus:ring-blue-500
                            placeholder-gray-400
                            "
                            value={formData.email}
                            onChange={e =>
                            setFormData({ ...formData, email: e.target.value })
                            }
                            pattern="[A-Za-z0-9._%+-]+" 
                            required
                        />

                        <span
                            aria-hidden="true"
                            className="
                            absolute inset-y-0 right-0
                            flex items-center
                            pr-3 text-gray-500
                            pointer-events-none
                            "
                        >
                            @squareteam.com
                        </span>
                    </div>
                    <div className="flex flex-row gap-2">
                        <div className="relative w-full">
                            <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password" 
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            placeholder='Input password'
                            className='px-3 py-1 border-2 border-[#E2E8F0] text-[#64748B] rounded-md w-full pr-10'
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 focus:outline-none"
                        >
                            <Image src={eyeOff} alt="Toggle password visibility" />
                        </button>
                        </div>  
                        <div className="relative w-full">
                            <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={formData.passwordConfirmation}
                            onChange={(e) => setFormData({...formData, passwordConfirmation: e.target.value})}
                            name="password" // 'name' attribute wajib untuk FormData
                            placeholder='confirm password'
                            className='px-3 py-1 border-2 border-[#E2E8F0] text-[#64748B] rounded-md w-full pr-10'
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 focus:outline-none"
                        >
                            <Image src={eyeOff} alt="Toggle password visibility" />
                        </button>
                        </div>  
                    </div>
                    {errors.passwordConfirmation && (
                            <p className="text-red-500 text-sm">{errors.passwordConfirmation}</p>
                        )}
                    <div>
                        <Label htmlFor="aboutYou">Tell us about yourself</Label>
                        <Textarea placeholder="hello my name is ..."
                        disabled id="aboutYou" 
                        className="border-2 border-gray-500 h-[100px] mt-2"/>
                    </div>
                </div>
                </form>
            </CardContent>
                
            <CardFooter className="flex-col gap-2">
                <Button 
                type="submit" 
                className="w-full"
                onClick={handleSubmit}>
                sign up
                </Button>
                
            </CardFooter>
            </Card>
            <p className="mt-5 text-[#92929D]">Already have an account? <a href="/login" className="text-[#0062FF]">Login</a></p>
        </div>
    </div>
  )
}
