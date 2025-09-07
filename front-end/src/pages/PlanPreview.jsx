import { motion } from "framer-motion"

import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { Button } from "../components/ui/button";

import Roadmap from '../components/cards/RoadMap';
import Spin from '@/components/ui/Spin'
import { ROUTES } from "../constants/routes";
import { toast } from "sonner";

import React, { useEffect, useState } from 'react';
import Error from "../components/cards/Error";
import { useAuth } from "../lib/useAuth";


const PlanPreview = () => {
  
  const navigate = useNavigate();
  const { state } = useLocation();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  if (isAuthenticated === undefined) {
    return <Spin />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  const handleSave = async (data) => {
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/save-roadmap', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
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
      const courseId = result.course_mongo_id;
      navigate(ROUTES.PLAN(courseId));
    } catch (error) {
      setIsLoading(false);
      setError(error);
    }
  }
  
  const cancel = () => {
    navigate(ROUTES.HOME);
  }

  return (
    <motion.div 
        initial={{ opacity: 0}}
        animate={{ opacity: 1}}
        exit={{ opacity: 0}}
        transition={{ duration: 1.3}}>
        <div className="max-w-6xl mx-auto px-6 py-12 flex justify-center">
          <Roadmap roadmap={state.roadmap} techName={state.technology_name} />
          
        </div>
        <div className="flex justify-center gap-2">
        <Button className="w-40 min-h-[46px] rounded-2xl bg-[#ef8733] hover:bg-[#ef8733]/80" onClick={() => handleSave(state)}>
            Save Plan
        </Button>
        
        <Button className="w-40 min-h-[46px] rounded-2xl bg-[#ef8733] hover:bg-[#ef8733]/80" onClick={cancel}>
            Cancel
          </Button>
        </div>
    
    </motion.div>
  )
}

export default PlanPreview