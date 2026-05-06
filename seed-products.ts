import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '.env') });

process.env.PAYLOAD_CONFIG_PATH = path.resolve(__dirname, 'payload.config.ts');

import { getPayload } from 'payload';
import config from './payload.config';

const seed = async () => {
  console.log('--- Seed Starting ---');
  const payload = await getPayload({ config });
  console.log('--- Payload Initialized ---');

  // 1. Create Media entries (using placeholders for now, but real paths if available)
  const mediaItems = [
    {
      alt: 'WIREFREE, NON-PADDED MOULDED T-SHIRT BRA',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTbghw_WZVzhd9DKApPxJcoUK9cwJkf44QoDbHoRjTRnubMMge4zVDFV4aKhYlPUZNpOupfdzT_0TFOc5M6oK763b3jWnP3FX8u0mOjZs3PFlSuFUrwyW4_flxdqhvotNurlXfZlqgu9fsu5PAuM8dAy-TskCzImUd_-ghDraPg07vOihUfj8zdinMGOjJgvlkxSv-3v0qUaYWyUveFWSIXwp6uyeh7Wq5XildCnMHdWUN0Mar7Gjox8ZGa_kkMAJD0mIuDs0er5Y',
    },
    {
      alt: 'NON-PADDED MOULDED FULL COVERAGE MINIMISER BRA',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtTWwa3VJHNdsEG9oh5tTD15FG99afrssGfm94XV_lmqu2lz5xhHh8baJqMbO6_pBR9T__va2ZSnk8byx9iPNLAJ9oyVz-VTDPa7tn7X21Jll0_DYfCidLpHlP2d1IMDxHXZ_XKIq_WtWfdKF8vICuD8HyOxPLkk52M5BQ8wF2vR4irro2gTc_5lJaVZh_Ht3LXdc-p4TNf_K2ayzw46-pnv6gJk8TaqdWKSsROYZBx5PwA9kr-HpDF055nX5Y9k04Rbgy1h19mY',
    },
    {
      alt: 'Cotton Chic Support Solid Non Padded Non-Wired Bra',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvfO2NIxaIgCESyQcNtM9KnBrKiNYbF7ncAfgP-RUU4bZRIUlzs3DmbF5JT_vhDyeU0jBWVop-pmwcivPOHz61VEjqkU1G0R6tzQuvJ9K6bmIsl6QfzQQttZo3o9G2szNxydX8C-REZATP4egaVlqSgtg5twEbhRn_0Y0_2vpFAdYbocuk-_avrPvSnzH5Bjpa5KLyLZsZkT7pKTZSZJMu4jOhIxbTNxwWYOVZ0D0poUYyI1UdojIvIXLyptrhEHgnKsUrJQeD9WY',
    },
  ];

  const createdMedia = [];
  for (const item of mediaItems) {
    try {
      const response = await fetch(item.url);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const media = await payload.create({
        collection: 'media',
        data: {
          alt: item.alt,
        },
        file: {
          data: buffer,
          name: `${item.alt.toLowerCase().replace(/[^a-z0-9]/g, '-')}.jpg`,
          mimetype: 'image/jpeg',
          size: buffer.length,
        },
      });
      createdMedia.push(media);
      console.log(`Created media: ${item.alt}`);
    } catch (err) {
      console.error(`Failed to create media for ${item.alt}:`, err);
      // Fallback to a mock ID if needed, but better to fail early
      throw err;
    }
  }

  const products = [
    {
      title: 'WIREFREE, NON-PADDED MOULDED T-SHIRT BRA',
      description: `Designed with smooth double layered moulded cups that give a clean and seamless look under fitted tops and T-shirts. Non-padded cups provide a natural shape while keeping the bra lightweight and breathable. Made from soft, cotton spandex fabric that feels gentle on the skin and ensures all-day comfort. Offers reliable support with premium adjustable straps and micro fibre hook & eye closure.`,
      slug: 'wirefree-moulded-tshirt-bra',
      price: 899,
      category: 'innerwear',
      images: [createdMedia[0].id],
      variants: [
        { color: '#F191A1', size: 'S', inventory: 10 },
        { color: '#F191A1', size: 'M', inventory: 15 },
        { color: '#F191A1', size: 'L', inventory: 5 },
      ]
    },
    {
      title: 'NON-PADDED MOULDED FULL COVERAGE MINIMISER BRA',
      description: `Crafted from premium combed cotton elastane fabric for breathable comfort and a flexible, supportive fit. Double layered cups for maximum support with discretion. Designed to provide smooth shaping with full coverage. Broad wings to eliminate back bulges. Premium Soft Straps – Gentle on the shoulders for all-day ease. Micro Fiber Hook & Eye Closure – Secure, durable fastening for reliable support.`,
      slug: 'full-coverage-minimiser-bra',
      price: 1099,
      category: 'innerwear',
      images: [createdMedia[1].id],
      variants: [
        { color: '#FFFFFF', size: 'M', inventory: 20 },
        { color: '#FFFFFF', size: 'L', inventory: 12 },
        { color: '#000000', size: 'M', inventory: 8 },
      ]
    },
    {
      title: 'Cotton Chic Support Solid Non Padded Non-Wired Bra',
      description: `Non-padded & non-wired comfort. Made from premium combed cotton for all-day breathable wear. Signature Bloomina support for the natural silhouette.`,
      slug: 'cotton-chic-support-bra',
      price: 799,
      category: 'innerwear',
      images: [createdMedia[2].id],
      variants: [
        { color: '#E5E7EB', size: 'S', inventory: 30 },
        { color: '#E5E7EB', size: 'M', inventory: 25 },
      ]
    },
    // Add 5 more to reach 8 for home page
    {
      title: 'Ethereal Silk Bralette',
      description: 'Hand-stitched silk bralette for the ultimate luxe feel.',
      slug: 'ethereal-silk-bralette',
      price: 2499,
      category: 'innerwear',
      images: [createdMedia[0].id],
      variants: [{ color: '#F191A1', size: 'S', inventory: 5 }]
    },
    {
      title: 'Petal Lace Briefs',
      description: 'Delicate lace briefs with a soft cotton gusset.',
      slug: 'petal-lace-briefs',
      price: 499,
      category: 'innerwear',
      images: [createdMedia[1].id],
      variants: [{ color: '#F191A1', size: 'M', inventory: 50 }]
    },
    {
      title: 'Morning Bloom Robe',
      description: 'Lightweight satin robe for your morning rituals.',
      slug: 'morning-bloom-robe',
      price: 3299,
      category: 'lounge',
      images: [createdMedia[2].id],
      variants: [{ color: '#F191A1', size: 'L', inventory: 10 }]
    },
    {
      title: 'Zen Sanctuary Leggings',
      description: 'Buttery soft leggings for light movement.',
      slug: 'zen-sanctuary-leggings',
      price: 1899,
      category: 'activewear',
      images: [createdMedia[0].id],
      variants: [{ color: '#374151', size: 'M', inventory: 25 }]
    },
    {
      title: 'Silk Sleep Mask',
      description: 'Pure mulberry silk for uninterrupted rest.',
      slug: 'silk-sleep-mask',
      price: 699,
      category: 'accessories',
      images: [createdMedia[1].id],
      variants: [{ color: '#F191A1', size: 'S', inventory: 100 }]
    }
  ];

  for (const product of products) {
    await payload.create({
      collection: 'products',
      data: product,
    });
  }

  console.log('Seed completed successfully');
  process.exit(0);
};

seed();
