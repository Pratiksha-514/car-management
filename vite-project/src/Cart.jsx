import { useNavigate } from "react-router-dom";

function Cart({ cart, removeFromCart, user }) {
  const navigate = useNavigate();

  if (user?.role === "ADMIN") {
    navigate("/dashboard");
    return null;
  }
  
  const totalPrice = cart.reduce((sum, car) => sum + Number(car.price), 0);

  if (cart.length === 0) {
    return (
      <div className="cart-container" style={{textAlign: 'center'}}>
        <h1 className="section-title">Your Cart is Empty</h1>
        <p style={{color: 'var(--text-muted)', marginBottom: '2rem'}}>
          Explore our collection and add your dream cars to the cart!
        </p>
        <button className="cta-button" onClick={() => navigate('/manage')}>
          GO TO COLLECTION
        </button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1 className="section-title">Shopping Cart</h1>
      
      <div className="cart-grid">
        <div className="cart-items">
          {cart.map((car) => (
            <div key={car.id} className="cart-item">
              <img 
                src={car.imageUrl && car.imageUrl.startsWith("http") 
                     ? car.imageUrl 
                     : `/images/${car.imageUrl || 'default.jpg'}`} 
                alt={car.name} 
                className="cart-item-img"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80";
                }}
              />
              <div className="cart-item-info">
                <h3>{car.name}</h3>
                <p style={{color: 'var(--text-muted)'}}>{car.brand}</p>
                <div className="cart-item-price">₹{Number(car.price).toLocaleString()}</div>
                <button className="remove-btn" onClick={() => removeFromCart(car.id)}>
                  Remove Item
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2 style={{marginBottom: '1.5rem'}}>Summary</h2>
          <div className="summary-row">
            <span>Subtotal ({cart.length} items)</span>
            <span>₹{totalPrice.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Taxes & Fees</span>
            <span>Included</span>
          </div>
          <div className="summary-row total-row">
            <span>Total</span>
            <span>₹{totalPrice.toLocaleString()}</span>
          </div>
          
          <button 
            className="cta-button" 
            style={{width: '100%', marginTop: '2rem', padding: '1.2rem'}}
            onClick={() => navigate('/booking', { state: { car: cart[0] } })}
          >
            PROCEED TO BOOKING
          </button>
          
          <p style={{textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem'}}>
            Secure Checkout Guaranteed 🔒
          </p>
        </div>
      </div>
    </div>
  );
}

export default Cart;
