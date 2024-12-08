import { useState } from "react";
import { DiscountInputs } from "./types";
import styled from "styled-components";


const Container = styled.div`
  margin-bottom: 20px;
`;

const Title = styled.h3`
  font-size: 20px;
`;

const Label = styled.label`
  cursor: pointer;
  display: block;
  margin: 10px 0;
  font-weight: bold;
  color: #333;
  transition: color 0.3s ease;

  &:hover {
    color: #b346e8;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Button = styled.button`
  margin-top: 10px;
  padding: 10px 15px;
  background-color: #b346e8;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #9a2bc1;
  }
`;

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
    const value = Number(e.target.value); // Using Number to convert input to a number
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
    <Container>
      <Title>בחר הנחות:</Title>
      <form onSubmit={handleSubmit}>
        <div>
          <Label onClick={() => toggleActiveLabel("discount1")}>
            אחוז הנחה קבוע על כל המוצרים
          </Label>
          {activeLabel === "discount1" && (
            <Input
              type="number"
              name="discount1"
              value={discountInputs.discount1}
              placeholder="אחוז ההנחה"
              onChange={handleInputChange}
            />
          )}
        </div>
        <div>
          <Label onClick={() => toggleActiveLabel("discount2")}>
            סכום קבוע היורד מהקנייה (קנה בx שלם y)
          </Label>
          {activeLabel === "discount2" && (
            <Input
              type="number"
              name="discount2"
              placeholder="הסכום שיורד"
              value={discountInputs.discount2}
              onChange={handleInputChange}
            />
          )}
        </div>
        <div>
          <Label onClick={() => toggleActiveLabel("discount3")}>
            קנה x מוצרים וקבל y מוצרים חינם(1+1)
          </Label>
          {activeLabel === "discount3" && (
            <>
              <Input
                type="number"
                placeholder="קנה x"
                value={discountInputs.discount3.buy}
                onChange={(e) => handleDiscountChange(e, "buy")}
              />
              <Input
                type="number"
                placeholder="קבל y"
                value={discountInputs.discount3.get}
                onChange={(e) => handleDiscountChange(e, "get")}
              />
            </>
          )}
        </div>
        <div>
          <Label onClick={() => toggleActiveLabel("discount4")}>
            הנחה ספיציפית לפי מספר המוצר (הראשון ב20% השני ב30% וכו)
          </Label>
          {activeLabel === "discount4" && (
            <Input
              type="text"
              name="discount4"
              placeholder="הנחה ספיציפית לפי מספר המוצר (0:10)"
              onChange={handleInputChange}
            />
          )}
        </div>
        <Button type="submit">חשב</Button>
      </form>
    </Container>
  );
}
