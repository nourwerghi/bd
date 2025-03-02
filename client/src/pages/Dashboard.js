import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Link } from 'react-router-dom';
import AddProductForm from '../components/AddProductForm';

const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Sports',
  'Toys & Games',
  'Beauty',
  'Jewelry'
];

const Dashboard = () => {
  const [userStats, setUserStats] = useState({
    orders: [],
    totalSpent: 0,
    recentActivity: [],
    orderStats: {
      pending: 0,
      delivered: 0,
      cancelled: 0
    }
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
  const [selectedCategory, setSelectedCategory] = useState('all');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (user.isSeller) {
        const productsData = await api.products.getByUser();
        setProducts(productsData || []);
      }

      setLoading(false);
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      setError('Erreur lors du chargement des données. Veuillez réessayer.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user.isSeller]);

  const handleProductAdded = () => {
    setShowAddProduct(false);
    fetchDashboardData();
  };

  const handleBecomeSeller = async () => {
    try {
      setLoading(true);
      const updatedUser = await api.users.becomeSeller();
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setLoading(false);
    } catch (error) {
      setError('Erreur lors de la demande pour devenir vendeur. Veuillez réessayer.');
      setLoading(false);
    }
  };

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-orange-600 px-6 py-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white">Tableau de bord</h1>
                <p className="mt-2 text-orange-100">Gérez vos produits</p>
              </div>
              {user.isSeller ? (
                <button
                  onClick={() => setShowAddProduct(!showAddProduct)}
                  className="bg-white text-orange-600 px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors"
                >
                  {showAddProduct ? 'Fermer' : 'Ajouter un produit'}
                </button>
              ) : (
                <button
                  onClick={handleBecomeSeller}
                  className="bg-white text-orange-600 px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors"
                >
                  Devenir vendeur
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="px-6 py-4 bg-red-50 border-b border-red-100">
              <div className="flex items-center text-red-600">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}
          
          {!user.isSeller && (
            <div className="px-6 py-6 bg-orange-50">
              <p className="text-orange-800">
                Pour vendre des produits sur notre plateforme, vous devez d'abord devenir vendeur.
                Cliquez sur le bouton "Devenir vendeur" pour commencer.
              </p>
            </div>
          )}
          
          {user.isSeller && showAddProduct && (
            <div className="px-6 py-6 border-b border-gray-200">
              <AddProductForm onProductAdded={handleProductAdded} />
            </div>
          )}

          {user.isSeller && (
            <div className="px-6 py-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Vos produits</h2>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all">Toutes les catégories</option>
                  {CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {products.length === 0 ? (
                <p className="text-gray-500">Vous n'avez pas encore de produits.</p>
              ) : filteredProducts.length === 0 ? (
                <p className="text-gray-500">Aucun produit dans cette catégorie.</p>
              ) : (
                <div className="space-y-8">
                  {selectedCategory !== 'all' && (
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      {selectedCategory}
                    </h3>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map(product => (
                      <div key={product._id} className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="aspect-w-3 aspect-h-2">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/placeholder.png';
                            }}
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                          <p className="mt-1 text-sm text-gray-500">{product.description}</p>
                          <div className="mt-2 flex justify-between items-center">
                            <p className="text-lg font-medium text-orange-600">{product.price}€</p>
                            <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                          </div>
                          <div className="mt-2">
                            <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                              {product.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;