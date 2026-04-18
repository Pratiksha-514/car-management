import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "USER", // Default role
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8082/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert("Registration Successful! Please login. 🎉");
        navigate("/login");
      } else {
        const errorMsg = await res.text();
        alert(errorMsg || "Registration failed ❌");
      }
    } catch (error) {
      console.error(error);
      alert("Server error ❌");
    }
  };

  return (
    <div className="container" style={{maxWidth: '450px', margin: '0 auto', paddingTop: '150px'}}>
      <div style={{textAlign: 'center', marginBottom: '2.5rem'}}>
        <h1 className="hero-title" style={{fontSize: '2rem', marginBottom: '0.5rem'}}>Join the Elite.</h1>
        <p style={{color: 'var(--text-muted)'}}>Access the world's most exclusive automotive collection.</p>
      </div>

      <div className="form-card">
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label>Email Address</label>
            <input 
              className="input-field"
              name="email" 
              type="email"
              placeholder="example@veloce.com" 
              onChange={handleChange} 
              required
              autoFocus
            />
          </div>
          
          <div className="input-group">
            <label>Create Password</label>
            <input 
              className="input-field"
              name="password" 
              type="password"
              placeholder="••••••••" 
              onChange={handleChange} 
              required
            />
          </div>


          <button type="submit" className="submit-btn" style={{marginTop: '1rem'}}>
            INITIALIZE MEMBERSHIP
          </button>
        </form>
        
        <div style={{textAlign: 'center', marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem'}}>
          <p style={{color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem'}}>
            Already a member?
          </p>
          <button 
            className="nav-button" 
            onClick={() => navigate('/login')}
            style={{fontSize: '0.75rem', letterSpacing: '2px', color: 'var(--accent)'}}
          >
            AUTHENTICATE LOGIN
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
