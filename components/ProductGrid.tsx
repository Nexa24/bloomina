'use client';

import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

const ProductGrid = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching products from:', process.env.NEXT_PUBLIC_SUPABASE_URL);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('status', 'Active')
          .order('created_at', { ascending: false })
          .limit(12);

        if (error) throw error;
        setProducts(data || []);
      } catch (err: any) {
        console.error('Product fetch error details:', {
          message: err.message,
          stack: err.stack,
          url: process.env.NEXT_PUBLIC_SUPABASE_URL
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-4 animate-pulse">
            <div className="aspect-[3/4] bg-stone-50 rounded-[2rem]" />
            <div className="h-4 bg-stone-50 rounded w-2/3" />
            <div className="h-3 bg-stone-50 rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-surface-on/40 italic">No products available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-x-12 md:gap-y-20">
      {products.slice(0, 4).map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          title={product.name}
          price={product.price}
          image={product.images?.[0] || 'https://placehold.co/600x800?text=No+Image'}
          category={Array.isArray(product.categories) ? product.categories[0] : (product.categories || 'Uncategorized')}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
