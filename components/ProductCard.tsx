import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useWishlist } from '@/hooks/use-wishlist';

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  comparePrice?: number | string;
  image: string;
  category: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, title, price, comparePrice, image, category }) => {
  const { addItem, removeItem, isInWishlist } = useWishlist();
  const isFavorite = isInWishlist(id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite) {
      removeItem(id);
    } else {
      addItem({ id, name: title, price, image, category });
    }
  };

  return (
    <Link href={`/product/${id}`} className="group block animate-fade-in">
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-surface-container-low transition-all duration-500 group-hover:petal-shadow">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 flex flex-col items-start gap-1">
          <span className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-primary border border-white/50">
            {category}
          </span>
          <span className="bg-[#944555] text-white px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-md animate-pulse">
            BOGO 1+1 FREE
          </span>
        </div>
        <button 
          onClick={toggleWishlist}
          className={`absolute top-4 right-4 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 z-10 ${isFavorite ? 'bg-primary text-white shadow-lg' : 'bg-white/60 text-surface-on-variant hover:bg-white hover:text-primary'}`}
        >
          <span className={`material-symbols-outlined text-lg ${isFavorite ? 'fill-1' : ''}`} style={{ fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0" }}>
            favorite
          </span>
        </button>
      </div>
      
      <div className="mt-6 text-center space-y-1">
        <h3 className="text-xs md:text-sm font-sans font-medium text-surface-on-variant/90 group-hover:text-primary transition-colors tracking-tight capitalize">
          {title}
        </h3>
        <div className="flex items-baseline justify-center gap-2">
          <p className="text-lg font-price font-bold text-surface-on">
            ₹{Number(price).toLocaleString()}
          </p>
          {comparePrice && Number(comparePrice) > Number(price) && (
            <span className="text-sm font-price text-stone-400 line-through">
              ₹{Number(comparePrice).toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
