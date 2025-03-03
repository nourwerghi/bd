const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Validate and transform image URL
productSchema.methods.toJSON = function() {
  const obj = this.toObject();
  if (obj.imageUrl) {
    if (!obj.imageUrl.startsWith('http')) {
      // Use environment variable for API URL with fallback
      const apiUrl = process.env.API_URL || 'http://localhost:5000';
      // Ensure proper URL path construction
      const imagePath = obj.imageUrl.startsWith('/') ? obj.imageUrl.substring(1) : obj.imageUrl;
      obj.imageUrl = `${apiUrl}/uploads/${imagePath}`;
    }
    // Validate if URL is properly formed
    try {
      new URL(obj.imageUrl);
    } catch (error) {
      // If URL is invalid, use a fallback image
      obj.imageUrl = `${process.env.API_URL || 'http://localhost:5000'}/placeholder.png`;
    }
  } else {
    // Provide fallback for missing images
    obj.imageUrl = `${process.env.API_URL || 'http://localhost:5000'}/placeholder.png`;
  }
  return obj;
};

module.exports = mongoose.model('Product', productSchema);