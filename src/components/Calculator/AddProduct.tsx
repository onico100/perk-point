import { useState } from "react";
import styled from "styled-components";

type ProductForm = {
  name: string;
  price: string;
};

interface Props {
  onAddProduct: (name: string, price: number) => void;
}

const Form = styled.form`
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
`;

const Button = styled.button`
  margin-top: 10px;
  padding: 10px;
  background-color: blue;
  color: white;
  border: none;
  cursor: pointer;
`;

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
      <div>
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
      </div>
      <div>
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
      </div>
      <Button type="submit">הוסף מוצר</Button>
    </Form>
  );
}
