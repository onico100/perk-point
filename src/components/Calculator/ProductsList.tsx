import { Product } from "./types"; // Define Product type in a separate file
import { CiCircleMinus } from "react-icons/ci";
import {ProductList as List} from "./Calculator.Styles"



interface Props {
  products: Product[];
  handleDelete: (productName: string) => void; // Function to handle product deletion
}

export default function ProductList({ products, handleDelete }: Props) {
  return (
    <List>
      {products.length > 0 ? (
        <ul>
          {products.map((product) => (
            <li key={product.name}>
              <span>{product.name}</span>
              <span>₪{product.price.toFixed(2)}</span>
              <button onClick={() => handleDelete(product.name)}>
                <CiCircleMinus />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>אין עדיין מוצרים.</p>
      )}
    </List>
  );
}
