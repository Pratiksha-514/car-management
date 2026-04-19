import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API_BASE_URL from "./apiConfig";

function Booking({ user }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Get car from location state
  const car = location.state?.car;
  const [bookingResult, setBookingResult] = useState(null);

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phoneNumber: "",
    address: "",
    preferredDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (!car) {
      alert("No car selected for booking ❌");
      navigate("/manage");
    }
  }, [car, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!car) return;

    // Simple validation
    if (!form.phoneNumber.match(/^\d{10}$/)) {
      alert("Please enter a valid 10-digit phone number 📱");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/bookings`, {

        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          carId: car.id,
          carName: car.name,
          carBrand: car.brand,
          price: car.price,
          date: new Date().toLocaleDateString() // System date
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setBookingResult(data);
      } else {
        const errorText = await res.text();
        alert(errorText || "Booking failed ❌");
      }
    } catch (error) {
      console.error(error);
      alert("Server error ❌");
    }
  };

  if (bookingResult) {
    return (
      <div className="container" style={{maxWidth: '600px'}}>
        <div className="form-card success-card">
          <div style={{fontSize: '4rem', marginBottom: '1rem'}}>🎉</div>
          <h1 className="section-title" style={{fontSize: '2rem', marginBottom: '1rem'}}>Booking Successful!</h1>
          <p style={{color: 'var(--text-muted)', marginBottom: '2rem'}}>
            Your request for the <strong>{car.brand} {car.name}</strong> has been received. 
            Our team will review your booking and contact you shortly.
          </p>
          <div style={{background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', textAlign: 'left'}}>
            <p><strong>Booking ID:</strong> #{bookingResult.id}</p>
            <p><strong>Status:</strong> <span className="status-badge pending">PENDING</span></p>
            <p><strong>Preferred Date:</strong> {bookingResult.preferredDate}</p>
          </div>
          <button className="submit-btn" onClick={() => navigate("/profile")}>VIEW MY BOOKINGS</button>
          <button className="nav-button" onClick={() => navigate("/")} style={{marginTop: '1rem', width: '100%'}}>GO TO HOME</button>
        </div>
      </div>
    );
  }

  if (!car) return null;

  return (
    <div className="container" style={{padding: '120px 2rem 5rem', maxWidth: '900px', margin: '0 auto'}}>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start'}}>
        
        {/* Car Details Summary */}
        <div className="form-card" style={{padding: '0', overflow: 'hidden'}}>
          <img 
            src={car.imageUrl && car.imageUrl.startsWith("http") ? car.imageUrl : `/images/${car.imageUrl || 'default.jpg'}`} 
            alt={car.name} 
            className="car-image" 
            style={{height: '250px'}}
          />
          <div style={{padding: '2rem'}}>
            <h2 style={{marginBottom: '0.5rem'}}>{car.brand} {car.name}</h2>
            <p style={{color: 'var(--accent)', fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem'}}>
              ₹{Number(car.price).toLocaleString()}
            </p>
            <div style={{color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6'}}>
              <p>✓ Premium Inspection Included</p>
              <p>✓ 1-Year Warranty Choice</p>
              <p>✓ Roadside Assistance</p>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <form className="form-card" onSubmit={handleSubmit}>
          <h2 style={{marginBottom: '2rem'}}>Confirm Booking</h2>
          
          <div className="input-group">
            <label>Full Name</label>
            <input
              className="input-field"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Contact Phone</label>
            <input
              className="input-field"
              name="phoneNumber"
              placeholder="10-digit number"
              value={form.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <input
              className="input-field"
              name="email"
              type="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Pickup / Delivery Address</label>
            <input
              className="input-field"
              name="address"
              placeholder="Full Address"
              value={form.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Preferred Booking Date</label>
            <input
              className="input-field"
              type="date"
              name="preferredDate"
              value={form.preferredDate}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="submit-btn" style={{marginTop: '1rem'}}>
            SECURE THIS VEHICLE
          </button>
          <button 
            type="button" 
            className="nav-button" 
            onClick={() => navigate("/manage")}
            style={{width: '100%', marginTop: '1rem', fontSize: '0.8rem'}}
          >
            BACK TO COLLECTION
          </button>
        </form>
      </div>
    </div>
  );
}

export default Booking;
