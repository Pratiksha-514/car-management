import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role === "ADMIN") {
      navigate("/dashboard");
      return;
    }

    fetch(`http://localhost:8082/bookings/user/${user.email}`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setLoading(false);
      });
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="user-avatar">
          {user.email ? user.email.charAt(0).toUpperCase() : "U"}
        </div>
        <h1 style={{fontFamily: 'var(--font-heading)', fontSize: '1.8rem', marginBottom: '0.3rem'}}>
          Welcome, {user.name || user.email.split('@')[0]}
        </h1>
        <p style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>Exclusive Member since 2024</p>
        
        <div className="user-info-grid">
          <div className="info-box">
            <h4>Email Address</h4>
            <p>{user.email}</p>
          </div>
          <div className="info-box">
            <h4>Account Tier</h4>
            <p>
              <span className={`role-badge ${user.role.toLowerCase()}`}>
                {user.role === "ADMIN" ? "Executive" : "Standard"}
              </span>
            </p>
          </div>
          <div className="info-box">
            <h4>Total Bookings</h4>
            <p>{orders.length}</p>
          </div>
        </div>
      </div>

      <div className="orders-section">
        <h2 style={{fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '1.5rem'}}>
          Booking History
        </h2>

        {loading ? (
          <div className="loading">Fetching your bookings...</div>
        ) : orders.length === 0 ? (
          <div style={{textAlign: 'center', padding: '3rem'}}>
            <p style={{color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '1rem'}}>
              You haven't made any reservations yet.
            </p>
            <button className="cta-button" onClick={() => navigate('/manage')}>
              EXPLORE COLLECTION
            </button>
          </div>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Vehicle</th>
                <th>Amount</th>
                <th>Preferred Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>
                    <strong>{order.carBrand} {order.carName}</strong>
                  </td>
                  <td style={{color: 'var(--accent)', fontWeight: '700'}}>
                    ₹{Number(order.price).toLocaleString()}
                  </td>
                  <td>{order.preferredDate || order.date}</td>
                  <td>
                    <span className={`status-badge ${(order.status || 'PENDING').toLowerCase()}`}>
                      {order.status || 'PENDING'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Profile;
