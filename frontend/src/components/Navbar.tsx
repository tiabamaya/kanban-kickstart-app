import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogIn, User } from "lucide-react";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get<{ username: string }>("/auth/user/", { withCredentials: true });
        setCurrentUser(response.data);
      } catch {
        setCurrentUser(null); // Not logged in
      }
    };

    fetchCurrentUser();
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");
      navigate("/login");  // ✅ use React Router navigation (SPA-safe)
    } catch (error) {
      console.error(error);
    }
  };



  return (
    <header className="border-b p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Kanban Board</h1>
          <p className="text-muted-foreground">Track your tasks with priority and deadlines</p>
        </div>
        <div className="flex items-center gap-2">
{currentUser ? (
  <div className="flex items-center gap-4">
    <div className="flex items-center gap-2">
      <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center">
        <User size={16} />
      </div>
      <span>{currentUser.username}</span>  
    </div>
    <Button variant="outline" size="sm" onClick={handleLogout}>
      Logout
    </Button>
  </div>
) : (
  <Button size="sm" onClick={() => (window.location.href = "/accounts/github/login")}>
    <LogIn className="mr-2 h-4 w-4" />
    Login
  </Button>
)}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
