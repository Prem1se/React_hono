import { useState, useEffect } from 'react';
import { productsAPI } from '../../services/api';
import ProductForm from './ProductForm';
import ProductTable from './ProductTable';
import './ProductsAdmin.css';

const ProductsAdmin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productsAPI.getAll();
      setProducts(data);
    } catch (err) {
      console.error('Ошибка загрузки товаров:', err);
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
    fetchProducts();
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
    if (!confirm('Удалить этот товар?')) return;

    try {
      await productsAPI.delete(id);
      fetchProducts();
    } catch (err) {
      console.error('Ошибка удаления:', err);
    }
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="products-admin">
      <div className="products-header">
        <h2>Товары ({products.length})</h2>
        <button className="btn-add-product" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Отмена' : '+ Добавить товар'}
        </button>
      </div>

      {showForm && (
        <ProductForm
          product={editingProduct}
          onSubmit={handleSubmit}
          onCancel={resetForm}
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
