import TechCard from "../components/cards/TechCard";
import { TECHNOLOGIES } from "../constants/technologies"
import { motion } from "framer-motion"
import { Link, Navigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { useAuth } from "../lib/useAuth";
import Spin from '@/components/ui/Spin'


export default function Home() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === undefined) {
    return <Spin />
  }  

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (<motion.div 
    initial={{ opacity: 0}}
    animate={{ opacity: 1}}
    exit={{ opacity: 0}}
    transition={{ duration: 1.3}} className="min-h-screen">

      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Choose a technology to start learning
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 text-center">
          {TECHNOLOGIES.map((tech) => (
            <Link key={tech.technology_name} to={ROUTES.PLANFORM(tech.technology_name)}>
              <TechCard tech={tech} />
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
