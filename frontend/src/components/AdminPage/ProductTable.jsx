import { formatPrice } from '../../utils/formatPrice';
import ActionButtons from './ActionButtons';
import { useLanguage } from '../../context/LanguageContext';
import './ProductTable.css';

const ProductTable = ({ products, onEdit, onDelete }) => {
  const { t, getCategoryName } = useLanguage();

  return (
    <div className="product-table">
      <table>
        <thead>
          <tr>
            <th>{t('admin.productsTableId')}</th>
            <th>{t('admin.productsTableImage')}</th>
            <th>{t('admin.productsTableName')}</th>
            <th>{t('admin.productsTableCategory')}</th>
            <th>{t('admin.productsTablePrice')}</th>
            <th>{t('admin.productsTableStock')}</th>
            <th>{t('admin.productsTableActions')}</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>
                {product.image ? (
                  <img src={product.image} alt={product.name} className="product-thumb" />
                ) : (
                  <div className="product-thumb-empty" />
                )}
              </td>
              <td>{product.name}</td>
              <td>{getCategoryName(product.category)}</td>
              <td>{formatPrice(product.price)}</td>
              <td>{product.stock}</td>
              <td>
                <ActionButtons
                  onEdit={() => onEdit(product)}
                  onDelete={() => onDelete(product.id)}
                  editLabel={t('admin.edit')}
                  deleteLabel={t('admin.delete')}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
