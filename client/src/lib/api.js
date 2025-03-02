import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => localStorage.getItem('token');

// Helper function to set auth token
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Initialize token if it exists
const token = getAuthToken();
if (token) {
  setAuthToken(token);
}

const api = {
  setAuthToken,
  
  auth: {
    login: async (credentials) => {
      try {
        console.log('Attempting login with:', credentials);
        const response = await axios.post(`${BASE_URL}/auth/login`, credentials);
        console.log('Login response:', response.data);
        
        if (response.data.success) {
          // Set token for future requests
          setAuthToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        
        return response.data;
      } catch (error) {
        console.error('Login error:', error.response?.data || error);
        throw error.response?.data || { message: 'Une erreur est survenue lors de la connexion' };
      }
    },

    register: async (userData) => {
      try {
        const response = await axios.post(`${BASE_URL}/auth/register`, userData);
        
        if (response.data.success) {
          // Set token for future requests
          setAuthToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        
        return response.data;
      } catch (error) {
        console.error('Register error:', error.response?.data || error);
        throw error.response?.data || { message: 'Une erreur est survenue lors de l\'inscription' };
      }
    },

    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setAuthToken(null);
    },

    getProfile: async () => {
      try {
        const response = await axios.get(`${BASE_URL}/auth/profile`);
        return response.data;
      } catch (error) {
        console.error('Get profile error:', error.response?.data || error);
        throw error.response?.data || { message: 'Une erreur est survenue lors de la récupération du profil' };
      }
    },

    updateProfile: async (userData) => {
      try {
        const response = await axios.put(`${BASE_URL}/auth/profile`, userData);
        return response.data;
      } catch (error) {
        console.error('Update profile error:', error.response?.data || error);
        throw error.response?.data || { message: 'Une erreur est survenue lors de la mise à jour du profil' };
      }
    }
  },
  
  users: {
    becomeSeller: async () => {
      try {
        const response = await axios.put(`${BASE_URL}/users/become-seller`);
        if (response.data) {
          // Mettre à jour les informations de l'utilisateur dans le localStorage
          const currentUser = JSON.parse(localStorage.getItem('user'));
          const updatedUser = { ...currentUser, isSeller: true };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        return response.data;
      } catch (error) {
        console.error('Become seller error:', error.response?.data || error);
        throw error.response?.data || { message: 'Une erreur est survenue lors de la demande pour devenir vendeur' };
      }
    }
  },
  
  products: {
    getAll: async (category = 'all', search = '') => {
      try {
        const response = await axios.get(`${BASE_URL}/products?category=${category}&search=${search}`);
        return response.data;
      } catch (error) {
        console.error('Get all products error:', error.response?.data || error);
        throw error.response?.data || { message: 'Une erreur est survenue lors de la récupération des produits' };
      }
    },

    getByUser: async () => {
      try {
        const response = await axios.get(`${BASE_URL}/products/user`);
        return response.data;
      } catch (error) {
        console.error('Get products by user error:', error.response?.data || error);
        throw error.response?.data || { message: 'Une erreur est survenue lors de la récupération des produits de l\'utilisateur' };
      }
    },

    create: async (productData) => {
      try {
        const response = await axios.post(`${BASE_URL}/products`, productData);
        return response.data;
      } catch (error) {
        console.error('Create product error:', error.response?.data || error);
        throw error.response?.data || { message: 'Une erreur est survenue lors de la création du produit' };
      }
    },

    update: async (productId, productData) => {
      try {
        const response = await axios.put(`${BASE_URL}/products/${productId}`, productData);
        return response.data;
      } catch (error) {
        console.error('Update product error:', error.response?.data || error);
        throw error.response?.data || { message: 'Une erreur est survenue lors de la mise à jour du produit' };
      }
    },

    delete: async (productId) => {
      try {
        const response = await axios.delete(`${BASE_URL}/products/${productId}`);
        return response.data;
      } catch (error) {
        console.error('Delete product error:', error.response?.data || error);
        throw error.response?.data || { message: 'Une erreur est survenue lors de la suppression du produit' };
      }
    }
  },
  
  admin: {
    // Statistiques générales
    getStats: async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin/stats`);
        return response.data;
      } catch (error) {
        console.error('Get stats error:', error.response?.data || error);
        throw error.response?.data || { message: 'Une erreur est survenue lors de la récupération des statistiques' };
      }
    },

    // Gestion des utilisateurs
    getUsers: async () => {
      try {
        return await axios.get(`${BASE_URL}/admin/users`);
      } catch (error) {
        console.error('Get users error:', error.response?.data || error);
        throw error.response?.data || { message: 'Une erreur est survenue lors de la récupération des utilisateurs' };
      }
    },

    blockUser: async (userId) => {
      try {
        return await axios.put(`${BASE_URL}/admin/users/${userId}/block`);
      } catch (error) {
        console.error('Block user error:', error.response?.data || error);
        throw error.response?.data || { message: 'Une erreur est survenue lors de la mise en attente de l\'utilisateur' };
      }
    },

    deleteUser: async (userId) => {
      try {
        return await axios.delete(`${BASE_URL}/admin/users/${userId}`);
      } catch (error) {
        console.error('Delete user error:', error.response?.data || error);
        throw error.response?.data || { message: 'Une erreur est survenue lors de la suppression de l\'utilisateur' };
      }
    },

    // Gestion des produits
    getProducts: async () => {
      try {
        return await axios.get(`${BASE_URL}/admin/products`);
      } catch (error) {
        console.error('Get products error:', error.response?.data || error);
        throw error.response?.data || { message: 'Une erreur est survenue lors de la récupération des produits' };
      }
    },

    addProduct: async (formData) => {
      try {
        const response = await axios.post(`${BASE_URL}/products`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        return response.data;
      } catch (error) {
        console.error('Add product error:', error.response?.data || error);
        throw error.response?.data || { message: 'Une erreur est survenue lors de l\'ajout du produit' };
      }
    },

    deleteProduct: async (productId) => {
      try {
        return await axios.delete(`${BASE_URL}/admin/products/${productId}`);
      } catch (error) {
        console.error('Delete product error:', error.response?.data || error);
        throw error.response?.data || { message: 'Une erreur est survenue lors de la suppression du produit' };
      }
    },

    // Meilleurs vendeurs
    getTopSellers: async () => {
      try {
        return await axios.get(`${BASE_URL}/admin/top-sellers`);
      } catch (error) {
        console.error('Get top sellers error:', error.response?.data || error);
        throw error.response?.data || { message: 'Une erreur est survenue lors de la récupération des meilleurs vendeurs' };
      }
    },

    // Activités récentes
    getActivities: async () => {
      try {
        return await axios.get(`${BASE_URL}/admin/activities`);
      } catch (error) {
        console.error('Get activities error:', error.response?.data || error);
        throw error.response?.data || { message: 'Une erreur est survenue lors de la récupération des activités récentes' };
      }
    }
  }
};

export { api };