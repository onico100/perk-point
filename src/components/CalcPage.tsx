"use client";

import { useState } from "react";
import styles from "@/styles/Calc.module.css";
import { IoClose } from "react-icons/io5";

type Product = {
  name: string;
  price: number;
};

interface discountInputs {
  discount1: number; // Percentage off
  discount2: number; // Fixed amount off
  discount3: { buy: number; get: number }; // Buy X, Get Y
  discount4: string; // Custom "index:percentage" format
}

export default function CakcPage({ onClose }: { onClose: () => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({ name: "", price: "" });
  const [discountInputs, setDiscountInputs] = useState<discountInputs>({
    discount1: 0,
    discount2: 0,
    discount3: { buy: 0, get: 0 },
    discount4: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDiscountInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setDiscountInputs((prev) => ({ ...prev, [name]: value }));
  };

  const addProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(form.price);
    if (form.name && !isNaN(price)) {
      setProducts((prev) => {
        const updatedProducts = [...prev, { name: form.name, price }];
        return updatedProducts.sort((a, b) => b.price - a.price);
      });
      setForm({ name: "", price: "" });
    }
  };

  const sumPriceProuducts = (
    products: Product[],
    indexStart: number,
    endIndex: number
  ) => {
    let sum = 0;
    for (let i = indexStart; i < endIndex; i += 1) {
      sum += products[i].price;
    }
    return sum;
  };

  const applyPercentageOff = (percentage: number) => {
    const updatedProducts = products.map((product) => ({
      ...product,
      price: product.price - (product.price * percentage) / 100,
    }));
    // maybe:setPercentage(percentage);
    setProducts(updatedProducts);
  };

  const applyFlatOff = (amount: number) => {
    let sumAll = sumPriceProuducts(products, 0, products.length);
    let percentage = (amount / sumAll) * 100;
    applyPercentageOff(percentage);
  };

  const applyBuySomeGetSome = (buy: number, get: number) => {
    let sumNotPaying = sumPriceProuducts(products, buy, get + 1);
    applyFlatOff(sumNotPaying);
  };

  const applyDiscount1 = () => {
    let percentage = discountInputs.discount1;
    applyPercentageOff(percentage);
  };

  const applyDiscount2 = () => {
    let flat_off = discountInputs.discount2;
    applyFlatOff(flat_off);
  };

  const applyDiscount3 = () => {
    const { buy, get } = discountInputs.discount3;
    if (!buy || !get) return;
    applyBuySomeGetSome(buy, get);
  };

  const applyDiscount4 = () => {
    const discounts = discountInputs.discount4
      .split(",") // Example input: "0:10,2:15"
      .map((entry) => {
        const [index, percentage] = entry.split(":").map(Number);
        return { index, percentage };
      });

    const updatedProducts = products.map((product, index) => {
      const discount = discounts.find((d) => d.index === index);
      if (discount) {
        return {
          ...product,
          price: product.price - (product.price * discount.percentage) / 100,
        };
      }
      return product;
    });
    let sumAll = sumPriceProuducts(products, 0, products.length);
    let total = sumPriceProuducts(updatedProducts, 0, updatedProducts.length);
    let flat_off = sumAll - total;
    applyFlatOff(flat_off);
  };

  const applyAllDiscounts = () => {
    if (discountInputs.discount1) applyDiscount1();
    if (discountInputs.discount2) applyDiscount2();
    if (discountInputs.discount3.buy && discountInputs.discount3.get)
      applyDiscount3();
    if (discountInputs.discount4) applyDiscount4();
  };

  return (
    <div className={styles.calcSidebar}>
      <button onClick={onClose} className={styles.closeButton}>
        <IoClose />
      </button>
      <h1>Product List with Discounts</h1>

      {/* Add Product Form */}
      <form onSubmit={addProduct} style={{ marginBottom: "20px" }}>
        <div>
          <label>
            <input
              type="text"
              name="name"
              value={form.name}
              placeholder="Product Name"
              onChange={handleInputChange}
              required
              style={{ margin: "5px", padding: "5px", width: "200px" }}
            />
          </label>
        </div>
        <div>
          <label>
            <input
              type="number"
              name="price"
              value={form.price}
              placeholder="Product Price"
              onChange={handleInputChange}
              required
              step="0.01"
              style={{ margin: "5px", padding: "5px", width: "200px" }}
            />
          </label>
        </div>
        <button
          type="submit"
          style={{
            marginTop: "10px",
            padding: "10px",
            backgroundColor: "blue",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Add Product
        </button>
      </form>

      {/* Discount Inputs */}
      <h2>Set Discounts</h2>
      <div style={{ marginBottom: "20px" }}>
        <div>
          <label>
            <input
              type="number"
              name="discount1"
              placeholder=" :percantge Off"
              // value={discountInputs.discount1}
              onChange={handleDiscountInputChange}
              style={{ margin: "5px", padding: "5px", width: "200px" }}
            />
          </label>
        </div>
        <div>
          <label>
            <input
              type="number"
              name="discount2"
              placeholder=" flat amount  Off:"
              // value={discountInputs.discount2}
              onChange={handleDiscountInputChange}
              style={{ margin: "5px", padding: "5px", width: "200px" }}
            />
          </label>
        </div>
        <div>
          <label>
            <div>
              <input
                type="number"
                placeholder="Buy x"
                // value={discountInputs.discount3.buy}
                onChange={(e) =>
                  setDiscountInputs({
                    ...discountInputs,
                    discount3: {
                      ...discountInputs.discount3,
                      buy: parseInt(e.target.value) || 0,
                    },
                  })
                }
                style={{ margin: "5px", padding: "5px", width: "80px" }}
              />
              <input
                type="number"
                placeholder="Get y"
                // value={discountInputs.discount3.get}
                onChange={(e) =>
                  setDiscountInputs({
                    ...discountInputs,
                    discount3: {
                      ...discountInputs.discount3,
                      get: parseInt(e.target.value) || 0,
                    },
                  })
                }
                style={{ margin: "5px", padding: "5px", width: "80px" }}
              />
            </div>
          </label>
        </div>
        <div>
          <label>
            <input
              type="text"
              name="discount4"
              placeholder="specific percantege per index (Index:Percentage, e.g., 0:10,1:20):"
              value={discountInputs.discount4}
              onChange={handleDiscountInputChange}
              style={{ margin: "5px", padding: "5px", width: "400px" }}
            />
          </label>
        </div>
        <button
          onClick={applyAllDiscounts}
          style={{ marginTop: "10px", padding: "10px 20px" }}
        >
          Apply All Discounts
        </button>
      </div>
      {/* Display Products */}
      <div className={styles.productList}>
        <h2>Sorted Products (After Discounts)</h2>
        {/* <h3>total percantage off {percentage}</h3> */}
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
                <span>${product.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No products added yet.</p>
        )}
      </div>
    </div>
  );
}
