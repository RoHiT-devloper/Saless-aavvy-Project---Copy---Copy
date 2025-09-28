// Product_Manager.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import "./Product_Manager.css";


const Product_Manager = () => {
  return (
    <div className="product-manager">
      <h2 className="pm-title">📦 Product Manager</h2>
      <ul className="pm-list">
        <li>
          <NavLink to="/addProduct" className="pm-link">
            Add Product
          </NavLink>
        </li>
        <li>
          <NavLink to="/deleteProduct" className="pm-link">
            Delete Product
          </NavLink>
        </li>
        <li>
          <NavLink to="/searchProduct" className="pm-link">
            Search Product
          </NavLink>
        </li>
        <li>
          <NavLink to="/showAllProducts" className="pm-link">
            Show All Products
          </NavLink>
        </li>
        <li>
          <NavLink to="/updateProduct" className="pm-link">
            Update Product
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Product_Manager;
