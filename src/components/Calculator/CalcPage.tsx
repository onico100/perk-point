"use client";

import { IoClose } from "react-icons/io5";
import AddProduct from "./AddProduct";
import Discount from "./Discounts";
import ProductList from "./ProductsList";
import { useEffect, useState } from "react";
import { DiscountInputs, Product } from "./types";
import {
  CalcSidebar,
  CloseButton,
  Headline,
  Dropdown,
  IconDown,
  IconRight,
  DiscountSection,
  AddProduct as StyledAddProduct,
} from './Calculator.Styles'


export default function CalcPage({ onClose }: { onClose: () => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [discountInputs, setDiscountInputs] = useState<DiscountInputs>({
    discount1: 0,
    discount2: 0,
    discount3: { buy: 0, get: 0 },
    discount4: "",
  });

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
    setDiscountInputs(Inputs);
  };

  const handleDelete = (productName: string) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.name !== productName)
    );
  };

  const toggleProductSection = () =>
    setProductSectionOpen(!isProductSectionOpen);
  const toggleDiscountSection = () =>
    setDiscountSectionOpen(!isDiscountSectionOpen);
  const toggleProductList = () => setProductListOpen(!isProductListOpen);
  const toggleExplanationSection = () =>
    setExplanationSectionOpen(!isExplanationSectionOpen);

  return (
    <CalcSidebar>
      <CloseButton onClick={onClose}>
        <IoClose />
      </CloseButton>
      <Headline onClick={toggleExplanationSection}>
        <h1>מחשבון ההטבות שלי</h1>
        {isExplanationSectionOpen ? (
          <IconDown />
        ) : (
          <IconRight />
        )}
      </Headline>
      {isExplanationSectionOpen && (
        <div>
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
        </div>
      )}
      <StyledAddProduct>
        <Dropdown onClick={toggleProductSection}>
          <h2>הוספת מוצרים</h2>
          {isProductSectionOpen ? <IconDown /> : <IconRight />} 
        </Dropdown>
        {isProductSectionOpen && <AddProduct onAddProduct={addProduct} />}
      </StyledAddProduct>

      <DiscountSection>
        <Dropdown onClick={toggleDiscountSection}>
          <h2>הוספת הנחות</h2>
          {isProductSectionOpen ? <IconDown /> : <IconRight />} 
        </Dropdown>
        {isDiscountSectionOpen && (
          <Discount onApplyDiscounts={applyDiscounts} />
        )}
      </DiscountSection>
      <Dropdown onClick={toggleProductList}>
        <h2>רשימת מוצרים הסופית</h2>
        {isProductSectionOpen ? <IconDown /> : <IconRight />} 
      </Dropdown>
      {isProductListOpen && (
          <ProductList products={products} handleDelete={handleDelete} />

      )}
    </CalcSidebar>
  );
}
