import { LaserHero } from "@/components/ui/laser-focus-crypto-hero-section";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return <LaserHero />;
};

export default HomePage;
