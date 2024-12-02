type Product = { name: string; price: number; };

export const calcPercentageOff = (percentage: number, productsArr: Product[]) => productsArr.map((product) => ({ ...product, price: product.price - (product.price * percentage) / 100 }));
