import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, title, price, image, category }) => {
  return (
    <Link href={`/product/${id}`} className="group block animate-fade-in">
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-surface-container-low transition-all duration-500 group-hover:petal-shadow">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-primary border border-white/50">
            {category}
          </span>
        </div>
      </div>
      
      <div className="mt-6 text-center space-y-1">
        <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-surface-on-variant/70 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-lg font-display font-medium text-surface-on">
          ₹{price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
