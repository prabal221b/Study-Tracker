"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import React, { useState, useEffect } from 'react';
import { ROUTES } from "@/constants/routes"
import Error from "@/components/cards/Error";
import { toast } from "sonner";

import { SignInSchema } from "@/lib/validations"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"



export function SignInForm() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(SignInSchema),
        defaultValues: {
            username:  "",
            password: "",
        },
    })

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:8000/api/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data)
            });
      
            if (!response.ok) {
              setIsLoading(false);
              throw new Error(`HTTP error! status: ${response.status}`);
            }
      
            const result = await response.json();
            setIsLoading(false);
            toast.success("Signed in Successfully!")
            sessionStorage.setItem('accessToken', result.access);
            form.reset();
            navigate(ROUTES.HOME);
          } catch (error) {
            setIsLoading(false);
            setError(error);
          }
    }
    useEffect(() => {
        if (error) {
          toast.error("Invalid credentials, please try again!");
        }
      }, [error]);
    
      useEffect(() => {
        if (isLoading) {
          toast.success("Please wait while we sign you in!");
        }
      }, [isLoading]);
    
    return (<div>
        
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="Username" {...field} required/>
                            </FormControl>
                            {/* <FormDescription>
                                Enter your Username.
                            </FormDescription> */}
                            <FormMessage />
                        </FormItem>            
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="Password" {...field} type="password" required/>
                            </FormControl>
                            {/* <FormDescription>
                                Enter your Password.
                            </FormDescription> */}
                            <FormMessage />
                        </FormItem>            
                    )}
                />
                <Button type="submit">Sign in</Button>
            </form>
        </Form>

        {error && (
      <div className="text-center text-red-600 mt-4">
        Invalid credentials, please try again!
      </div>
    )}
        </div>
    )
}