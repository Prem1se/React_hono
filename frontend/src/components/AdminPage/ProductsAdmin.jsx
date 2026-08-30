import { useState, useEffect } from 'react';
import { productsAPI } from '../../services/api';
import Spinner from '../ui/Spinner/Spinner';
import ProductForm from './ProductForm';
import ProductTable from './ProductTable';
import { useLanguage } from '../../context/LanguageContext';
import './ProductsAdmin.css';

const ProductsAdmin = () => {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        productsAPI.getAll(),
        productsAPI.getCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    if (editingProduct) {
      await productsAPI.update(editingProduct.id, formData);
    } else {
      await productsAPI.create(formData);
    }
    fetchData();
    resetForm();
  };

  const resetForm = () => {
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm(t('admin.deleteConfirm'))) return;

    try {
      await productsAPI.delete(id);
      fetchData();
    } catch (err) {
      console.error('Error deleting:', err);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="products-admin">
      <div className="products-header">
        <h2>{t('admin.products')} ({products.length})</h2>
        <button className="btn-add-product" onClick={() => setShowForm(!showForm)}>
          {showForm ? t('admin.cancel') : t('admin.addProduct')}
        </button>
      </div>

      {showForm && (
        <ProductForm
          product={editingProduct}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          categoriesList={categories}
        />
      )}

      <ProductTable
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ProductsAdmin;
