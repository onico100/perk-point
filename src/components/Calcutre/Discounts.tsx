import { useState } from "react";
import { DiscountInputs } from "./types";

interface Props {
  onApplyDiscounts: (discounts: DiscountInputs) => void;
}

export default function Discount({ onApplyDiscounts }: Props) {
  const [discountInputs, setDiscountInputs] = useState<DiscountInputs>({
    discount1: 0,
    discount2: 0,
    discount3: { buy: 0, get: 0 },
    discount4: "",
  });

  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDiscountInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleDiscountChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "buy" | "get"
  ) => {
    const value = parseInt(e.target.value) || 0;
    setDiscountInputs((prev) => ({
      ...prev,
      discount3: { ...prev.discount3, [field]: value },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(discountInputs);
    onApplyDiscounts(discountInputs);
    setActiveLabel(null); // Close all inputs on submit
  };

  const toggleActiveLabel = (label: string) => {
    setActiveLabel((prev) => (prev === label ? null : label)); // Toggle visibility
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <h1>בחר הנחות</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label onClick={() => toggleActiveLabel("discount1")}>
            אחוז הנחה קבע על כל המוצרים
          </label>
          {activeLabel === "discount1" && (
            <input
              type="number"
              name="discount1"
              value={discountInputs.discount1}
              placeholder="אחוז ההנחה"
              onChange={handleInputChange}
            />
          )}
        </div>
        <div>
          <label onClick={() => toggleActiveLabel("discount2")}>
            סכום קבוע היורד מהקנייה (קנה בx שלם y)
          </label>
          {activeLabel === "discount2" && (
            <input
              type="number"
              name="discount2"
              placeholder="הסכום שיורד"
              value={discountInputs.discount2}
              onChange={handleInputChange}
            />
          )}
        </div>
        <div>
          <label onClick={() => toggleActiveLabel("discount3")}>
            קנה x מוצרים וקבל y מוצרים חינם(1+1)
          </label>
          {activeLabel === "discount3" && (
            <>
              <input
                type="number"
                placeholder="קנה x"
                value={discountInputs.discount3.buy}
                onChange={(e) => handleDiscountChange(e, "buy")}
              />
              <input
                type="number"
                placeholder="קבל y"
                value={discountInputs.discount3.get}
                onChange={(e) => handleDiscountChange(e, "get")}
              />
            </>
          )}
        </div>
        <div>
          <label onClick={() => toggleActiveLabel("discount4")}>
            הנחה ספיציפית לפי מספר המוצר (הראשון ב20% השני ב30% וכו)
          </label>
          {activeLabel === "discount4" && (
            <input
              type="text"
              name="discount4"
              placeholder="הנחה ספיציפית לפי מספר המוצר (0:10)"
              onChange={handleInputChange}
            />
          )}
        </div>
        <button type="submit">חשב</button>
      </form>
    </div>
  );
}
