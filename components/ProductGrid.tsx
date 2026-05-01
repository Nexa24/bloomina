import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = () => {
  // Mock data for the boilerplate
  const products = Array.from({ length: 8 }).map((_, i) => ({
    id: `${i + 1}`,
    title: `Premium Bloom ${i + 1}`,
    price: 1299 + (i * 100),
    image: `https://lh3.googleusercontent.com/aida-public/AB6AXuBTbghw_WZVzhd9DKApPxJcoUK9cwJkf44QoDbHoRjTRnubMMge4zVDFV4aKhYlPUZNpOupfdzT_0TFOc5M6oK763b3jWnP3FX8u0mOjZs3PFlSuFUrwyW4_flxdqhvotNurlXfZlqgu9fsu5PAuM8dAy-TskCzImUd_-ghDraPg07vOihUfj8zdinMGOjJgvlkxSv-3v0qUaYWyUveFWSIXwp6uyeh7Wq5XildCnMHdWUN0Mar7Gjox8ZGa_kkMAJD0mIuDs0er5Y`, // Soft pink aesthetic placeholder
    category: i % 2 === 0 ? 'Innerwear' : 'Lounge',
  }));

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          {...product}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
