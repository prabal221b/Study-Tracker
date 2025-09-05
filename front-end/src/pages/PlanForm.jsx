import React from 'react'
import { motion } from "framer-motion"
import { StudyPlanForm } from "@/components/forms/StudyPlanForm"
import { useParams } from "react-router-dom"
import { Card } from '../components/ui/card'
import { useAuth } from '../lib/useAuth'
import { Navigate } from 'react-router-dom'
import Spin from '@/components/ui/Spin'

const PlanForm = () => {

  const { isAuthenticated } = useAuth();
  const techName  = useParams()
  
  if (isAuthenticated === undefined) {
    return <Spin />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  return (
    <motion.div 
    initial={{ opacity: 0}}
    animate={{ opacity: 1}}
    exit={{ opacity: 0}}
    transition={{ duration: 1.3}} className="flex items-center justify-center">
      
      <div className="w-full max-w-md mt-[5%]">
        <h1 className='text-center text-5xl font-bold mb-[5%]'>Generate your Roadmap</h1>
        <Card className='p-6'>
          <StudyPlanForm key={techName.tech} techName={techName.tech}/>
        </Card>
      </div>
    </motion.div>
  )
}

export default PlanForm