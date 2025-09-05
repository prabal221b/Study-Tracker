import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion"

import { Link, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

import { useParams } from "react-router-dom";
import Spin from '@/components/ui/Spin'
import Error from "../components/cards/Error";

import TechCard from "../components/cards/TechCard";
import { useAuth } from '../lib/useAuth';

const StudyPlans = () => {
  const planId  = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/get-roadmaps`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          setIsLoading(false);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setIsLoading(false);
        setData(result);
      } catch (error) {
        setIsLoading(false);
        setError(error);
      }
    };
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  if (isAuthenticated === undefined) {
    return <Spin />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (error) {
    const button = "";
    return <Error error="unable to process, Please try again." />
  }

  if (isLoading) {
    return <Spin />;
  }

  return (
    <motion.div 
    initial={{ opacity: 0}}
    animate={{ opacity: 1}}
    exit={{ opacity: 0}}
    transition={{ duration: 1.3}} className="min-h-screen">
    
    <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-8 text-center">
          {data.length != 0 ? "Select a Plan to Continue Learning" : "No Roadmaps found, Create one!"}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4  text-center">
          {data.map((tech) => (
            <Link key={tech.id} to={ROUTES.PLAN(tech.id)}>
              <TechCard key={tech.id} tech={tech} />
            </Link>
          ))}
        </div>
      </div>

    </motion.div>
  )
}

export default StudyPlans