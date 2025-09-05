import {
  Card,
  CardDescription,
  CardTitle,
} from "../components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs"

import { SignInForm } from "../components/forms/SigninForm"
import { SignUpForm } from "../components/forms/SignupForm"
import { useAuth } from "../lib/useAuth"
import { motion } from "framer-motion"
import { Navigate } from "react-router-dom"
import Spin from '@/components/ui/Spin'

export default function Auth() {

  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated === undefined) {
    return <Spin />;
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return (
    <motion.div 
        initial={{ opacity: 0}}
        animate={{ opacity: 1}}
        exit={{ opacity: 0}}
        transition={{ duration: 1.3}}>
    <div className="min-h-screen flex flex-col justify-center items-center text-white">
        <img src="logo.png" className="h-25 w-25" />
        <div className="flex w-full max-w-sm flex-col gap-6">
        <Tabs defaultValue="Sign In">
            <TabsList>
            <TabsTrigger value="Sign Up">Sign Up</TabsTrigger>
            <TabsTrigger value="Sign In">Sign In</TabsTrigger>
            </TabsList>
            <TabsContent value="Sign Up">
                <Card className="p-5">
                        <CardTitle>Sign Up</CardTitle>
                        <CardDescription>
                            Sign up to join our community. Please fill out the form below to create your account.
                        </CardDescription>
                    <SignUpForm />
                </Card>
            </TabsContent>
            <TabsContent value="Sign In">
                <Card className="p-5">
                        <CardTitle>Sign In</CardTitle>
                        <CardDescription>
                            Welcome back! Please enter your username and password to sign in to your account.
                        </CardDescription>
                    <SignInForm />
                </Card>
            </TabsContent>
        </Tabs>
        </div>
    </div>
    </motion.div>
  )
}