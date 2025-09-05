"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Spin from '@/components/ui/Spin'
import { ROUTES } from "@/constants/routes"
import React, { useEffect, useState } from 'react';
import { GeneratePlanSchema } from "@/lib/validations"
import { toast } from "sonner"
import { ReloadIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"



export function StudyPlanForm({techName}) {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(GeneratePlanSchema),
        defaultValues: {
            courseTitle: techName || "",
            dailyHrs: "1",
            totalHrs: "20",
        },
    })

    const onSubmit = async (data) => {
        const difficulty = data.totalHrs === "20" ? "Beginner" : data.totalHrs === "40" ? "Intermediate" : "Advanced";
            const formattedData = {
                ...data,
                difficulty
            };
        setIsLoading(true);
        try {
            const response = await fetch('https://devoverflow-steel.vercel.app/api/ai', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(formattedData)
            });
      
            if (!response.ok) {
              setIsLoading(false);
              throw new Error(`HTTP error! status: ${response.status}`);
            }
      
            const result = await response.json();
            const data = JSON.parse(result.data);
            setIsLoading(false);
            navigate(ROUTES.PREVIEW(techName), { state: data })
          } catch (error) {
            setIsLoading(false);
            setError(error);
          }
    }

    useEffect(() => {
        if (error) {
            toast.error("Something went wrong, please try again!");
        }
    }, [error]);
    
    useEffect(() => {
        if (isLoading) {
          toast.success("Generating your plans, please wait!");
          <Spin />
        }
      }, [isLoading]);
    
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="courseTitle"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Technology</FormLabel>
                            <FormControl>
                                <Input placeholder="" {...field} readOnly />
                            </FormControl>
                            <FormDescription>
                                The programming language, framework, or technology you want to master.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>            
                    )}
                />
                <FormField
                    control={form.control}
                    name="dailyHrs"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Daily Hours</FormLabel>
                            <FormControl>
                                <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select hours" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: 8 }, (_, i) => i + 1).map((hour) => (
                                    <SelectItem key={hour} value={hour.toString()}>
                                        {hour}
                                    </SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                            </FormControl>
                            <FormDescription>
                                How many hours per day can you dedicate to learning this technology?
                            </FormDescription>
                            <FormMessage />
                        </FormItem>            
                    )}
                />
                <FormField
                    control={form.control}
                    name="totalHrs"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Target Expertise Level</FormLabel>
                        <FormControl>
                            <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            >
                            <SelectTrigger>
                                <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="20">Beginner</SelectItem>
                                <SelectItem value="40">Intermediate</SelectItem>
                                <SelectItem value="60">Advanced</SelectItem>
                            </SelectContent>
                            </Select>
                        </FormControl>
                        <FormDescription>
                            What level of proficiency do you want to reach?
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                
                <Button type="submit">{isLoading ? 
                <>
                <ReloadIcon className="size-4 animate-spin" />
                Generating...
                </> : "Generate"  
                }
            </Button>
            </form>
        </Form>
    )
}