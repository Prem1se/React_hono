import { useState, useEffect } from 'react';
import Spinner from '../ui/Spinner/Spinner';
import { useLanguage } from '../../context/LanguageContext';
import './ProductForm.css';

const categories = [
  { slug: 'certificates', nameRu: 'Сертификаты', nameEn: 'Certificates' },
  { slug: 'accounts', nameRu: 'Аккаунты', nameEn: 'Accounts' },
  { slug: 'software', nameRu: 'ПО', nameEn: 'Software' },
  { slug: 'games', nameRu: 'Игры', nameEn: 'Games' },
  { slug: 'subscriptions', nameRu: 'Подписки', nameEn: 'Subscriptions' },
  { slug: 'other', nameRu: 'Другое', nameEn: 'Other' },
];

const ProductForm = ({ product, onSubmit, onCancel, categoriesList = [] }) => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    nameRu: '',
    nameEn: '',
    price: '',
    categoryId: '',
    descriptionRu: '',
    descriptionEn: '',
    image: '',
    stock: '',
    oldPrice: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        nameRu: product.name_ru || product.name || '',
        nameEn: product.name_en || '',
        price: product.price,
        categoryId: product.categoryId || '',
        descriptionRu: product.description_ru || product.description || '',
        descriptionEn: product.description_en || '',
        image: product.image || '',
        stock: product.stock || '',
        oldPrice: product.oldPrice || ''
      });
    } else {
      resetForm();
    }
  }, [product]);

  const resetForm = () => {
    setFormData({
      nameRu: '',
      nameEn: '',
      price: '',
      categoryId: '',
      descriptionRu: '',
      descriptionEn: '',
      image: '',
      stock: '',
      oldPrice: ''
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

  const currentCategoryName = (slug) => {
    const cat = categoriesList.find(c => c.slug === slug);
    return cat ? cat.name : slug;
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h3>{product ? t('admin.editProduct') : t('admin.newProduct')}</h3>
      
      {error && <div className="form-error">{error}</div>}
      {success && <div className="form-success">{success}</div>}

      <div className="form-row">
        <div className="form-group">
          <label>{t('admin.productsTableName')} (RU)</label>
          <input
            type="text"
            value={formData.nameRu}
            onChange={(e) => setFormData({ ...formData, nameRu: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>{t('admin.productsTableName')} (EN)</label>
          <input
            type="text"
            value={formData.nameEn}
            onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
          />
        </div>
      </div>

      <div className="form-row">
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
        <div className="form-group">
          <label>Старая цена (₽)</label>
          <input
            type="number"
            value={formData.oldPrice}
            onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value || '' })}
            min="0"
            step="1"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>{t('admin.productsTableCategory')}</label>
          <select
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            required
          >
            <option value="">Выберите категорию</option>
            {categories.map(cat => (
              <option key={cat.slug} value={cat.slug}>{currentCategoryName(cat.slug)}</option>
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
        <label>Описание (RU)</label>
        <textarea
          value={formData.descriptionRu}
          onChange={(e) => setFormData({ ...formData, descriptionRu: e.target.value })}
          rows="4"
        />
      </div>

      <div className="form-group">
        <label>Description (EN)</label>
        <textarea
          value={formData.descriptionEn}
          onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
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
