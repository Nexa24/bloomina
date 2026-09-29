import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useWishlist } from '@/hooks/use-wishlist';
import { useCart } from '@/hooks/use-cart';

export interface ColorConfig {
  name: string;
  hex: string;
  images?: string[];
}

export interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  comparePrice?: number | string;
  image: string;
  category?: string;
  colorConfigs?: ColorConfig[];
  variants?: { name: string; values: string[] }[];
  rating?: number;
  reviewCount?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  price,
  comparePrice,
  image,
  category = 'Collection',
  colorConfigs = [],
  variants = [],
  rating,
  reviewCount
}) => {
  const { addItem: addWishlist, removeItem: removeWishlist, isInWishlist } = useWishlist();
  const { addItem: addCart } = useCart();
  const isFavorite = isInWishlist(id);

  // Color selection state
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isAddedToast, setIsAddedToast] = useState(false);

  // Extract sizes from variants
  const sizeVariant = variants.find(v => (v.name || '').toLowerCase() === 'size');
  const availableSizes = sizeVariant?.values || ['S', 'M', 'L', 'XL'];

  // Keep front image constant as before
  const activeImage = image || 'https://placehold.co/600x800?text=No+Image';

  // Genuine reviews only
  const hasReviews = reviewCount !== undefined && reviewCount > 0;
  const displayRating = hasReviews ? Number(rating || 5) : 0;
  const displayReviewsCount = hasReviews ? Number(reviewCount) : 0;

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite) {
      removeWishlist(id);
    } else {
      addWishlist({ id, name: title, price, image: activeImage, category });
    }
  };

  const handleQuickAdd = (e: React.MouseEvent, sizeChoice?: string) => {
    e.preventDefault();
    e.stopPropagation();

    const chosenSize = sizeChoice || selectedSize || availableSizes[0] || 'Regular';
    const chosenColor = colorConfigs?.[selectedColorIdx]?.name || '';

    addCart({
      id: `${id}-${chosenSize}-${chosenColor || 'default'}`,
      productId: id,
      name: title,
      price: Number(price),
      quantity: 1,
      image: activeImage,
      size: chosenSize,
      color: chosenColor,
    });

    setIsAddedToast(true);
    setShowQuickAdd(false);
    setTimeout(() => setIsAddedToast(false), 2200);
  };

  return (
    <div className="group relative block animate-fade-in text-left">
      {/* Product Image Frame */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl md:rounded-[2rem] bg-stone-100 transition-all duration-700 group-hover:shadow-[0_24px_50px_-15px_rgba(241,145,161,0.28)]">
        <Link href={`/product/${id}`} className="block w-full h-full">
          <Image
            src={activeImage}
            alt={title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>



        {/* Wishlist Button */}
        <button 
          onClick={toggleWishlist}
          title={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 z-20 ${
            isFavorite ? 'bg-primary text-white shadow-md' : 'bg-white/70 text-surface-on-variant hover:bg-white hover:text-primary shadow-xs'
          }`}
        >
          <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0" }}>
            favorite
          </span>
        </button>

        {/* Quick Add Overlay Trigger */}
        <div className="absolute bottom-3 left-3 right-3 z-20">
          {!showQuickAdd ? (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowQuickAdd(true);
              }}
              className="w-full py-2.5 px-3 bg-white/95 backdrop-blur-md hover:bg-primary hover:text-white text-surface-on rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-300 shadow-md flex items-center justify-center gap-1.5 opacity-90 group-hover:opacity-100 hover:scale-[1.01]"
            >
              <span className="material-symbols-outlined text-sm">shopping_bag</span>
              <span>Quick Add</span>
            </button>
          ) : (
            <div 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              className="bg-white/95 backdrop-blur-md p-2.5 rounded-2xl shadow-xl border border-stone-200/80 animate-scale-in"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-bold uppercase tracking-widest text-stone-500">Pick Size</span>
                <button
                  type="button"
                  onClick={() => setShowQuickAdd(false)}
                  className="text-stone-400 hover:text-stone-700 text-xs font-bold leading-none p-1"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {availableSizes.slice(0, 8).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={(e) => handleQuickAdd(e, s)}
                    className="py-1.5 text-[10px] font-bold rounded-lg border border-stone-200 hover:border-primary hover:bg-primary hover:text-white transition-all text-surface-on text-center"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Added to Bag Toast confirmation */}
        {isAddedToast && (
          <div className="absolute inset-x-3 top-12 z-30 p-2 bg-emerald-600 text-white rounded-xl text-center text-[10px] font-bold uppercase tracking-widest shadow-lg animate-fade-in flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-xs">check_circle</span>
            <span>Added to Cart!</span>
          </div>
        )}
      </div>

      {/* Product Details Section */}
      <div className="mt-3.5 space-y-1.5 px-1">
        {/* Available Color Swatches */}
        {colorConfigs && colorConfigs.length > 0 && (
          <div className="flex items-center gap-1.5 pb-0.5">
            {colorConfigs.slice(0, 5).map((color, idx) => (
              <button
                key={idx}
                type="button"
                title={color.name || `Color ${idx + 1}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedColorIdx(idx);
                }}
                className={`w-4 h-4 rounded-full p-0.5 transition-all ${
                  selectedColorIdx === idx 
                    ? 'ring-2 ring-primary ring-offset-1 scale-110' 
                    : 'hover:scale-110 opacity-80 hover:opacity-100'
                }`}
              >
                <span 
                  className="block w-full h-full rounded-full border border-black/15 shadow-2xs" 
                  style={{ backgroundColor: color.hex || '#E5E7EB' }} 
                />
              </button>
            ))}
            {colorConfigs.length > 5 && (
              <span className="text-[9px] font-semibold text-stone-400 ml-0.5">
                +{colorConfigs.length - 5}
              </span>
            )}
          </div>
        )}

        {/* Genuine Star Rating & Review Count or No Reviews */}
        {hasReviews ? (
          <div className="flex items-center gap-1.5 text-amber-500">
            <div className="flex items-center text-xs">
              <span className="material-symbols-outlined text-sm font-light fill-1 text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
            </div>
            <span className="text-[11px] font-bold text-stone-800">
              {displayRating.toFixed(1)}
            </span>
            <span className="text-[10px] text-stone-400 font-normal">
              ({displayReviewsCount})
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1 py-0.5">
            <span className="text-[10px] font-normal text-stone-400 italic">
              No reviews
            </span>
          </div>
        )}

        {/* Title */}
        <Link href={`/product/${id}`} className="block group-hover:text-primary transition-colors">
          <h3 className="text-xs md:text-sm font-sans font-medium text-surface-on line-clamp-1 tracking-tight capitalize">
            {title}
          </h3>
        </Link>

        {/* Price & MRP */}
        <div className="flex items-baseline gap-2 pt-0.5">
          <p className="text-sm md:text-base font-price font-bold text-surface-on">
            ₹{Number(price).toLocaleString('en-IN')}
          </p>
          {comparePrice && Number(comparePrice) > Number(price) && (
            <span className="text-xs font-price text-stone-400 line-through">
              ₹{Number(comparePrice).toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
