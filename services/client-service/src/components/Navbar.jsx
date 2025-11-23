import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-3 flex justify-between">
      <span className="font-bold text-lg">BackStack</span>
      <div className="space-x-4">
        <Link to="/dashboard" className="hover:underline">
          Dashboard
        </Link>
        {/* <Link to="/projects" className="hover:underline">
          Projects
        </Link> */}
        <Link to="/schemas" className="hover:underline">
          Schemas
        </Link>
        <Link to="/apis" className="hover:underline">
          APIs
        </Link>
        <Link to="/billing" className="hover:underline">
          Billing
        </Link>
        <Link to="/docs" className="hover:underline">
          Docs
        </Link>
        <Link to="/project" className="hover:underline">
          Project
        </Link> 
      </div>
    </nav>
  );
}
