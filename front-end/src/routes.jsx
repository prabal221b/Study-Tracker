import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import PlanForm from "./pages/PlanForm";
import StudyPlans from "./pages/StudyPlans";
import PlanPreview from "./pages/PlanPreview"
import SavedPlanDetail from "./pages/SavedPlanDetail"
import Auth from "./pages/Auth";
import Logout from "./pages/Logout";
import Navbar from "./components/navigation/Navbar";

export default function AppRoutes() {
  return ( 
    <Router>
      <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/" element={<Landing />} /> 
      <Route path="/logout" element={<Logout />} />
      <Route element={<Navbar />}>
               
          <Route path="/home" element={<Home />} />
          <Route path="/plan/:tech" element={<PlanForm />} />
          <Route path="/myplans" element={<StudyPlans />} />
          <Route path="/plan/:tech/preview" element={<PlanPreview />} />
          <Route path="/myplans/:techName" element={<SavedPlanDetail />} />
        </Route>
      </Routes>
    </Router>
  );
}
