import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setUser }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:8082/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (res.status === 500) {
        alert("Server Error: Database issue (possibly duplicate emails). ❌");
        return;
      }

      if (!res.ok) {
        alert("Invalid credentials ❌");
        return;
      }

      const user = await res.json();

      if (user) {
        alert(`${user.role} Login Successful 🎉`);
        setUser(user);
        if (user.role === "ADMIN") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      } else {
        alert("Invalid credentials ❌");
      }
    } catch (error) {
      console.error(error);
      alert("Server error ❌");
    }
  };

  return (
    <div className="container" style={{maxWidth: '450px', margin: '0 auto', paddingTop: '150px'}}>
      <div style={{textAlign: 'center', marginBottom: '2.5rem'}}>
        <h1 className="hero-title" style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>Welcome Back.</h1>
        <p style={{color: 'var(--text-muted)'}}>Enter your credentials to access your garage.</p>
      </div>

      <div className="form-card">
        <div className="input-group">
          <label>Email Address</label>
          <input 
            className="input-field"
            name="email" 
            type="email"
            placeholder="admin@gmail.com" 
            onChange={handleChange} 
            required
            autoFocus
          />
        </div>
        
        <div className="input-group">
          <label>Password</label>
          <input 
            className="input-field"
            name="password" 
            type="password"
            placeholder="••••••••" 
            onChange={handleChange} 
            required
          />
        </div>

        <button className="submit-btn" style={{marginTop: '1rem'}} onClick={handleLogin}>
          Authorize Login
        </button>
        
        <div style={{textAlign: 'center', marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem'}}>
          <p style={{color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem'}}>
            Don't have access?
          </p>
          <button 
            className="nav-button" 
            onClick={() => navigate('/register')}
            style={{fontSize: '0.75rem', letterSpacing: '2px', color: 'var(--accent)'}}
          >
            CREATE AN ACCOUNT
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
