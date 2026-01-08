import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-slate-900 via-blue-900 to-teal-700 text-white p-12 flex-col justify-between">
        <div>
          <br /><br></br>

          <h2 className="text-4xl font-bold mb-4">Welcome Back</h2>
          <p className="text-slate-200 max-w-md">
            Sign in to access your dashboard and continue managing your
            recruitment process.
          </p>
        </div>

        <div className="space-y-4">
          {[
            ["HR Dashboard", "Manage jobs and interviews"],
            ["Interviewer Portal", "Conduct evaluations"],
            ["Candidate Portal", "Apply and track status"],
          ].map(([title, desc]) => (
            <div
              key={title}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-4"
            >
              <h4 className="font-semibold">{title}</h4>
              <p className="text-sm text-slate-200">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-2">Sign In</h2>
          <p className="text-center text-gray-500 mb-6">
            Access your InterviewHub account
          </p>

          {error && (
            <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-teal-400 outline-none"
            />

            <input
              type="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-teal-400 outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg font-semibold transition"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don’t have an account?{" "}
            <Link to="/register" className="text-teal-600 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
