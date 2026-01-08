import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Animated Background */}
      <div className="gradient-bg"></div>

      {/* Floating Shapes */}
      <div className="shape shape1"></div>
      <div className="shape shape2"></div>
      <div className="shape shape3"></div>

      {/* Hero Section */}
      <div className="hero-content">
        <h1>
          Smart <span>Interview</span> <br /> Management System
        </h1>
        <p>
          Schedule interviews, manage candidates, and streamline hiring with a
          modern role-based platform.
        </p>

        <div className="hero-buttons">
          <button className="primary-btn" onClick={() => navigate("/register")}>
            Get Started
          </button>
          <button className="secondary-btn" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="features">
        <div className="feature-card">
          📅 <h3>Smart Scheduling</h3>
          <p>HR can schedule interviews with full control.</p>
        </div>

        <div className="feature-card">
          👥 <h3>Role Based Access</h3>
          <p>HR, Interviewer, and Student dashboards.</p>
        </div>

        <div className="feature-card">
          📂 <h3>Resume Management</h3>
          <p>Secure resume uploads & access.</p>
        </div>

        <div className="feature-card">
          📊 <h3>Analytics</h3>
          <p>Track interviews and hiring insights.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
