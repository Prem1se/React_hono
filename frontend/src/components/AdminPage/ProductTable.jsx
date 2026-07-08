import { formatPrice } from '../../utils/formatPrice';
import ActionButtons from './ActionButtons';
import './ProductTable.css';

const ProductTable = ({ products, onEdit, onDelete }) => {
  return (
    <div className="product-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Изображение</th>
            <th>Название</th>
            <th>Категория</th>
            <th>Цена</th>
            <th>Остаток</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>
                <img src={product.image} alt={product.name} className="product-thumb" />
              </td>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>{formatPrice(product.price)}</td>
              <td>{product.stock}</td>
              <td>
                <ActionButtons
                  onEdit={() => onEdit(product)}
                  onDelete={() => onDelete(product.id)}
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
