import { useState, useEffect } from 'react';
import Spinner from '../ui/Spinner/Spinner';
import { useLanguage } from '../../context/LanguageContext';
import './ProductForm.css';

const categories = ['certificates', 'accounts', 'software', 'games', 'subscriptions', 'other'];

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'certificates',
    description: '',
    image: '',
    stock: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description || '',
        image: product.image || '',
        stock: product.stock || ''
      });
    } else {
      resetForm();
    }
  }, [product]);

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      category: 'certificates',
      description: '',
      image: '',
      stock: ''
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await onSubmit(formData);
      setSuccess(product ? t('admin.productUpdated') : t('admin.productCreated'));
      resetForm();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || t('admin.productSaveError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h3>{product ? t('admin.editProduct') : t('admin.newProduct')}</h3>
      
      {error && <div className="form-error">{error}</div>}
      {success && <div className="form-success">{success}</div>}

      <div className="form-row">
        <div className="form-group">
          <label>{t('admin.productsTableName')}</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>{t('admin.productsTablePrice')} (₽)</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
            min="0"
            step="1"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>{t('admin.productsTableCategory')}</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>{t('admin.productsTableStock')}</label>
          <input
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            min="0"
          />
        </div>
      </div>

      <div className="form-group">
        <label>{t('admin.productsTableImage')}</label>
        <input
          type="url"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          placeholder="https://..."
        />
      </div>

      <div className="form-group">
        <label>{t('admin.productsDescription')}</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows="4"
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? (
            <div className="button-spinner">
              <Spinner size="small" />
            </div>
          ) : (
            product ? t('admin.save') : t('admin.create')
          )}
        </button>
        <button type="button" className="btn-cancel" onClick={onCancel}>
          {t('admin.cancel')}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
