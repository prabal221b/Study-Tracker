import { Outlet } from "react-router-dom";
import { Navbar01 } from '../../components/ui/shadcn-io/navbar-01'
export default function Navbar() {


  return (<div className="min-h-screen">
  < Navbar01 />
    <Outlet />
    </div>
  );
}
