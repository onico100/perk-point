import { useState } from "react";
import { DiscountInputs } from "./types";
import {
  DiscountSection,
  InputContainer,
  Input,
  SubmitButton,
} from './Calculator.Styles';


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
    const value = Number(e.target.value); 
    setDiscountInputs((prev) => ({
      ...prev,
      discount3: { ...prev.discount3, [field]: value },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyDiscounts(discountInputs);
    setActiveLabel(null); 
  };

  const toggleActiveLabel = (label: string) => {
    setActiveLabel((prev) => (prev === label ? null : label)); 
  };

  return (
    <DiscountSection>
      <h3>בחר הנחות:</h3>
      <form onSubmit={handleSubmit}>
        <InputContainer>
          <label onClick={() => toggleActiveLabel("discount1")}>
            אחוז הנחה קבוע על כל המוצרים
          </label>
          {activeLabel === "discount1" && (
            <Input
              type="number"
              name="discount1"
              value={discountInputs.discount1 === 0 ? '' : discountInputs.discount1}
              placeholder="אחוז ההנחה"
              onChange={handleInputChange}
            />
          )}
        </InputContainer>
        <InputContainer>
          <label onClick={() => toggleActiveLabel("discount2")}>
            סכום קבוע היורד מהקנייה (קנה בx שלם y)
          </label>
          {activeLabel === "discount2" && (
            <Input
              type="number"
              name="discount2"
              placeholder="הסכום שיורד"
              value={discountInputs.discount2 === 0 ? '' : discountInputs.discount2}
              onChange={handleInputChange}
            />
          )}
        </InputContainer>
        <InputContainer>
          <label onClick={() => toggleActiveLabel("discount3")}>
            קנה x מוצרים וקבל y מוצרים חינם(1+1)
          </label>
          {activeLabel === "discount3" && (
            <>
              <Input
                type="number"
                placeholder="קנה x"
                value={discountInputs.discount3.buy === 0 ? '' : discountInputs.discount3.buy}
                onChange={(e) => handleDiscountChange(e, "buy")}
              />
              <Input
                type="number"
                placeholder="קבל y"
                value={discountInputs.discount3.get === 0 ? '' : discountInputs.discount3.get}
                onChange={(e) => handleDiscountChange(e, "get")}
              />
            </>
          )}
        </InputContainer>
        <InputContainer>
          <label onClick={() => toggleActiveLabel("discount4")}>
            הנחה ספיציפית לפי מספר המוצר (הראשון ב20% השני ב30% וכו)
          </label>
          {activeLabel === "discount4" && (
            <Input
              type="text"
              name="discount4"
              placeholder="הנחה ספיציפית לפי מספר המוצר (0:10)"
              onChange={handleInputChange}
            />
          )}
        </InputContainer>
        <SubmitButton type="submit">חשב</SubmitButton>
      </form>
    </DiscountSection>
  );
}
