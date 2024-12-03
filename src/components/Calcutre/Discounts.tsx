// components/DiscountForm.tsx

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
    onApplyDiscounts(discountInputs);
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <h2>בחר הנחות</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            1
            <input
              type="number"
              name="discount1"
              placeholder="אחוז ההנחה"
              value={discountInputs.discount1}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            2
            <input
              type="number"
              name="discount2"
              placeholder="סכום קבוע"
              value={discountInputs.discount2}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            3
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
          </label>
        </div>
        <div>
          <label>
            4
            <input
              type="text"
              name="discount4"
              placeholder="הנחה ספיציפית לפי מספר המוצר (0:10)"
              value={discountInputs.discount4}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <button type="submit">חשב</button>
      </form>
    </div>
  );
}
