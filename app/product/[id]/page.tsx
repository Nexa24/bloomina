'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';
import { supabase } from '@/lib/supabase';
import ProductReviews from '@/components/ProductReviews';

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;
  
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  
  const { addItem } = useCart();
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (productError) throw productError;
        
        // Separately fetch material if it exists
        if (productData.material_id) {
          const { data: materialData } = await supabase
            .from('materials')
            .select('*')
            .eq('id', productData.material_id)
            .single();
          
          if (materialData) {
            productData.materials = materialData;
          }
        }

        // Separately fetch size guide if it exists
        if (productData.size_guide_id) {
          const { data: guideData } = await supabase
            .from('size_guides')
            .select('*')
            .eq('id', productData.size_guide_id)
            .single();
          
          if (guideData) {
            productData.sizeGuide = guideData;
          }
        }

        setProduct(productData);
      } catch (err) {
        console.error('Failed to fetch product:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Dynamically get images based on selected color
  const currentImages = useMemo(() => {
    if (!product) return [];
    const config = product.colorConfigs?.[selectedColorIndex];
    if (config && config.images && config.images.length > 0) {
      return config.images;
    }
    return product.images || [];
  }, [product, selectedColorIndex]);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || currentImages.length <= 1) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setActiveImageIndex((prev) => (prev + 1) % currentImages.length);
    } else if (isRightSwipe) {
      setActiveImageIndex((prev) => (prev - 1 + currentImages.length) % currentImages.length);
    }
  };

  const availableSizes = useMemo(() => {
    return product?.variants?.find((v: any) => v.name === 'Size')?.values || [];
  }, [product]);

  const guideSizes = useMemo(() => {
    if (!product?.sizeGuide?.chart_data) return [];
    const chartRows = product.sizeGuide.chart_data;
    if (!Array.isArray(chartRows) || chartRows.length === 0) return [];
    return chartRows.map((row: any) => {
      const keys = Object.keys(row);
      const sizeKey = keys.find(k => k.toLowerCase() === 'size') || keys[0];
      return row[sizeKey];
    }).filter(Boolean);
  }, [product]);

  const sizes = useMemo(() => {
    if (guideSizes.length > 0) {
      return [...new Set([...guideSizes, ...availableSizes])];
    }
    return availableSizes;
  }, [guideSizes, availableSizes]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize) {
      setSizeError(true);
      const sizeSelectorEl = document.getElementById('size-selector');
      if (sizeSelectorEl) {
        sizeSelectorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    setSizeError(false);
    
    const colorName = product.colorConfigs?.[selectedColorIndex]?.name || 'Default';
    const cartItemId = `${id}-${selectedSize}-${colorName}`;
    addItem({
      id: cartItemId,
      productId: id,
      name: product.name,
      price: product.price,
      quantity,
      image: currentImages[0],
      size: selectedSize,
      color: colorName
    });
    
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 3000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    if (!selectedSize) {
      setSizeError(true);
      const sizeSelectorEl = document.getElementById('size-selector');
      if (sizeSelectorEl) {
        sizeSelectorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    setSizeError(false);

    const colorName = product.colorConfigs?.[selectedColorIndex]?.name || 'Default';
    const cartItemId = `${id}-${selectedSize}-${colorName}`;
    const buyNowItem = {
      id: cartItemId,
      productId: id,
      name: product.name,
      price: product.price,
      quantity,
      image: currentImages[0],
      size: selectedSize,
      color: colorName
    };
    sessionStorage.setItem('buyNowItem', JSON.stringify(buyNowItem));
    router.push('/checkout?buyNow=true');
  };

  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  const isFavorite = isInWishlist(id);

  const toggleWishlist = () => {
    if (isFavorite) {
      removeFromWishlist(id);
    } else {
      addToWishlist({
        id,
        name: product.name,
        price: product.price,
        image: currentImages[0],
        category: product.categories?.[0] || 'Collection'
      });
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-pulse text-primary font-display text-xl">Loading Bloomina Piece...</div>
    </div>;
  }

  if (!product) {
    return <div className="min-h-screen flex flex-col items-center justify-center bg-white space-y-4">
      <h2 className="text-2xl font-display">Product Not Found</h2>
      <link href="/" className="text-primary underline">Return to Shop</link>
    </div>;
  }


  const categories = Array.isArray(product.categories) ? product.categories : [product.categories || 'Uncategorized'];
  
  const mainCategoriesList = ['Bras', 'Panties', 'Sale%', 'Innerwear', 'Bestsellers', 'Combo Packs'];
  const mainCat = categories.find(c => mainCategoriesList.includes(c)) || categories[0];
  const subCat = categories.find(c => c !== mainCat && c !== 'Uncategorized');

  const isBra = 
    /bra/i.test(product.name || '') || 
    categories.some((c: string) => /bra/i.test(c)) || 
    (product.sizeGuide?.name && /bra/i.test(product.sizeGuide.name));

  const isPantie = 
    /pantie|panties|panty|brief/i.test(product.name || '') || 
    categories.some((c: string) => /pantie|panties|panty|brief/i.test(c)) || 
    (product.sizeGuide?.name && /pantie|panties|panty|brief/i.test(product.sizeGuide.name));

  // Prioritize the linked sizeGuide name, fall back to product category
  const sizeGuideImage = 
    (product.sizeGuide?.name && /bra/i.test(product.sizeGuide.name)) ? '/how-to-measure_bra.png' :
    (product.sizeGuide?.name && /pantie|panties|panty|brief/i.test(product.sizeGuide.name)) ? '/how-to-measure_pantie.png' :
    isBra ? '/how-to-measure_bra.png' :
    isPantie ? '/how-to-measure_pantie.png' :
    '/how-to-measure.png';

  return (
    <div className="bg-white min-h-screen antialiased overflow-x-hidden">
      <main className="pb-32 w-full">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 pt-4 md:pt-6 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20">
          
          {/* Left: Sticky Image Gallery */}
          <div className="w-full space-y-4 lg:sticky lg:top-32 self-start">
            <div 
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden bg-surface-container-low petal-shadow group"
            >
              <Image 
                key={`${selectedColorIndex}-${activeImageIndex}`}
                src={currentImages[activeImageIndex] || currentImages[0] || 'https://placehold.co/600x800?text=No+Image'} 
                alt={product.name} 
                fill 
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-all duration-700 group-hover:scale-105"
                priority
              />
            </div>
            
            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {currentImages.map((img: string, idx: number) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${activeImageIndex === idx ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <Image src={img} alt={`View ${idx}`} fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col space-y-8 py-4 w-full min-w-0">
            <div className="space-y-3">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary whitespace-nowrap">{mainCat}</span>
                {subCat && (
                  <>
                    <span className="text-[10px] font-bold text-primary/20">/</span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/60 whitespace-nowrap">{subCat}</span>
                  </>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-dmsans font-bold text-surface-on tracking-tight leading-tight">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-3">
                <p className="text-2xl font-price font-bold text-primary">₹{parseFloat(product.price).toLocaleString('en-IN')}.00</p>
                {(product.comparePrice || product.original_price || product.mrp) && 
                  parseFloat(product.comparePrice || product.original_price || product.mrp) > parseFloat(product.price) && (
                  <span className="text-lg font-price text-stone-400 line-through">
                    ₹{parseFloat(product.comparePrice || product.original_price || product.mrp).toLocaleString('en-IN')}.00
                  </span>
                )}
              </div>
            </div>

            {/* Color Selector moved to top */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-surface-on/40">Select Color</h3>
                <span className="text-xs font-medium text-surface-on-variant">
                  {product.colorConfigs?.[selectedColorIndex]?.name}
                </span>
              </div>
              <div className="flex gap-4">
                {product.colorConfigs?.map((color: any, idx: number) => (
                  <button 
                    key={idx}
                    onClick={() => {
                      setSelectedColorIndex(idx);
                      setActiveImageIndex(0); // Reset gallery to first image of new color
                    }}
                    className={`w-10 h-10 rounded-full p-0.5 border-2 transition-all ${selectedColorIndex === idx ? 'border-primary scale-110' : 'border-transparent hover:scale-105'}`}
                  >
                    <span className="block w-full h-full rounded-full border border-black/10" style={{ backgroundColor: color.hex }} />
                  </button>
                ))}
              </div>
            </div>

            <p className="text-surface-on-variant font-light leading-relaxed text-base max-w-lg">
              {product.description}
            </p>

            {/* Selection Controls */}
            <div className="space-y-10 pt-4">

              {/* Size Selector */}
              <div id="size-selector" className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-surface-on/40">Select Size</h3>
                    {sizeError && (
                      <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest animate-pulse">
                        (Select size first)
                      </span>
                    )}
                  </div>
                  {(product.sizeGuide || sizes.length > 0) && (
                    <button 
                      onClick={() => setShowSizeGuide(true)}
                      className="text-[10px] font-bold uppercase tracking-widest text-primary underline underline-offset-4 flex items-center gap-1 hover:text-primary/70 transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">straighten</span>
                      Size Guide
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {sizes.map((size: string) => {
                    const isAvailable = availableSizes.includes(size);
                    return (
                      <button 
                        key={size}
                        disabled={!isAvailable}
                        onClick={() => {
                          setSelectedSize(size);
                          setSizeError(false);
                        }}
                        className={`py-4 rounded-xl text-sm transition-all border ${
                          !isAvailable 
                            ? 'border-stone-200/40 text-surface-on-variant/30 opacity-30 cursor-not-allowed line-through bg-stone-50/20' 
                            : selectedSize === size 
                              ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                              : sizeError 
                                ? 'border-red-400 text-red-500 bg-red-50/5 hover:border-red-500 animate-pulse' 
                                : 'border-primary/10 text-surface-on-variant hover:border-primary/40'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity + Action Buttons */}
              <div className="flex flex-col gap-5 pt-4">

                {/* Quantity Stepper */}
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-surface-on/40">Quantity</h3>
                  <div className="flex items-center gap-0 bg-stone-50 rounded-2xl border border-stone-100 overflow-hidden">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-11 h-11 flex items-center justify-center text-surface-on/40 hover:text-primary hover:bg-primary/5 transition-all"
                    >
                      <span className="material-symbols-outlined text-lg">remove</span>
                    </button>
                    <span className="w-10 text-center text-sm font-bold text-surface-on tabular-nums">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="w-11 h-11 flex items-center justify-center text-surface-on/40 hover:text-primary hover:bg-primary/5 transition-all"
                    >
                      <span className="material-symbols-outlined text-lg">add</span>
                    </button>
                  </div>
                </div>

                {/* Row 1: Add to Cart + Wishlist */}
                <div className="flex gap-4">
                  <button 
                    onClick={handleAddToCart}
                    className={`flex-1 px-10 py-5 rounded-full font-bold uppercase tracking-[0.2em] text-[11px] transition-all duration-500 overflow-hidden relative border ${isAdded ? 'bg-green-500 border-green-500 text-white shadow-green-100' : 'border-primary text-primary hover:bg-primary/5 hover:scale-[1.02] active:scale-95'}`}
                  >
                    <span className={`flex items-center justify-center gap-2 transition-transform duration-500 ${isAdded ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
                      <span className="material-symbols-outlined text-base font-light">shopping_bag</span>
                      Add to Cart
                    </span>
                    <span className={`absolute inset-0 flex items-center justify-center gap-2 transition-transform duration-500 ${isAdded ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                      <span className="material-symbols-outlined text-base">check</span>
                      Added!
                    </span>
                  </button>
                  <button 
                    onClick={toggleWishlist}
                    className={`px-5 py-5 border rounded-full flex items-center justify-center transition-all ${isFavorite ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'border-primary/20 text-primary hover:bg-primary/5'}`}
                  >
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0" }}>
                      favorite
                    </span>
                  </button>
                </div>

                {/* Row 2: Buy Now — full width, solid primary */}
                <button
                  onClick={handleBuyNow}
                  className="w-full py-5 rounded-full bg-primary text-white font-bold uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-primary/25 hover:scale-[1.02] hover:shadow-primary/40 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base font-light">bolt</span>
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Material Details Section */}
        {product.materials && (
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-24 border-t border-stone-50 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
              <div className="lg:col-span-1 space-y-6">
                <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-primary/60 italic">Material Mastery</h2>
                <h3 className="text-4xl font-display font-light text-surface-on leading-tight">{product.materials.name}</h3>
                <p className="text-surface-on-variant font-light leading-relaxed">
                  {product.materials.description}
                </p>
              </div>
              
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                {product.materials.content?.map((item: any, idx: number) => (
                  <div key={idx} className="p-8 rounded-3xl bg-stone-50/50 border border-stone-100 flex flex-col gap-2 transition-all hover:petal-shadow group">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary group-hover:tracking-[0.3em] transition-all">{item.label}</span>
                    <span className="text-lg font-display text-surface-on">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Size Guide Modal */}
        {showSizeGuide && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-fade-in">
            <div 
              className="absolute inset-0 bg-surface-on/40 backdrop-blur-md"
              onClick={() => setShowSizeGuide(false)}
            />
            <div className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-scale-in">
              {/* Header */}
              <div className="px-8 pt-8 pb-6 flex justify-between items-start border-b border-stone-50">
                <div className="space-y-1">
                  <h3 className="text-2xl font-display text-surface-on">
                    {isBra ? "SIZE GUIDE FOR BRAS" : isPantie ? "SIZE GUIDE FOR PANTIES" : (product.sizeGuide?.name ? (product.sizeGuide.name.toUpperCase().startsWith("SIZE GUIDE FOR") ? product.sizeGuide.name : `SIZE GUIDE FOR ${product.sizeGuide.name.toUpperCase()}`) : "SIZE GUIDE")}
                  </h3>
                  <p className="text-xs text-surface-on-variant font-light">{product.sizeGuide?.description || "Find your perfect fit with our comprehensive sizing guide."}</p>
                </div>
                <button 
                  onClick={() => setShowSizeGuide(false)}
                  className="w-10 h-10 rounded-full border border-stone-100 flex items-center justify-center hover:bg-stone-50 transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>

              {/* Content */}
              <div className="p-8 overflow-y-auto max-h-[70vh] scrollbar-hide">
                <div className="space-y-8">
                  {/* Technical Drawing */}
                  <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-stone-100">
                    <Image 
                      src={sizeGuideImage} 
                      alt={isBra ? "Bra Sizing Guide" : isPantie ? "Pantie Sizing Guide" : "Sizing Guide"} 
                      fill 
                      sizes="(max-width: 768px) 100vw, 672px"
                      className="object-cover"
                    />
                  </div>

                  {/* Chart */}
                  {product.sizeGuide?.chart_data && product.sizeGuide.chart_data.length > 0 && (
                    <div className="rounded-3xl border border-stone-100 overflow-hidden">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-stone-50/50">
                            {Object.keys(product.sizeGuide.chart_data[0]).map(key => (
                              <th key={key} className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60 border-b border-stone-100">{key}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            const headers = Object.keys(product.sizeGuide.chart_data[0]);
                            return product.sizeGuide.chart_data.map((row: any, idx: number) => (
                              <tr key={idx} className="hover:bg-stone-50/30 transition-colors">
                                {headers.map((key: string, vidx: number) => (
                                  <td key={key} className={`px-6 py-4 text-sm font-light text-surface-on border-b border-stone-50/50 ${vidx === 0 ? 'font-bold' : ''}`}>
                                    {row[key]}
                                  </td>
                                ))}
                              </tr>
                            ));
                          })()}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">Pro Tip</p>
                    <p className="text-xs text-primary/80 leading-relaxed font-light">
                      If you are between sizes, we recommend going for the larger size for a more comfortable fit, or the smaller size for a firmer hold.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Section */}
        <ProductReviews productId={product.id} title={`${product.name} Feedback`} />

        {/* Floating Mobile Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-45 bg-white/90 backdrop-blur-md border-t border-stone-100 p-4 md:hidden flex gap-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] animate-fade-in-up">
          <button 
            onClick={handleAddToCart}
            className={`flex-1 py-4 rounded-full font-bold uppercase tracking-[0.2em] text-[10px] border transition-all duration-300 relative overflow-hidden ${isAdded ? 'bg-green-500 border-green-500 text-white' : 'border-primary text-primary active:bg-primary/5'}`}
          >
            <span className={`flex items-center justify-center gap-1.5 transition-transform duration-500 ${isAdded ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
              <span className="material-symbols-outlined text-sm font-light">shopping_bag</span>
              Add to Cart
            </span>
            <span className={`absolute inset-0 flex items-center justify-center gap-1.5 transition-transform duration-500 ${isAdded ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
              <span className="material-symbols-outlined text-sm">check</span>
              Added!
            </span>
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 py-4 rounded-full bg-primary text-white font-bold uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-primary/20 active:scale-95 transition-all duration-300 flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm font-light">bolt</span>
            Buy Now
          </button>
        </div>
      </main>
    </div>
  );
}
