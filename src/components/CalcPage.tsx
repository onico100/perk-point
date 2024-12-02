"use client";

import { useState } from "react";
import styles from "@/styles/Calc.module.css";

type Product = {
  name: string;
  price: number;
};

export default function CakcPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({ name: "", price: "" });
  const [discountInputs, setDiscountInputs] = useState({
    discount1: 0,
    discount2: 0,
    discount3: { buy: 0, get: 0 },
    discount4: "",
  });
  const [selectedDiscounts, setSelectedDiscounts] = useState<string[]>([]);

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

  const toggleDiscount = (discount: string) => {
    setSelectedDiscounts((prev) =>
      prev.includes(discount)
        ? prev.filter((d) => d !== discount)
        : [...prev, discount]
    );
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

  const sumPriceProducts = (
    products: Product[],
    indexStart: number,
    endIndex: number
  ) => {
    return products
      .slice(indexStart, endIndex)
      .reduce((sum, p) => sum + p.price, 0);
  };

  const applyPercentageOff = (percentage: number) => {
    const updatedProducts = products.map((product) => ({
      ...product,
      price: product.price - (product.price * percentage) / 100,
    }));
    setProducts(updatedProducts);
  };

  const applyFlatOff = (amount: number) => {
    const sumAll = sumPriceProducts(products, 0, products.length);
    const percentage = (amount / sumAll) * 100;
    applyPercentageOff(percentage);
  };

  const applyBuySomeGetSome = (buy: number, get: number) => {
    const sumNotPaying = sumPriceProducts(products, buy, buy + get + 1);
    applyFlatOff(sumNotPaying);
  };

  const applyDiscount4 = () => {
    const discounts = discountInputs.discount4.split(",").map((entry) => {
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

    setProducts(updatedProducts);
  };

  const applySelectedDiscounts = () => {
    selectedDiscounts.forEach((discount) => {
      switch (discount) {
        case "discount1":
          applyPercentageOff(discountInputs.discount1);
          break;
        case "discount2":
          applyFlatOff(discountInputs.discount2);
          break;
        case "discount3":
          applyBuySomeGetSome(
            discountInputs.discount3.buy,
            discountInputs.discount3.get
          );
          break;
        case "discount4":
          applyDiscount4();
          break;
        default:
          break;
      }
    });
  };

  return (
    <div className={styles.calcSidebar}>
      {/* Add Product Form */}
      <form onSubmit={addProduct} style={{ marginBottom: "20px" }}>
        <div>
          <label>
            Product Name:
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              required
              style={{ margin: "5px", padding: "5px", width: "200px" }}
            />
          </label>
        </div>
        <div>
          <label>
            Product Price:
            <input
              type="number"
              name="price"
              value={form.price}
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
      <div>
        {[
          { label: "Discount 1 (% Off)", name: "discount1" },
          { label: "Discount 2 ($ Off)", name: "discount2" },
          { label: "Discount 3 (Buy X, Get Y Free)", name: "discount3" },
          { label: "Discount 4 (Custom)", name: "discount4" },
        ].map((discount) => (
          <div key={discount.name}>
            <input
              type="checkbox"
              checked={selectedDiscounts.includes(discount.name)}
              onChange={() => toggleDiscount(discount.name)}
            />
            <label>{discount.label}</label>
          </div>
        ))}
        <button
          onClick={applySelectedDiscounts}
          style={{
            marginTop: "10px",
            padding: "10px",
            backgroundColor: "green",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Apply Selected Discounts
        </button>
      </div>

      <div className={styles.productList}>
        <h2>Sorted Products (After Discounts)</h2>
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
