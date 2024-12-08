"use client";

import { IoClose } from "react-icons/io5";
import AddProduct from "./AddProduct";
import Discount from "./Discounts";
import ProductList from "./ProductsList";
import { useEffect, useState } from "react";
import { DiscountInputs, Product } from "./types";
import styled from "styled-components";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

const Sidebar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 25%;
  height: 100vh;
  background-color: #f9f9f9;
  border-right: 1px solid #ddd;
  padding: 20px;
  overflow-y: auto;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 10000;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: linear-gradient(to right, #b346e8, #87cdfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 18px;
  border-radius: 50%;
  cursor: pointer;
  padding: 5px;
`;

const HeadLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;

const Title = styled.h1`
  font-size: 20px;
  background: linear-gradient(to right, #b346e8, #87cdfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Section = styled.div`
  margin-top: 20px;
`;

const DropDown = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background: linear-gradient(to right, #b346e8, #87cdfa);
  padding: 10px;
  border-radius: 20px;
`;

const Icon = styled.div`
  margin-left: 10px;
`;

export default function CalcPage({ onClose }: { onClose: () => void }) {
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
    <Sidebar>
      <CloseButton onClick={onClose}>
        <IoClose />
      </CloseButton>
      <HeadLine onClick={toggleExplanationSection}>
        <Title>מחשבון ההטבות שלי</Title>
        {isExplanationSectionOpen ? (
          <Icon><FaChevronDown /></Icon>
        ) : (
          <Icon><FaChevronRight /></Icon>
        )}
      </HeadLine>
      {isExplanationSectionOpen && (
        <Section>
          <h3>
            בעזרת המחשבון שלנו תוכלו לחשב את המחיר היחסי של כל מוצר בהתאם להנחות
            שהזנתם.
          </h3>
          <p>
            <strong>כיצד להשתמש במחשבון:</strong>
          </p>
          <ul>
            <li>
              <strong>הוסיפו מוצרים:</strong> לחצו על כפתור "הוסף מוצר" והזינו
              את שם המוצר והמחיר המקורי שלו.
            </li>
            <li>
              <strong>הוסיפו הנחות:</strong> לחצו על כפתור "הוסף הנחה" כדי
              להגדיר הנחות באחוזים , בסכום כספי ומבצע מיוחד.
            </li>
            <li>
              <strong>חשבו את המחירים:</strong> המחשבון יציג את המחירים
              המעודכנים של כל מוצר בהתחשב בהנחות שהזנתם.
            </li>
          </ul>
        </Section>
      )}
      {/* Toggle AddProduct Section */}
      <Section>
        <DropDown onClick={toggleProductSection}>
          <h2>הוספת מוצרים</h2>
          <Icon><FaChevronDown /></Icon>
        </DropDown>
        {isProductSectionOpen && <AddProduct onAddProduct={addProduct} />}
      </Section>

      <Section>
        <DropDown onClick={toggleDiscountSection}>
          <h2>הוספת הנחות</h2>
          <Icon><FaChevronDown /></Icon>
        </DropDown>
        {isDiscountSectionOpen && (
          <Discount onApplyDiscounts={applyDiscounts} />
        )}
      </Section>
      <Section>
        <DropDown onClick={toggleProductList}>
          <h2>רשימת מוצרים הסופית</h2>
          <Icon><FaChevronDown /></Icon>
        </DropDown>
        {isProductListOpen && (
          <ProductList products={products} handleDelete={handleDelete} />
        )}
      </Section>
    </Sidebar>
  );
}
