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

// Ajouter l'URL complète de l'image
productSchema.methods.toJSON = function() {
  const obj = this.toObject();
  if (obj.imageUrl && !obj.imageUrl.startsWith('http')) {
    obj.imageUrl = `http://localhost:4991/uploads/${obj.imageUrl}`;
  }
  return obj;
};

module.exports = mongoose.model('Product', productSchema);