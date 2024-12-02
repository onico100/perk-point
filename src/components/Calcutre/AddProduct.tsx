import { useState } from "react";

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
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <div>
        <label>
          <input
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
          <input
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
        הוסף מוצר
      </button>
    </form>
  );
}
