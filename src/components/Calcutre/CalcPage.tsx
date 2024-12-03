"use client";

import { IoClose } from "react-icons/io5";
import AddProduct from "./AddProduct";
import Discount from "./Discounts";
import ProductList from "./ProductsList";
import { useEffect, useState } from "react";
import { DiscountInputs, Product } from "./types";
import styles from "@/styles/Calc.module.css";
import { FaSearch, FaChevronDown } from "react-icons/fa";

export default function CakcPage({ onClose }: { onClose: () => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [discountInputs, setDiscountInputs] = useState<DiscountInputs>({
    discount1: 0,
    discount2: 0,
    discount3: { buy: 0, get: 0 },
    discount4: "",
  });

  // States to control visibility of sections
  const [isProductSectionOpen, setProductSectionOpen] = useState(false);
  const [isDiscountSectionOpen, setDiscountSectionOpen] = useState(false);
  const [isProductListOpen, setProductListOpen] = useState(false);
  const [isExplanationSectionOpen, setExplanationSectionOpen] = useState(true);

  useEffect(() => {
    applyAllDiscounts();
  }, [discountInputs]);

  const addProduct = (name: string, price: number) => {
    setProducts((prev) => {
      const updatedProducts = [...prev, { name, price }];
      return updatedProducts.sort((a, b) => b.price - a.price);
    });
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
    console.log("Applingg");
    applyPercentageOff(discountInputs.discount1);
  };

  const applyDiscount2 = () => applyFlatOff(discountInputs.discount2);

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

  const applyDiscounts = async (Inputs: DiscountInputs) => {
    setDiscountInputs(Inputs); // Update the state
  };

  const handleDelete = (productName: string) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.name !== productName)
    );
  };

  // Functions to toggle visibility of sections
  const toggleProductSection = () =>
    setProductSectionOpen(!isProductSectionOpen);
  const toggleDiscountSection = () =>
    setDiscountSectionOpen(!isDiscountSectionOpen);
  const toggleProductList = () => setProductListOpen(!isProductListOpen);
  const toggleExplanationSection = () =>
    setExplanationSectionOpen(!isExplanationSectionOpen);

  return (
    <div className={styles.calcSidebar}>
      <button onClick={onClose} className={styles.closeButton}>
        <IoClose />
      </button>
      <h1 onClick={toggleExplanationSection}>מחשבון ההטבות שלי</h1>
      {isExplanationSectionOpen && (
        <p>הכנסו את כל המוצרים וההנחות, ואז קבלו חישוב סופי של המחיר.</p>
      )}

      {/* Toggle AddProduct Section */}
      <div className={styles.addProduct}>
        <div className={styles.dropDowns} onClick={toggleProductSection}>
          <h2>הוספת מוצרים</h2>
          <FaChevronDown className={styles.icon} />
        </div>
        {isProductSectionOpen && <AddProduct onAddProduct={addProduct} />}
      </div>

      {/* Toggle Discount Section */}
      <div className={styles.discountSection}>
        <div className={styles.dropDowns} onClick={toggleDiscountSection}>
          <h2>הוספת הנחות</h2>
          <FaChevronDown className={styles.icon} />
        </div>
        {isDiscountSectionOpen && (
          <Discount onApplyDiscounts={applyDiscounts} />
        )}
      </div>

      {/* Toggle Product List Section */}
      <div className={styles.dropDowns} onClick={toggleProductList}>
        <h2>רשימת מוצרים הסופית</h2>
        <FaChevronDown className={styles.icon} />
      </div>
      {isProductListOpen && (
        <ProductList products={products} handleDelete={handleDelete} />
      )}
    </div>
  );
}
