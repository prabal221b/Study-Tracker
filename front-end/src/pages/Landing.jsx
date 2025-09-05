import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { IconCloud } from "../components/magicui/icon-cloud";
import { motion } from "framer-motion"

const slugs = [
  "typescript",
  "javascript",
  "dart",
  "java",
  "react",
  "flutter",
  "android",
  "html5",
  "css3",
  "nodedotjs",
  "express",
  "nextdotjs",
  "prisma",
  "amazonaws",
  "postgresql",
  "firebase",
  "nginx",
  "vercel",
  "testinglibrary",
  "jest",
  "cypress",
  "docker",
  "git",
  "jira",
  "github",
  "gitlab",
  "visualstudiocode",
  "androidstudio",
  "sonarqube",
  "figma",
];

export default function Landing() {
  const navigate = useNavigate();

  const images = slugs.map(
    (slug) => `https://cdn.simpleicons.org/${slug}/${slug}`,
  );
  return (
  <motion.div 
    initial={{ opacity: 0}}
    animate={{ opacity: 1}}
    exit={{ opacity: 0}}
    transition={{ duration: 1.3}} className="min-h-screen">
    
    <div className="flex flex-col justify-center items-center">
      <div className="w-80 overflow-hidden flex items-center">
        <img
          src="/logo-text.png"
          alt="StudyTracker Logo"
          className="object-contain"
        />
      </div>
      
      <div className="mt-[-180px]">
        <IconCloud images={images} />
      </div>

      <div className="text-center mt-[-40px]">
        
        <h1 className="text-4xl text-gray-400">Plan, track and achieve your learning goals with ease.</h1>
        <Button
          className="mt-10 w-40 h-15 rounded-2xl bg-[#ef8733] hover:bg-[#ef8733]/80"
          onClick={() => navigate("/auth")}
        >
          Get Started
        </Button>
      </div>
    </div>
    </motion.div>
  );
}
