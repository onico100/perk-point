// components/ProductList.tsx

import { Product } from "./types"; // Define Product type in a separate file
import { CiCircleMinus } from "react-icons/ci";

interface Props {
  products: Product[];
  handleDelete: (productName: string) => void; // Function to handle product deletion
}

export default function ProductList({ products, handleDelete }: Props) {
  return (
    <div className="productList">
      {products.length > 0 ? (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {products.map((product) => (
            <li
              key={product.name}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px",
                border: "1px solid #ccc",
                marginBottom: "5px",
                borderRadius: "5px",
              }}
            >
              <span>{product.name}</span>

              <span>₪{product.price.toFixed(2)}</span>

              <button
                onClick={() => handleDelete(product.name)} // Call handleDelete with product id
                style={{
                  padding: "5px 10px",
                  cursor: "pointer",
                }}
              >
                <CiCircleMinus />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>אין עדיין מוצרים.</p>
      )}
    </div>
  );
}
