import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [singleItem, setSingleItem] = useState(null);
  const [loading, setLoading] = useState(true);

// ดึงข้อมูลทั้งหมด (ข้อ 1.1)
  useEffect(() => {
    fetch('http://localhost:4000/api/products/all')
      .then((res) => res.json())
      .then((data) => {
        setItems(Array.isArray(data) ? data : data.items || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Fetch API Error:', error);
        setLoading(false);
      });
  }, []);

  // ค้นหาตาม ID (ข้อ 1.2)
  const handleSearch = () => {
    if (!searchId) return;

    fetch(`http://localhost:4000/api/product/${searchId}`)
      .then((res) => {
        if (res.status === 404) {
          alert(`Product not found with ID ${searchId} (Error 404)`);
          setSingleItem(null);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setSingleItem(data);
      })
      .catch((error) => console.error('Search API Error:', error));
  };

  return (
    <div className="app-container">
      {/* 1. Navbar ส่วนบนสุด */}
      <nav className="navbar">
        <div className="logo">IT GADGET</div>
        <div className="nav-links">
          <button className="btn-black">Group 02</button>
        </div>
      </nav>

      {/* 2. Hero Section (หน้าจอแรกแบบ Full-screen) */}
      <header className="hero-section">
        <div className="hero-content">
          <h1>ระบบค้นหาข้อมูลอุปกรณ์ IT</h1>
          <p>เพิ่มประสิทธิภาพในการเข้าถึงข้อมูลอุปกรณ์ได้อย่างรวดเร็วและแม่นยำ</p>

          <div className="search-wrapper">
            <input
              type="number"
              placeholder="ค้นหาสินค้าด้วย ID (เช่น 1, 2, 3)"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch}>ค้นหา</button>
          </div>

          {singleItem && (
            <div className="search-result">
              <h3>{singleItem.name}</h3>
              <p>{singleItem.brand} — ราคา ${singleItem.priceUSD}</p>
            </div>
          )}
        </div>
      </header>

      {/* 3. ส่วนตารางด้านล่าง */}
      <section className="inventory-section">
        <h2 className="section-title">รายการสินค้าทั้งหมด</h2>
        <div className="table-container">
          {loading ? (
            <p className="loading-text">กำลังโหลดข้อมูลจาก Server...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>สินค้า</th>
                  <th>หมวดหมู่</th>
                  <th>ราคา (USD)</th>
                  <th>สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td><strong>{item.id}</strong></td>
                    <td>
                      <div className="item-name">{item.name}</div>
                      <div className="item-brand">{item.brand}</div>
                    </td>
                    <td>{item.type}</td>
                    <td>${item.priceUSD}</td>
                    <td>
                      <span className={`status ${item.inStock ? 'status-in' : 'status-out'}`}>
                        {item.inStock ? 'มีสินค้า' : 'สินค้าหมด'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}

export default App;