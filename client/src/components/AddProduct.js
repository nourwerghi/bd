const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  try {
    let imageUrl = '';
    if (productData.image) {
      imageUrl = await api.products.uploadImage(productData.image);
    }

    await api.products.create({
      ...productData,
      image: imageUrl
    });

    toast.success('Produit ajouté avec succès');
    setImagePreview('');
    // Reset other form fields...
  } catch (error) {
    console.error('Error:', error);
    toast.error(error.message || 'Erreur lors de l\'ajout du produit');
  } finally {
    setIsLoading(false);
  }
};