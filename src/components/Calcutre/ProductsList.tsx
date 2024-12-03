// components/ProductList.tsx

import { Product } from "./types"; // Define Product type in a separate file

interface Props {
  products: Product[];
}

export default function ProductList({ products }: Props) {
  return (
    <div className="productList">
      {products.length > 0 ? (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {products.map((product, index) => (
            <li
              key={index}
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
            </li>
          ))}
        </ul>
      ) : (
        <p>אין עדיין מוצרים.</p>
      )}
    </div>
  );
}
