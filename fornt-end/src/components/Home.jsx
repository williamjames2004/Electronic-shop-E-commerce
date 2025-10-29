import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Home.css'; 
import Header from "./Header";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [mobiles, setMobiles] = useState([]);
  const [laptops, setLaptops] = useState([]);
  const [gadgets, setGadgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null); // new

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        navigate("/login");
        return;
      }

      try {
        const userRes = await axios.get(`http://localhost:5000/backend/getdata/${userId}`);
        setUser({ fullname: userRes.data.username });

        const [mobilesRes, laptopsRes, gadgetsRes] = await Promise.all([
          axios.get("http://localhost:5000/backend/mobiles"),
          axios.get("http://localhost:5000/backend/laptops"),
          axios.get("http://localhost:5000/backend/gadgets"),
        ]);

        setMobiles(mobilesRes.data.data);
        setLaptops(laptopsRes.data.data);
        setGadgets(gadgetsRes.data.data);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleProductClick = (item) => {
    setSelectedProduct(item);
  };

  const closeProductDetail = () => {
    setSelectedProduct(null);
  };

  const renderItem = (item) => (
    <div className="product-card" key={item._id} onClick={() => handleProductClick(item)}>
      <img
        src={item.image ? `http://localhost:5000/uploads/${item.image}` : '/default-image.png'}
        alt={item.name}
        className="product-image"
      />
      <h4 className="product-name">{item.name}</h4>
      <p className="product-details">
        Brand: {item.brand}<br />
        Price: ₹{item.price}<br />
        Stock: {item.stock}
      </p>
    </div>
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="home-container">
      <Header />
      <h2 className="w-75 mx-auto" style={{marginTop: 100}}>Hello {user?.fullname || "User"}!</h2>

      <section>
        <h3 className="w-75 mx-auto mt-5">Mobiles</h3>
        <div className="product-grid w-75 mx-auto">
          {mobiles.length > 0 ? mobiles.map(renderItem) : <p>No mobiles available.</p>}
        </div>
      </section>

      <section>
        <h3 className="w-75 mx-auto mt-5">Laptops</h3>
        <div className="product-grid w-75 mx-auto">
          {laptops.length > 0 ? laptops.map(renderItem) : <p>No laptops available.</p>}
        </div>
      </section>

      <section>
        <h3 className="w-75 mx-auto mt-5">Gadgets</h3>
        <div className="product-grid w-75 mx-auto">
          {gadgets.length > 0 ? gadgets.map(renderItem) : <p>No gadgets available.</p>}
        </div>
      </section>

      {/* Product Detail Modal */}
      {/* Product Detail Modal */}
{selectedProduct && (
  <div className="product-detail-overlay" onClick={closeProductDetail}>
    <div className="product-detail-container" onClick={(e) => e.stopPropagation()}>
      <button className="close-btn" onClick={closeProductDetail}>×</button>

      <div className="product-detail-left">
        <img
          src={selectedProduct.image ? `http://localhost:5000/uploads/${selectedProduct.image}` : '/default-image.png'}
          alt={selectedProduct.name}
          className="detail-image"
        />
      </div>

      <div className="product-detail-right">
        <h2>{selectedProduct.name}</h2>
        <p><strong>Brand:</strong> {selectedProduct.brand}</p>
        <p><strong>Category:</strong> {selectedProduct.category || "Electronics"}</p>
        <p><strong>Price:</strong> ₹{selectedProduct.price}</p>
        <p><strong>Stock:</strong> {selectedProduct.stock}</p>
        <p><strong>Description:</strong> {selectedProduct.description || "High-quality product with latest technology."}</p>

        <div className="detail-buttons">
          <button className="buy-btn">Buy Now</button>
          <button className="cart-btn">Add to Cart</button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default Home;