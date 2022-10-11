import React from "react";
import HomeImg from "../../../images/home.jpg";
import ProductsGrid from "../Product/ProductsGrid";

const Home = () => {
  return (
    <>
      {" "}
      <section className="bg-white dark:bg-gray-900">
        <div className="grid max-w-screen-xl px-4 pt-20 pb-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 lg:pt-28">
          <div className="mr-auto place-self-center lg:col-span-7">
            <h1 className="max-w-2xl mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl dark:text-white">
              Old Skool G-Funk
              <br />
              LifeStyle ☠️
            </h1>
            <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
              Set trippin is my favorite pastime Loc cause I'm crippin <br />
            </p>
          </div>
          <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
            <img src={HomeImg} alt="hero image" />
          </div>
        </div>
      </section>
      <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight text-center">
        Featured Products
      </h2>
      <ProductsGrid />
    </>
  );
};

export default Home;
