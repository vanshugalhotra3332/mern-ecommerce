import React from "react";
import ProductImg from "../../../images/pic.jpg";
import ProductCard from "./ProductCard";

const ProductsGrid = () => {
  const products = [
    {
      imageSrc: ProductImg,
      imageAlt: "",
      href: "",
      name: "Blue Rag",
      category: "Clothes",
      price: "$198",
    },
    {
      imageSrc: ProductImg,
      imageAlt: "",
      href: "",
      name: "Blue Rag",
      category: "Clothes",
      price: "$198",
    },
    {
      imageSrc: ProductImg,
      imageAlt: "",
      href: "",
      name: "Blue Rag",
      category: "Clothes",
      price: "$198",
    },
    {
      imageSrc: ProductImg,
      imageAlt: "",
      href: "",
      name: "Blue Rag",
      category: "Clothes",
      price: "$198",
    },
    {
      imageSrc: ProductImg,
      imageAlt: "",
      href: "",
      name: "Blue Rag",
      category: "Clothes",
      price: "$198",
    },
    {
      imageSrc: ProductImg,
      imageAlt: "",
      href: "",
      name: "Blue Rag",
      category: "Clothes",
      price: "$198",
    },
    {
      imageSrc: ProductImg,
      imageAlt: "",
      href: "",
      name: "Blue Rag",
      category: "Clothes",
      price: "$198",
    },
  ];

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsGrid;
