import { motion } from "framer-motion"

import Roadmap from '../components/cards/RoadMap';
import Spin from '@/components/ui/Spin'
import { Button } from '@/components/ui/Button'
import { toast } from "sonner";
import { ROUTES } from "../constants/routes";
import { useNavigate, useParams, Navigate } from "react-router-dom";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useAuth } from "../lib/useAuth";
import React, { useEffect, useState } from 'react';
import Error from "../components/cards/Error";

const SavedPlanDetail = () => {

  const planId  = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/roadmap/${planId.techName}`, {
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
    return <Error error="unable to process, Please try again." />
  }

  if (isLoading) {
    return <Spin />;
  }

  const handleDelete = async (planId) => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/delete-roadmap/${planId}`, {
          method: 'DELETE',
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
        toast("Roadmap delete Succesfully");
        navigate(ROUTES.MYPLANS);
      } catch (error) {
        setIsLoading(false);
        setError(error);
      }
  }

  return (
    <motion.div 
        initial={{ opacity: 0}}
        animate={{ opacity: 1}}
        exit={{ opacity: 0}}
        transition={{ duration: 1.3}}>
        <div className="max-w-6xl mx-auto px-6 py-12 flex justify-center">
          <Roadmap roadmap={data.roadmap} techName={data.technology_name} />
        </div>

        <div className="text-center w-full">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="w-40 min-h-[46px] rounded-2xl bg-[#ef8733] hover:bg-[#ef8733]/80">
              Delete Plan
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. Do you want to delete this plan?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleDelete(planId.techName)}>
                Confirm Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        </div>
    </motion.div>
  )
}

export default SavedPlanDetail