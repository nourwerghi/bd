import React, { useState } from 'react';
import { api } from '../lib/api';
import './AddProduct.css';

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Electronics', // Set default category
    stock: '1' // Set default stock
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Add validation for specific fields
    if (name === 'price') {
      processedValue = Math.max(0, value).toString();
    } else if (name === 'stock') {
      processedValue = Math.max(0, Math.floor(Number(value))).toString();
    }

    setProduct(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append('name', product.name);
      formData.append('description', product.description);
      formData.append('price', product.price);
      formData.append('category', product.category);
      formData.append('stock', product.stock);
      if (image) {
        formData.append('image', image);
      }

      await api.admin.addProduct(formData);
      setSuccess(true);
      setProduct({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: ''
      });
      setImage(null);
      setPreview(null);
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';

    } catch (err) {
      console.error('Error adding product:', err);
      setError(err.message || 'Une erreur est survenue lors de l\'ajout du produit');
    } finally {
      setLoading(false);
    }
  };
  const CATEGORIES = [
    'Electronics',
    'Clothing',
    'Home & Garden',
    'Sports',
    'Toys & Games',
    'Beauty',
    'Jewelry'
  ];
  return (
    <div className="add-product">
      <h2>Ajouter un Nouveau Produit</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Produit ajouté avec succès!</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nom du produit</label>
          <input
            type="text"
            id="name"
            name="name"
            value={product.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={product.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Prix (€)</label>
          <input
            type="number"
            id="price"
            name="price"
            min="0"
            step="0.01"
            value={product.price}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Catégorie</label>
          <select
            id="category"
            name="category"
            value={product.category}
            onChange={handleInputChange}
            required
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="stock">Stock</label>
          <input
            type="number"
            id="stock"
            name="stock"
            min="0"
            value={product.stock}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Image du produit</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          {preview && (
            <div className="image-preview">
              <img src={preview} alt="Aperçu" />
            </div>
          )}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Ajout en cours...' : 'Ajouter le produit'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
