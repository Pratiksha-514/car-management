import { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import "./App.css";
import Booking from "./Booking";
import Login from "./Login";
import Register from "./Register";
import AdminDashboard from "./AdminDashboard";
import Cart from "./Cart";
import Profile from "./Profile";

function App() {
  const navigate = useNavigate();
  // Persistent State
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null);
  const [cart, setCart] = useState([]);
  
  const isAdmin = user?.role === "ADMIN";

  const [cars, setCars] = useState([]);
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setCart([]); // Clear cart in state explicitly on logout
    navigate("/");
  };

  // Load user's cart on login
  useEffect(() => {
    if (user) {
      const savedCart = JSON.parse(localStorage.getItem(`cart_${user.email}`)) || [];
      setCart(savedCart);
    } else {
      setCart([]);
    }
  }, [user]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`cart_${user.email}`, JSON.stringify(cart));
    }
  }, [cart, user]);

  // Fetch cars
  const fetchCars = () => {
    fetch("http://localhost:8082/cars")
      .then((res) => res.json())
      .then((data) => setCars(data))
      .catch(err => console.error("Error fetching cars:", err));
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAdmin) return;

    const url = editId
      ? `http://localhost:8082/cars/${editId}`
      : "http://localhost:8082/cars";

    const method = editId ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        brand,
        price,
        imageUrl,
      }),
    }).then(() => {
      resetForm();
      fetchCars();
    });
  };

  const deleteCar = (id) => {
    if (!isAdmin) return;
    fetch(`http://localhost:8082/cars/${id}`, {
      method: "DELETE",
    }).then(() => fetchCars());
  };

  const editCar = (car) => {
    if (!isAdmin) return;
    setName(car.name);
    setBrand(car.brand);
    setPrice(car.price);
    setImageUrl(car.imageUrl || "");
    setEditId(car.id);
  };

  const resetForm = () => {
    setName("");
    setBrand("");
    setPrice("");
    setImageUrl("");
    setEditId(null);
  };

  const addToCart = (car) => {
    if (cart.find(c => c.id === car.id)) {
      alert("This vehicle is already in your cart! 🚗");
      return;
    }
    setCart([...cart, car]);
    alert(`${car.name} added to cart! 🛒`);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(c => c.id !== id));
  };

  const filteredCars = cars.filter(
    (car) =>
      car.name.toLowerCase().includes(search.toLowerCase()) ||
      car.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`app-container ${isAdmin ? 'admin-mode' : ''}`}>
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-logo" onClick={() => navigate("/")}>VELOCE MOTORING</div>
        <div className="nav-links">
          <Link to="/" className="nav-button">HOME</Link>
          <Link to="/manage" className="nav-button">COLLECTION</Link>
          <Link to="/about" className="nav-button">ABOUT</Link>
          
          {user ? (
            <>
              {isAdmin && <Link to="/dashboard" className="nav-button dashboard-highlight">DASHBOARD</Link>}
              {!isAdmin && (
                <>
                  <Link to="/cart" className="nav-button cart-link">
                    CART <span className="cart-badge">{cart.length}</span>
                  </Link>
                  <Link to="/profile" className="nav-button">PROFILE</Link>
                </>
              )}
              <button onClick={handleLogout} className="nav-button logout-btn">LOGOUT</button>
            </>
          ) : (
            <>
              <Link to="/register" className="nav-button">REGISTER</Link>
              <Link to="/login" className="nav-button">LOGIN</Link>
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={
          <section className="hero">
            <div className="hero-background"></div>
            <div className="hero-content">
              <p style={{color: 'var(--accent)', fontSize: '0.8rem', letterSpacing: '4px', fontWeight: '600', marginBottom: '1.5rem', textTransform: 'uppercase'}}>
                VELOCE MOTORING — EST. 2024
              </p>
              <h1 className="hero-title">The Art of<br/>Automotive Excellence.</h1>
              <p className="hero-subtitle">
                Discover a curated selection of the world's most extraordinary vehicles. 
                Every machine in our collection tells a story of engineering mastery and timeless design.
              </p>
              <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
                <button className="cta-button" onClick={() => navigate('/manage')}>
                  EXPLORE COLLECTION
                </button>
                <button 
                  className="cta-button" 
                  style={{background: 'transparent', color: 'var(--accent)', border: '1px solid var(--accent)'}}
                  onClick={() => navigate('/about')}
                >
                  OUR HERITAGE
                </button>
              </div>
            </div>
          </section>
        } />

        <Route path="/about" element={
          <section className="about-section">
            <div className="about-grid">
              <div>
                <h1 className="section-title" style={{textAlign: 'left', marginBottom: '1.5rem'}}>Our Heritage.</h1>
                <p style={{fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '2rem'}}>
                  Founded in 2024, VELOCE MOTORING was born out of a singular passion for the most extraordinary 
                  machines ever engineered. We don't just sell cars; we curate automotive masterpieces.
                </p>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem'}}>
                  <div>
                    <h4 style={{color: 'var(--accent)', marginBottom: '0.5rem'}}>Mastery</h4>
                    <p style={{fontSize: '0.9rem', color: 'var(--text-muted)'}}>Every vehicle undergoes a 200-point inspection by factory-trained technicians.</p>
                  </div>
                  <div>
                    <h4 style={{color: 'var(--accent)', marginBottom: '0.5rem'}}>Legacy</h4>
                    <p style={{fontSize: '0.9rem', color: 'var(--text-muted)'}}>Exclusive access to limited-edition releases and heritage collections.</p>
                  </div>
                </div>
              </div>
              <div style={{position: 'relative'}}>
                <img 
                  src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80" 
                  alt="Premium Car" 
                  style={{width: '100%', borderRadius: '20px', boxShadow: 'var(--shadow)'}}
                />
                <div style={{
                  position: 'absolute', 
                  bottom: '-20px', 
                  right: '-20px', 
                  background: 'var(--accent)', 
                  color: '#000', 
                  padding: '2rem', 
                  borderRadius: '16px',
                  fontWeight: '800'
                }}>
                  EST. 2024
                </div>
              </div>
            </div>
          </section>
        } />
        
        <Route path="/manage" element={
          <div className="container">
            <h1 className="section-title">{isAdmin ? 'Manage Inventory' : 'Our Collection'}</h1>
            <div className="search-container">
              <input
                className="search-input"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className={isAdmin ? "manage-grid" : "collection-view"}>
              {isAdmin && (
                <div className="form-column">
                  {/* ... Existing Inventory Form ... */}
                  <form className="form-card" onSubmit={handleSubmit}>
                    <h2>{editId ? "Update Entry" : "Add New Vehicle"}</h2>
                    <input className="input-field" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                    <input className="input-field" placeholder="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} required />
                    <input className="input-field" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
                    <input className="input-field" placeholder="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                    <button type="submit" className="submit-btn">{editId ? "UPDATE" : "ADD VEHICLE"}</button>
                    <button type="button" className="submit-btn" style={{background: 'transparent', color: 'var(--accent)', border: '1px solid var(--accent)'}} onClick={() => navigate('/dashboard')}>VIEW DASHBOARD</button>
                  </form>
                </div>
              )}
              <div className="cars-list">
                {filteredCars.map((car) => (
                  <div key={car.id} className="car-card">
                    {/* ... Existing Car Card ... */}
                    <img src={car.imageUrl && car.imageUrl.startsWith("http") ? car.imageUrl : `/images/${car.imageUrl || 'default.jpg'}`} alt={car.name} className="car-image" />
                    <div className="car-info">
                      <h3>{car.name}</h3>
                      <p>{car.brand}</p>
                      <span className="car-price">₹{Number(car.price).toLocaleString()}</span>
                      <div style={{marginBottom: '1rem'}}>
                        <span className={`status-badge ${car.available ? 'accepted' : 'rejected'}`}>
                          {car.available ? 'Available' : 'Sold Out'}
                        </span>
                      </div>
                      <div className="action-btns">
                        {isAdmin ? (
                          <>
                            <button onClick={() => editCar(car)}>✏️</button>
                            <button onClick={() => deleteCar(car.id)}>🗑️</button>
                          </>
                        ) : (
                          <>
                            <button className="btn-cart" onClick={() => addToCart(car)}>CART 🛍️</button>
                            <button 
                              className={`btn-book ${!car.available ? 'btn-disabled' : ''}`}
                              onClick={() => car.available && navigate('/booking', { state: { car } })}
                              disabled={!car.available}
                            >
                              {car.available ? 'BOOK NOW' : 'NOT AVAILABLE'}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        } />

        <Route path="/booking" element={<Booking user={user} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} user={user} />} />
        <Route path="/profile" element={<Profile user={user} />} />
        <Route path="/dashboard" element={
          isAdmin ? (
            <AdminDashboard cars={cars} fetchCars={fetchCars} deleteCar={deleteCar} editCar={editCar} />
          ) : (
            <Login setUser={setUser} />
          )
        } />
      </Routes>
    </div>
  );
}

export default App;