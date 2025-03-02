import React, { useEffect, useState } from 'react';
import { Search, ShoppingCart, Plus, Minus, X } from 'lucide-react';
import { useCartStore } from '../lib/store';
import { api } from '../lib/api';
import { Link } from 'react-router-dom';
import ProductImage from '../components/ProductImage/ProductImage';
import PaymentForm from '../components/PaymentForm/PaymentForm';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState({ loading: false, error: null, success: false });
  const { items, addItem, removeItem, updateQuantity, total, clearCart } = useCartStore();

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  const handlePaymentSubmit = async (paymentData) => {
    setPaymentStatus({ loading: true, error: null, success: false });
    try {
      // Create order with payment and cart data
      const orderData = {
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        total,
        paymentMethod: paymentData.paymentMethod,
        shippingAddress: paymentData.formData.deliveryAddress,
        paymentDetails: paymentData.formData
      };

      // Submit order to backend
      await api.orders.create(orderData);
      
      // Clear cart and show success message
      clearCart();
      setPaymentStatus({ loading: false, error: null, success: true });
      
      // Close payment panel after successful order
      setTimeout(() => {
        setShowPayment(false);
        setShowCart(false);
        setPaymentStatus({ loading: false, error: null, success: false });
      }, 2000);
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus({
        loading: false,
        error: error.message || 'An error occurred during payment processing. Please try again.',
        success: false
      });
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await api.products.getAll(selectedCategory === 'all' ? undefined : selectedCategory, searchQuery);
      console.log('Products received:', data); // Ajout de cette ligne pour déboguer
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'clothing', name: 'Clothing' },
    { id: 'home', name: 'Home & Garden' },
    { id: 'sports', name: 'Sports' },
    { id: 'toys', name: 'Toys & Games' },
    { id: 'beauty', name: 'Beauty' },
    { id: 'jewelry', name: 'Jewelry' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Shop</h1>
            
            {/* Search and Cart */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
              
              <button
                onClick={() => setShowCart(true)}
                className="relative p-2 text-gray-600 hover:text-gray-900"
              >
                <ShoppingCart className="w-6 h-6" />
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Home Button */}
      <Link
        to="/"
        className="fixed bottom-8 right-8 bg-gradient-to-r from-purple-600 to-blue-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 group z-50"
      >
        <svg
          className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        <span>Retour à l'accueil</span>
      </Link>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Categories */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="animate-pulse">
                    <div className="bg-gray-200 rounded-lg h-48"></div>
                    <div className="space-y-3 mt-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product._id} className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="aspect-w-3 aspect-h-2">
                      <ProductImage
                        imageUrl={product.imageUrl}
                        alt={product.name}
                        className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                      <p className="mt-1 text-gray-500 text-sm line-clamp-2">{product.description}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-lg font-medium text-gray-900">${product.price}</span>
                        <button
                          onClick={() => {
                            addItem(product);
                            setShowCart(true);
                          }}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Add to Shop
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 overflow-hidden z-50">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowCart(false)} />
            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
              <div className="w-screen max-w-md">
                <div className="h-full flex flex-col bg-white shadow-xl">
                  <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <h2 className="text-lg font-medium text-gray-900">Shopping Cart</h2>
                      <button
                        onClick={() => setShowCart(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>

                    <div className="mt-8">
                      {items.length === 0 ? (
                        <p className="text-center text-gray-500">Your cart is empty</p>
                      ) : (
                        <div className="flow-root">
                          <ul className="divide-y divide-gray-200">
                            {items.map((item) => (
                              <li key={item.id} className="py-6 flex">
                                <ProductImage
                                  imageUrl={item.imageUrl}
                                  alt={item.name}
                                  className="w-24 h-24 rounded-lg object-cover"
                                />
                                <div className="ml-4 flex-1">
                                  <div className="flex justify-between">
                                    <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                                    <p className="text-sm font-medium text-gray-900">${item.price}</p>
                                  </div>
                                  <div className="mt-4 flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                      <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="text-gray-500 hover:text-gray-600"
                                      >
                                        <Minus className="h-4 w-4" />
                                      </button>
                                      <span className="text-gray-600">{item.quantity}</span>
                                      <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="text-gray-500 hover:text-gray-600"
                                      >
                                        <Plus className="h-4 w-4" />
                                      </button>
                                    </div>
                                    <button
                                      onClick={() => removeItem(item.id)}
                                      className="text-sm font-medium text-red-600 hover:text-red-500"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {items.length > 0 && (
                    <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Total</p>
                        <p>${total}</p>
                      </div>
                      <div className="mt-6">
                        <button
                          onClick={() => {
                            setShowPayment(true);
                          }}
                          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Proceed to Checkout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Panel */}
      {showPayment && (
        <div className="fixed inset-0 overflow-hidden z-50">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowPayment(false)} />
            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
              <div className="w-screen max-w-md">
                <div className="h-full flex flex-col bg-white shadow-xl">
                  <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                    <div className="flex items-start justify-between mb-6">
                      <h2 className="text-lg font-medium text-gray-900">Checkout</h2>
                      <button
                        onClick={() => setShowPayment(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                    {paymentStatus.error && (
                      <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                        {paymentStatus.error}
                      </div>
                    )}
                    {paymentStatus.success && (
                      <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
                        Order placed successfully! Thank you for your purchase.
                      </div>
                    )}
                    <PaymentForm
                      onSubmit={handlePaymentSubmit}
                      loading={paymentStatus.loading}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}