'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';
import { supabase } from '@/lib/supabase';
import ProductReviews from '@/components/ProductReviews';
import TrustBanner from '@/components/TrustBanner';

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

  const [bundledProducts, setBundledProducts] = useState<any[]>([]);
  const [selectedBraSize, setSelectedBraSize] = useState('');
  const [selectedPantySize, setSelectedPantySize] = useState('');

  const [productReviewStats, setProductReviewStats] = useState<{ rating: number; count: number } | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const [productRes, reviewsRes] = await Promise.all([
          supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single(),
          supabase
            .from('reviews')
            .select('rating')
            .eq('product_id', id)
            .eq('status', 'approved')
        ]);

        if (productRes.error) throw productRes.error;
        const productData = productRes.data;

        if (Array.isArray(reviewsRes.data) && reviewsRes.data.length > 0) {
          const totalRating = reviewsRes.data.reduce((sum: number, r: any) => sum + (Number(r.rating) || 0), 0);
          setProductReviewStats({
            rating: Number((totalRating / reviewsRes.data.length).toFixed(1)),
            count: reviewsRes.data.length
          });
        } else {
          setProductReviewStats({ rating: 0, count: 0 });
        }
        
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

        // Fetch bundled combo products if this is a combo product
        const isCombo = productData.is_combo || productData.specifications?.some((s: any) => s.name === 'is_combo' && s.value === 'true');
        let bundledIds: string[] = Array.isArray(productData.bundled_product_ids) ? productData.bundled_product_ids : [];
        const bundleSpec = productData.specifications?.find((s: any) => s.name === 'bundled_product_ids');
        if (bundleSpec?.value) {
          try { bundledIds = JSON.parse(bundleSpec.value); } catch (e) {}
        }

        if (isCombo && bundledIds.length > 0) {
          const { data: bundledData } = await supabase
            .from('products')
            .select('*')
            .in('id', bundledIds);
          if (bundledData) {
            setBundledProducts(bundledData);
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

  // Dynamically get all product images across all color variants and bundled combo items
  const currentImages = useMemo(() => {
    if (!product) return [];
    const mainImgs: string[] = Array.isArray(product.images) ? product.images : [];
    const configImgs: string[] = [];
    const bundledImgs: string[] = [];
    
    // Add selected color images first
    const selectedConfig = product.colorConfigs?.[selectedColorIndex];
    if (selectedConfig && Array.isArray(selectedConfig.images)) {
      configImgs.push(...selectedConfig.images);
    }
    
    // Collect all other color images
    if (Array.isArray(product.colorConfigs)) {
      product.colorConfigs.forEach((c: any, idx: number) => {
        if (idx !== selectedColorIndex && Array.isArray(c?.images)) {
          configImgs.push(...c.images);
        }
      });
    }

    // Collect all images from bundled combo items
    if (Array.isArray(bundledProducts)) {
      bundledProducts.forEach((bItem: any) => {
        if (Array.isArray(bItem.images)) {
          bundledImgs.push(...bItem.images);
        }
        if (bItem.image) {
          bundledImgs.push(bItem.image);
        }
        const bConfigs = bItem.color_configs || bItem.colorConfigs || [];
        if (Array.isArray(bConfigs)) {
          bConfigs.forEach((bColor: any) => {
            if (Array.isArray(bColor?.images)) {
              bundledImgs.push(...bColor.images);
            }
          });
        }
      });
    }

    const combined = [...configImgs, ...mainImgs, ...bundledImgs].filter(Boolean);
    return Array.from(new Set(combined));
  }, [product, selectedColorIndex, bundledProducts]);

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

  const isBraPantyCombo = useMemo(() => {
    if (!product) return false;
    const isComboSpec = product.is_combo || product.specifications?.some((s: any) => s.name === 'is_combo' && s.value === 'true');
    if (!isComboSpec && bundledProducts.length === 0) return false;

    const catStr = (product.category || (Array.isArray(product.categories) ? product.categories.join(' ') : '')).toLowerCase();
    const nameStr = (product.name || '').toLowerCase();
    
    const mentionsBoth = (nameStr.includes('bra') && (nameStr.includes('panty') || nameStr.includes('panties') || nameStr.includes('set'))) ||
      catStr.includes('combo') || catStr.includes('set');

    const hasBraItem = bundledProducts.some(p => (p.name || '').toLowerCase().includes('bra'));
    const hasPantyItem = bundledProducts.some(p => (p.name || '').toLowerCase().includes('panty') || (p.name || '').toLowerCase().includes('panties') || (p.name || '').toLowerCase().includes('brief'));

    return isComboSpec || mentionsBoth || (hasBraItem && hasPantyItem);
  }, [product, bundledProducts]);

  const braItem = useMemo(() => {
    return bundledProducts.find(p => (p.name || '').toLowerCase().includes('bra'));
  }, [bundledProducts]);

  const pantyItem = useMemo(() => {
    return bundledProducts.find(p => (p.name || '').toLowerCase().includes('panty') || (p.name || '').toLowerCase().includes('panties') || (p.name || '').toLowerCase().includes('brief') || (p.name || '').toLowerCase().includes('hipster'));
  }, [bundledProducts]);

  const braSizeOptions = useMemo(() => {
    if (braItem) {
      const v = braItem.variants?.find((varItem: any) => varItem.name === 'Size');
      if (v?.values?.length > 0) return v.values;
    }
    const mainSizes = product?.variants?.find((v: any) => v.name === 'Size')?.values || [];
    const braMatches = mainSizes.filter((s: string) => /\d/.test(s));
    if (braMatches.length > 0) return braMatches;
    return ['32A', '32B', '34A', '34B', '34C', '36A', '36B', '36C', '38B', '38C', '40B'];
  }, [braItem, product]);

  const pantySizeOptions = useMemo(() => {
    if (pantyItem) {
      const v = pantyItem.variants?.find((varItem: any) => varItem.name === 'Size');
      if (v?.values?.length > 0) return v.values;
    }
    const mainSizes = product?.variants?.find((v: any) => v.name === 'Size')?.values || [];
    const pantyMatches = mainSizes.filter((s: string) => !/\d/.test(s));
    if (pantyMatches.length > 0) return pantyMatches;
    return ['S', 'M', 'L', 'XL', '2XL'];
  }, [pantyItem, product]);

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
    let finalSize = selectedSize;

    if (isBraPantyCombo) {
      if (!selectedBraSize || !selectedPantySize) {
        setSizeError(true);
        const sizeSelectorEl = document.getElementById('size-selector');
        if (sizeSelectorEl) {
          sizeSelectorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }
      finalSize = `Bra: ${selectedBraSize} | Panty: ${selectedPantySize}`;
    } else {
      if (sizes.length > 0 && !selectedSize) {
        setSizeError(true);
        const sizeSelectorEl = document.getElementById('size-selector');
        if (sizeSelectorEl) {
          sizeSelectorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }
      finalSize = selectedSize || 'Free Size';
    }
    setSizeError(false);
    
    const colorName = product.colorConfigs?.[selectedColorIndex]?.name || 'Default';
    const cartItemId = `${id}-${finalSize}-${colorName}`;
    addItem({
      id: cartItemId,
      productId: id,
      name: product.name,
      price: product.price,
      quantity,
      image: currentImages[0],
      size: finalSize,
      color: colorName
    });
    
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 3000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    let finalSize = selectedSize;

    if (isBraPantyCombo) {
      if (!selectedBraSize || !selectedPantySize) {
        setSizeError(true);
        const sizeSelectorEl = document.getElementById('size-selector');
        if (sizeSelectorEl) {
          sizeSelectorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }
      finalSize = `Bra: ${selectedBraSize} | Panty: ${selectedPantySize}`;
    } else {
      if (sizes.length > 0 && !selectedSize) {
        setSizeError(true);
        const sizeSelectorEl = document.getElementById('size-selector');
        if (sizeSelectorEl) {
          sizeSelectorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }
      finalSize = selectedSize || 'Free Size';
    }
    setSizeError(false);

    const colorName = product.colorConfigs?.[selectedColorIndex]?.name || 'Default';
    const cartItemId = `${id}-${finalSize}-${colorName}`;
    const buyNowItem = {
      id: cartItemId,
      productId: id,
      name: product.name,
      price: product.price,
      quantity,
      image: currentImages[0],
      size: finalSize,
      color: colorName
    };
    sessionStorage.setItem('buyNowItem', JSON.stringify(buyNowItem));
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
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

  const handleShare = async () => {
    if (typeof window === 'undefined') return;
    const shareUrl = window.location.href;
    const shareTitle = product?.name ? `${product.name} | Bloomina` : 'Bloomina';
    const shareText = `Check out ${product?.name || 'this piece'} on Bloomina!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err: any) {
        // User cancelled or share failed, fallback to modal if not AbortError
        if (err.name === 'AbortError') return;
      }
    }
    setShowShareModal(true);
  };

  const handleCopyLink = () => {
    if (typeof window === 'undefined') return;
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
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
      <main className="pb-6 md:pb-12 w-full">
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
              <h1 className="text-3xl md:text-4xl font-sans font-bold text-surface-on tracking-tight leading-tight capitalize">
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

              {/* Genuine Review Display or No reviews */}
              {productReviewStats && productReviewStats.count > 0 ? (
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex items-center text-amber-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span 
                        key={star} 
                        className="material-symbols-outlined text-base"
                        style={{ fontVariationSettings: star <= Math.round(productReviewStats.rating) ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-stone-800">
                    {productReviewStats.rating.toFixed(1)}
                  </span>
                  <span className="text-xs text-stone-400 font-normal">
                    ({productReviewStats.count} {productReviewStats.count === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 pt-0.5">
                  <span className="text-xs text-stone-400 italic">
                    No reviews yet
                  </span>
                </div>
              )}
            </div>

            {/* Color Selector moved to top */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <h3 className="text-xs font-black uppercase tracking-[0.15em] text-stone-900">Select Color</h3>
                <span className="text-xs font-bold text-stone-700">
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

            {/* Auto-Loaded Combo Products Showcase */}
            {bundledProducts.length > 0 && (
              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">package_2</span>
                    Included Items in this Combo Bundle ({bundledProducts.length} Products)
                  </h3>
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 uppercase">
                    Special Combo Price
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {bundledProducts.map((item: any) => (
                    <div key={item.id} className="p-3 bg-white rounded-xl border border-stone-200 flex items-center gap-3 shadow-xs">
                      <div className="relative w-12 h-14 rounded-lg overflow-hidden shrink-0 bg-stone-100 border border-stone-200">
                        {item.images?.[0] && (
                          <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-surface-on truncate">{item.name}</p>
                        <p className="text-[10px] text-stone-500 font-medium">Original Individual Price: ₹{item.price}</p>
                        {item.colorConfigs?.[0] && (
                          <div className="flex items-center gap-1 mt-1">
                            <span className="w-2.5 h-2.5 rounded-full border border-black/10" style={{ backgroundColor: item.colorConfigs[0].hex }} />
                            <span className="text-[9px] text-stone-400 font-bold uppercase">{item.colorConfigs[0].name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Selection Controls */}
            <div className="space-y-10 pt-4">

              {/* Size Selector */}
              {isBraPantyCombo ? (
                <div id="size-selector" className="space-y-6 p-5 rounded-2xl bg-[#fff5f7] border border-[#944555]/20 shadow-xs">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-black uppercase tracking-wider text-primary flex items-center gap-1.5">
                        <span>👙</span> Select Both Bra & Panty Sizes
                      </h3>
                      {sizeError && (
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest animate-pulse">
                          (Select both sizes to continue)
                        </span>
                      )}
                    </div>
                    {product.sizeGuide && (
                      <button 
                        onClick={() => setShowSizeGuide(true)}
                        className="text-[10px] font-bold uppercase tracking-widest text-primary underline flex items-center gap-1 hover:text-primary/70"
                      >
                        <span className="material-symbols-outlined text-sm">straighten</span>
                        Size Guide
                      </button>
                    )}
                  </div>

                  {/* 1. Bra Size Selector Card */}
                  <div className={`p-4 rounded-xl border transition-all ${sizeError && !selectedBraSize ? 'bg-red-50/70 border-red-300 animate-pulse' : 'bg-white border-stone-200/80'}`}>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        {braItem?.images?.[0] && (
                          <img src={braItem.images[0]} alt="" className="w-7 h-7 rounded object-cover border border-stone-200 shrink-0" />
                        )}
                        <span className="text-xs font-black uppercase tracking-wider text-stone-800 truncate">
                          1. Bra Size {braItem?.name ? `(${braItem.name})` : ''}
                        </span>
                      </div>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 ${selectedBraSize ? 'bg-primary/10 text-primary' : 'bg-red-100 text-red-600'}`}>
                        {selectedBraSize ? `Size: ${selectedBraSize}` : 'Select Size'}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {braSizeOptions.map((bSize: string) => (
                        <button
                          key={bSize}
                          type="button"
                          onClick={() => { setSelectedBraSize(bSize); setSizeError(false); }}
                          className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${selectedBraSize === bSize ? 'bg-primary text-white border-primary shadow-md scale-[1.03]' : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-primary/40'}`}
                        >
                          {bSize}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Panty Size Selector Card */}
                  <div className={`p-4 rounded-xl border transition-all ${sizeError && !selectedPantySize ? 'bg-red-50/70 border-red-300 animate-pulse' : 'bg-white border-stone-200/80'}`}>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        {pantyItem?.images?.[0] && (
                          <img src={pantyItem.images[0]} alt="" className="w-7 h-7 rounded object-cover border border-stone-200 shrink-0" />
                        )}
                        <span className="text-xs font-black uppercase tracking-wider text-stone-800 truncate">
                          2. Panty Size {pantyItem?.name ? `(${pantyItem.name})` : ''}
                        </span>
                      </div>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 ${selectedPantySize ? 'bg-primary/10 text-primary' : 'bg-red-100 text-red-600'}`}>
                        {selectedPantySize ? `Size: ${selectedPantySize}` : 'Select Size'}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                      {pantySizeOptions.map((pSize: string) => (
                        <button
                          key={pSize}
                          type="button"
                          onClick={() => { setSelectedPantySize(pSize); setSizeError(false); }}
                          className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${selectedPantySize === pSize ? 'bg-primary text-white border-primary shadow-md scale-[1.03]' : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-primary/40'}`}
                        >
                          {pSize}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div id="size-selector" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-black uppercase tracking-[0.15em] text-stone-900">Select Size</h3>
                      {sizeError && (
                        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest animate-pulse">
                          (Select size first)
                        </span>
                      )}
                    </div>
                    {(product.sizeGuide || sizes.length > 0) && (
                      <button 
                        onClick={() => setShowSizeGuide(true)}
                        className="text-[10px] font-black uppercase tracking-widest text-primary underline underline-offset-4 flex items-center gap-1 hover:text-primary/70 transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm font-bold">straighten</span>
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
              )}

              {/* Quantity + Action Buttons */}
              <div className="flex flex-col gap-5 pt-4">

                {/* Quantity Stepper */}
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-[0.15em] text-stone-900">Quantity</h3>
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

                {/* Row 1: Add to Cart + Wishlist + Share */}
                <div className="flex gap-3">
                  <button 
                    onClick={handleAddToCart}
                    className={`flex-1 px-8 py-5 rounded-full font-bold uppercase tracking-[0.2em] text-[11px] transition-all duration-500 overflow-hidden relative border ${isAdded ? 'bg-green-500 border-green-500 text-white shadow-green-100' : 'border-primary text-primary hover:bg-primary/5 hover:scale-[1.02] active:scale-95'}`}
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
                    title={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
                    className={`px-5 py-5 border rounded-full flex items-center justify-center transition-all ${isFavorite ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'border-primary/20 text-primary hover:bg-primary/5'}`}
                  >
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0" }}>
                      favorite
                    </span>
                  </button>
                  <button 
                    onClick={handleShare}
                    title="Share Product"
                    className="px-5 py-5 border border-primary/20 text-primary hover:bg-primary/5 rounded-full flex items-center justify-center transition-all group"
                  >
                    <span className="material-symbols-outlined transition-transform group-hover:scale-110">
                      share
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

                {/* Trust & Guarantee Box */}
                <TrustBanner variant="compact" className="mt-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        {product.materials && (
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-10 md:py-14 border-t border-stone-100 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              <div className="lg:col-span-1 space-y-2">
                <h2 className="text-2xl md:text-3xl font-display font-black text-surface-on tracking-tight">Product Details</h2>
                {product.materials.description && (
                  <p className="text-surface-on-variant font-light leading-relaxed text-sm pt-1">
                    {product.materials.description}
                  </p>
                )}
              </div>
              
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.materials.content?.map((item: any, idx: number) => (
                  <div key={idx} className="p-5 sm:p-6 rounded-2xl bg-stone-50/80 border border-stone-200/80 flex flex-col gap-1 transition-all hover:petal-shadow group">
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary">{item.label}</span>
                    <span className="text-base font-medium text-surface-on">{item.value}</span>
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
        <ProductReviews productId={product.id} title="Customer Feedback" />

        {/* Floating Mobile Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-stone-200/80 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] md:hidden flex items-center gap-2.5 shadow-[0_-10px_30px_rgba(0,0,0,0.08)]">
          <button 
            onClick={handleShare}
            title="Share"
            className="w-11 h-11 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:text-primary hover:border-primary shrink-0 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">share</span>
          </button>
          <button 
            onClick={handleAddToCart}
            className={`flex-1 py-3.5 rounded-full font-bold uppercase tracking-[0.2em] text-[10px] border transition-all duration-300 relative overflow-hidden active:scale-98 ${isAdded ? 'bg-green-600 border-green-600 text-white' : 'border-primary text-primary hover:bg-primary/5 active:bg-primary/10'}`}
          >
            <span className={`flex items-center justify-center gap-1.5 transition-transform duration-500 ${isAdded ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
              <span className="material-symbols-outlined text-base font-light">shopping_bag</span>
              Add to Cart
            </span>
            <span className={`absolute inset-0 flex items-center justify-center gap-1.5 transition-transform duration-500 ${isAdded ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
              <span className="material-symbols-outlined text-base">check</span>
              Added!
            </span>
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 py-3.5 rounded-full bg-primary hover:bg-primary/95 text-white font-bold uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-primary/25 active:scale-98 transition-all duration-300 flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base font-light">bolt</span>
            Buy Now
          </button>
        </div>

        {/* Share Modal Dialog */}
        {showShareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl space-y-6 relative border border-stone-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-display font-semibold text-surface-on">Share this Piece</h3>
                  <p className="text-xs text-stone-500 mt-0.5">Spread the elegance with friends</p>
                </div>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>

              {/* Product mini preview */}
              <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-100">
                {currentImages[0] && (
                  <img src={currentImages[0]} alt="" className="w-12 h-14 object-cover rounded-xl shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-stone-800 truncate">{product.name}</p>
                  <p className="text-xs font-bold text-primary mt-0.5">₹{parseFloat(product.price).toLocaleString('en-IN')}</p>
                </div>
              </div>

              {/* Share Channels */}
              <div className="grid grid-cols-4 gap-3 text-center">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out ${product.name} on Bloomina: ${typeof window !== 'undefined' ? window.location.href : ''}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-stone-50 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.044c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.072.043.419-.101.824z"/>
                    </svg>
                  </div>
                  <span className="text-[10px] font-semibold text-stone-600">WhatsApp</span>
                </a>

                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(`Check out ${product.name} on Bloomina`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-stone-50 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .36z"/>
                    </svg>
                  </div>
                  <span className="text-[10px] font-semibold text-stone-600">Telegram</span>
                </a>

                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-stone-50 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <span className="text-[10px] font-semibold text-stone-600">Facebook</span>
                </a>

                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${product.name} on Bloomina`)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-stone-50 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                  <span className="text-[10px] font-semibold text-stone-600">X (Twitter)</span>
                </a>
              </div>

              {/* Copy Link Row */}
              <div className="flex items-center gap-2 p-1.5 pl-3.5 bg-stone-50 rounded-full border border-stone-200">
                <span className="material-symbols-outlined text-stone-400 text-sm">link</span>
                <input
                  type="text"
                  readOnly
                  value={typeof window !== 'undefined' ? window.location.href : ''}
                  className="bg-transparent text-xs text-stone-600 flex-1 truncate outline-none select-all"
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${copiedLink ? 'bg-green-600 text-white' : 'bg-primary text-white hover:bg-primary/90'}`}
                >
                  {copiedLink ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
