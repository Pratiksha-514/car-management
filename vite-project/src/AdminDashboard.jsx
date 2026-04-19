import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "./apiConfig";

function AdminDashboard({ cars, fetchCars, deleteCar, editCar }) {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("bookings"); // "bookings" or "inventory"

  const fetchBookings = () => {
    fetch(`${API_BASE_URL}/bookings`)
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch(err => console.error("Error fetching bookings:", err));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateBookingStatus = (id, status) => {
    fetch(`${API_BASE_URL}/bookings/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(status),
    }).then(() => {
      fetchBookings();
      fetchCars();
    });
  };

  const toggleAvailability = (carId) => {
    fetch(`${API_BASE_URL}/cars/${carId}/availability`, {
      method: "PATCH",
    }).then(() => fetchCars());
  };

  const deleteBooking = (id) => {
    fetch(`${API_BASE_URL}/bookings/${id}`, {
      method: "DELETE",
    }).then(() => {
      fetchBookings();
      fetchCars();
    });
  };

  const totalRevenue = bookings
    .filter(b => b.status === "ACCEPTED")
    .reduce((sum, b) => sum + (Number(b.price) || 0), 0);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <h2 className="sidebar-title">VELOCE ADMIN</h2>
        <nav className="sidebar-nav">
          <button 
            className={`sidebar-link ${activeTab === "bookings" ? 'active' : ''}`}
            onClick={() => setActiveTab("bookings")}
          >
            📋 Booking Requests
          </button>
          <button 
            className={`sidebar-link ${activeTab === "inventory" ? 'active' : ''}`}
            onClick={() => setActiveTab("inventory")}
          >
            🏎️ Garage Status
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">
        <div className="dashboard-header">
          <h1>{activeTab === "bookings" ? "Manage Requests" : "Inventory Overview"}</h1>
          <div className="stats-mini">
            <span>Total Revenue: <strong>₹{totalRevenue.toLocaleString()}</strong></span>
            <span>Pending: <strong>{bookings.filter(b => b.status === "PENDING").length}</strong></span>
          </div>
        </div>

        {activeTab === "bookings" ? (
          <section className="dashboard-section">
            <div className="form-card" style={{padding: '0', overflow: 'hidden'}}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Vehicle</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>#{booking.id}</td>
                      <td>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                          <strong>{booking.name}</strong>
                          <span style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>{booking.phoneNumber}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                          <strong>{booking.carBrand} {booking.carName}</strong>
                          <span style={{fontSize: '0.75rem', color: 'var(--accent)'}}>₹{Number(booking.price).toLocaleString()}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${(booking.status || "PENDING").toLowerCase()}`}>
                          {booking.status || "PENDING"}
                        </span>
                      </td>
                      <td>{booking.preferredDate}</td>
                      <td className="table-actions">
                        {booking.status === "REJECTED" ? (
                          <button 
                            className="btn-reject" 
                            onClick={() => deleteBooking(booking.id)}
                          >🗑️ Remove</button>
                        ) : (
                          <>
                            <button 
                              className="btn-approve" 
                              onClick={() => updateBookingStatus(booking.id, "ACCEPTED")}
                              disabled={booking.status === "ACCEPTED"}
                            >✅</button>
                            <button 
                              className="btn-reject" 
                              onClick={() => updateBookingStatus(booking.id, "REJECTED")}
                            >❌</button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          <section className="dashboard-section">
            <div className="inventory-header">
              <h3>Garage Overview</h3>
            </div>
            <div className="admin-cars-grid">
              {cars.map(car => (
                <div key={car.id} className="admin-car-item">
                  <div className="car-tag" style={{background: car.available ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: car.available ? '#22c55e' : '#ef4444'}}>
                    {car.available ? 'AVAILABLE' : 'RESERVED'}
                  </div>
                  <h4>{car.brand} {car.name}</h4>
                  <p>₹{Number(car.price).toLocaleString()}</p>
                  <div className="admin-actions">
                    <button 
                      onClick={() => toggleAvailability(car.id)}
                      style={{background: car.available ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)', color: car.available ? '#ef4444' : '#22c55e', border: 'none'}}
                    >
                      {car.available ? 'Mark Reserved' : 'Mark Available'}
                    </button>
                    <button onClick={() => { editCar(car); navigate('/manage'); }}>Edit Details</button>
                    <button onClick={() => deleteCar(car.id)} style={{color: '#ff6b6b'}}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
