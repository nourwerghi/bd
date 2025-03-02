const Product = require('../models/Product');
const upload = require('../middleware/upload');

exports.uploadImage = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({
        message: 'Error uploading file',
        error: err
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    try {
      // Update the product with the new image URL
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      product.imageUrl = req.file.filename;
      await product.save();

      res.json({
        success: true,
        imageUrl: req.file.filename,
        fullUrl: `${process.env.API_URL}/uploads/${req.file.filename}`
      });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ message: 'Error updating product', error: error.message });
    }
  });
};