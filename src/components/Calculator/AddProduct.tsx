import { useState } from "react";
import { Form, InputContainer, Input, SubmitButton } from './Calculator.Styles'; 


type ProductForm = {
  name: string;
  price: string;
};

interface Props {
  onAddProduct: (name: string, price: number) => void;
}

export default function AddProduct({ onAddProduct }: Props) {
  const [form, setForm] = useState<ProductForm>({ name: "", price: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(form.price);
    if (form.name && !isNaN(price)) {
      onAddProduct(form.name, price);
      setForm({ name: "", price: "" });
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <InputContainer>
        <label>
          <Input
            type="text"
            name="name"
            value={form.name}
            placeholder="שם המוצר"
            onChange={handleInputChange}
            required
          />
        </label>
      </InputContainer>
      <InputContainer>
        <label>
          <Input
            type="number"
            name="price"
            value={form.price}
            placeholder="מחיר המוצר"
            onChange={handleInputChange}
            required
            step="0.01"
          />
        </label>
      </InputContainer>
      <SubmitButton type="submit">הוסף מוצר</SubmitButton>
    </Form>
  );
}
