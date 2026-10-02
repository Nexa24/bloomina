"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';

interface SubSectionItem {
  name: string;
  href: string;
}

interface CategoryGroup {
  groupName: string;
  groupHref: string;
  items: SubSectionItem[];
}

interface NavLinkItem {
  name: string;
  href: string;
  badge?: string;
  groups?: CategoryGroup[];
  subsections?: SubSectionItem[];
  featured?: {
    title: string;
    image: string;
  };
}

const navLinks: NavLinkItem[] = [
  { 
    name: 'All Products', 
    href: '/category/all',
    groups: [
      {
        groupName: 'Bras',
        groupHref: '/category/bras',
        items: [
          { name: 'All Bras', href: '/category/bras' },
          { name: 'Padded Bras', href: '/category/bras/padded-bras' },
          { name: 'Non-Padded Bras', href: '/category/bras/non-padded' },
          { name: 'T-Shirt Bras', href: '/category/bras/t-shirt-bras' },
          { name: 'Full Coverage Bras', href: '/category/bras/full-coverage-bras' },
          { name: 'Everyday Essentials', href: '/category/bras/everyday-essentials' },
          { name: 'Minimizer Bras', href: '/category/bras/minimizer-bra' },
          { name: 'Teenager Bra', href: '/category/bras/teenager-bra' },
        ]
      },
      {
        groupName: 'Panties',
        groupHref: '/category/panties',
        items: [
          { name: 'All Panties', href: '/category/panties' },
          { name: 'Cotton Lycra Panties', href: '/category/panties/cotton-lycra' },
          { name: 'Modal Panties', href: '/category/panties/modal-panties' },
          { name: 'Everyday Essentials', href: '/category/panties/everyday-essentials' },
        ]
      }
    ],
    featured: {
      title: 'Everyday Luxury',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTbghw_WZVzhd9DKApPxJcoUK9cwJkf44QoDbHoRjTRnubMMge4zVDFV4aKhYlPUZNpOupfdzT_0TFOc5M6oK763b3jWnP3FX8u0mOjZs3PFlSuFUrwyW4_flxdqhvotNurlXfZlqgu9fsu5PAuM8dAy-TskCzImUd_-ghDraPg07vOihUfj8zdinMGOjJgvlkxSv-3v0qUaYWyUveFWSIXwp6uyeh7Wq5XildCnMHdWUN0Mar7Gjox8ZGa_kkMAJD0mIuDs0er5Y'
    }
  },
  { name: 'Bestsellers', href: '/category/bestsellers' },
  { 
    name: 'Offers%', 
    href: '/category/sale',
    badge: 'Hot'
  }
];

const Navbar = () => {
  const router = useRouter();
  const [searchVal, setSearchVal] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  const { getTotalItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const cartCount = getTotalItems();
  const wishlistCount = wishlistItems.length;

  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sticky header background shift on scroll
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      router.push(`/category/all?search=${encodeURIComponent(searchVal.trim())}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      <header 
        onMouseLeave={() => setHoveredLink(null)}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/80 backdrop-blur-xl shadow-[0_10px_40px_-15px_rgba(241,145,161,0.1)]' : 'bg-white'}`}
      >
        {/* Announcement Bar */}
        <div className="bg-primary py-2 text-center overflow-hidden px-4 flex items-center justify-center gap-2">
          <Image 
            src="/logo/BLO_TRNSP_LOVE_ICON.png" 
            alt="Bloomina Icon" 
            width={12} 
            height={12} 
            className="brightness-0 invert opacity-80"
          />
          <p className="text-[10px] md:text-xs font-display font-medium text-white tracking-[0.2em] uppercase flex items-center gap-2">
            <span>Free Shipping On Orders Above ₹499</span>
          </p>
        </div>

        <div className="max-w-screen-xl mx-auto px-4 md:px-6 h-16 md:h-20 flex justify-between items-center antialiased relative">
          {/* MOBILE ONLY: Left Side (Menu & Search) */}
          <div className="flex lg:hidden items-center justify-start gap-4 z-10 flex-1">
            <button 
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open mobile menu"
              className="text-surface-on-variant hover:text-primary transition-all duration-300 flex-shrink-0"
            >
              <span className="material-symbols-outlined font-light scale-110" aria-hidden="true">menu</span>
            </button>
            
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Open search overlay"
              className={`text-surface-on-variant hover:text-primary transition-all duration-300 flex-shrink-0 ${isSearchOpen ? 'text-primary scale-110' : ''}`}
            >
              <span className="material-symbols-outlined text-[20px] font-light" aria-hidden="true">search</span>
            </button>
          </div>

          {/* DESKTOP ONLY: Left Side (Logo) */}
          <div className="hidden lg:flex items-center justify-start flex-1 z-10">
            <Link href="/" className="flex items-center" aria-label="Bloomina Home">
              <Image 
                src="/logo/BLO_TRNSP_PINK_LRG.png" 
                alt="Bloomina Logo" 
                width={180} 
                height={48} 
                className="h-10 w-auto object-contain transition-transform duration-500 hover:scale-105"
                priority
              />
            </Link>
          </div>

          {/* MOBILE ONLY: Center (Logo) */}
          <div className="absolute left-1/2 -translate-x-1/2 flex lg:hidden items-center justify-center">
            <Link href="/" className="flex items-center" aria-label="Bloomina Home">
              <Image 
                src="/logo/BLO_TRNSP_PINK_LRG.png" 
                alt="Bloomina Logo" 
                width={120} 
                height={32} 
                className="h-7 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* DESKTOP ONLY: Center (Nav Links) */}
          <div className="hidden lg:flex items-center justify-center flex-[2]">
            <nav className="flex items-center gap-10 px-4 h-full" aria-label="Main Navigation">
              {navLinks.map((link) => (
                <div 
                  key={link.name} 
                  className="h-full flex items-center"
                  onMouseEnter={() => setHoveredLink(link.name)}
                >
                  <Link 
                    href={link.href} 
                    className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 whitespace-nowrap relative group py-2 ${pathname === link.href || hoveredLink === link.name ? 'text-primary' : 'text-surface-on hover:text-primary'}`}
                  >
                    {link.name}
                    <span className={`absolute -bottom-1 left-0 h-[2px] bg-primary transition-all duration-300 ${pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                  </Link>
                </div>
              ))}
            </nav>
          </div>

          {/* RIGHT SIDE: Icons (Universal) */}
          <div className="flex items-center justify-end gap-3 md:gap-8 z-10 flex-1">
            {/* Search Icon Button (Desktop) */}
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Open search"
              className={`hidden lg:flex text-surface-on-variant hover:text-primary transition-colors duration-300 flex-shrink-0 ${isSearchOpen ? 'text-primary' : ''}`}
            >
              <span className="material-symbols-outlined text-[20px] md:text-2xl font-light" aria-hidden="true">search</span>
            </button>
            <Link href="/account" className="text-surface-on-variant hover:text-primary transition-colors duration-300 flex-shrink-0" aria-label="My Account">
              <span className="material-symbols-outlined text-[20px] md:text-2xl font-light" aria-hidden="true">person</span>
            </Link>
            <Link href="/wishlist" className="hidden sm:flex text-surface-on-variant hover:text-primary transition-colors duration-300 items-center gap-0.5 group relative flex-shrink-0" aria-label="Wishlist">
              <span className="material-symbols-outlined text-[20px] md:text-2xl font-light group-hover:scale-110 transition-transform" aria-hidden="true">favorite</span>
              {isMounted && wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            <Link href="/cart" className="text-surface-on-variant hover:text-primary transition-colors duration-300 flex items-center gap-0.5 group relative flex-shrink-0" aria-label="Shopping Cart">
              <span className="material-symbols-outlined text-[20px] md:text-2xl font-light group-hover:scale-110 transition-transform" aria-hidden="true">shopping_cart</span>
              {isMounted && getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                  {getTotalItems()}
                </span>
              )}
            </Link>
          </div>
        </div>

          {/* Mega-Menu Dropdown */}
          <div 
            className={`absolute top-full left-0 w-full bg-white/95 backdrop-blur-2xl border-t border-stone-50 overflow-hidden transition-all duration-500 ease-out shadow-2xl ${hoveredLink && (navLinks.find(l => l.name === hoveredLink)?.groups || navLinks.find(l => l.name === hoveredLink)?.subsections) ? 'max-h-[550px] opacity-100 py-12' : 'max-h-0 opacity-0 py-0 pointer-events-none'}`}
          >
            <div className="max-w-screen-xl mx-auto px-12 grid grid-cols-12 gap-12">
              {/* Grouped Sub-sections (e.g. Bras & Panties divisions) */}
              <div className="col-span-8">
                {(() => {
                  const activeItem = navLinks.find(l => l.name === hoveredLink);
                  if (activeItem?.groups) {
                    return (
                      <div className="grid grid-cols-2 gap-10">
                        {activeItem.groups.map((group) => (
                          <div key={group.groupName} className="space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                              <Link 
                                href={group.groupHref}
                                onClick={() => setHoveredLink(null)}
                                className="font-display text-lg font-medium text-surface-on hover:text-primary transition-colors flex items-center gap-2 group/g"
                              >
                                <span>{group.groupName}</span>
                                <span className="material-symbols-outlined text-sm text-stone-300 group-hover/g:text-primary group-hover/g:translate-x-0.5 transition-all">arrow_forward</span>
                              </Link>
                              <span className="text-[9px] font-bold uppercase tracking-widest text-primary/60">Collection</span>
                            </div>
                            <div className="grid grid-cols-1 gap-2.5">
                              {group.items.map((sub) => (
                                <Link 
                                  key={sub.name} 
                                  href={sub.href}
                                  className="group flex items-center gap-3 text-surface-on-variant hover:text-primary transition-all py-1"
                                  onClick={() => setHoveredLink(null)}
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
                                  <span className="text-sm font-light text-stone-700 group-hover:text-primary group-hover:translate-x-1 transition-all">{sub.name}</span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  if (activeItem?.subsections) {
                    return (
                      <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                        {activeItem.subsections.map((sub) => (
                          <Link 
                            key={sub.name} 
                            href={sub.href}
                            className="group flex items-center gap-4 text-surface-on-variant hover:text-primary transition-all"
                            onClick={() => setHoveredLink(null)}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
                            <div>
                              <p className="text-sm font-semibold tracking-tight">{sub.name}</p>
                              <p className="text-[10px] font-bold uppercase tracking-widest opacity-30 mt-1">Shop Collection</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>

              {/* Featured Card & All Categories Link */}
              <div className="col-span-4 border-l border-stone-100 pl-12 flex flex-col justify-between">
                {hoveredLink && navLinks.find(l => l.name === hoveredLink)?.featured ? (
                  <div className="space-y-4">
                    <div className="relative group cursor-pointer overflow-hidden rounded-2xl aspect-[4/3] petal-shadow">
                      <img 
                        src={navLinks.find(l => l.name === hoveredLink)?.featured?.image} 
                        alt="Featured" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent flex flex-col justify-end p-6">
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/80">New Arrival</p>
                        <h4 className="text-white font-display text-xl">{navLinks.find(l => l.name === hoveredLink)?.featured?.title}</h4>
                      </div>
                    </div>

                    <Link 
                      href="/all-categories" 
                      onClick={() => setHoveredLink(null)}
                      className="flex items-center justify-between p-3.5 bg-stone-50 hover:bg-primary/5 rounded-xl border border-stone-200/60 group/btn transition-all"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-primary text-lg">grid_view</span>
                        <span className="text-xs font-bold uppercase tracking-wider text-surface-on group-hover/btn:text-primary transition-colors">Browse All Categories</span>
                      </div>
                      <span className="material-symbols-outlined text-sm text-stone-300 group-hover/btn:text-primary group-hover/btn:translate-x-1 transition-all">arrow_forward</span>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">The Bloomina Way</p>
                    <p className="text-sm font-light leading-relaxed text-surface-on-variant">
                      Crafted for the feminine silhouette, our collections embrace the philosophy of ethereal comfort and timeless elegance.
                    </p>
                    <div className="flex flex-col gap-2 pt-2">
                      <Link 
                        href="/all-categories" 
                        onClick={() => setHoveredLink(null)}
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary hover:underline"
                      >
                        <span>Browse All Categories</span>
                        <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </Link>
                      <Link href="/about" className="text-[10px] font-bold uppercase tracking-widest text-surface-on-variant/70 hover:text-primary transition-colors">Our Philosophy</Link>
                    </div>
                  </div>
                )}
              </div>
          </div>
        </div>

        {/* Premium Full-Page Search Overlay */}
        <div className={`fixed inset-0 z-[110] transition-all duration-700 ease-in-out overflow-y-auto ${isSearchOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'}`}>
          {/* Backdrop */}
          <div 
            className={`fixed inset-0 bg-white/95 backdrop-blur-3xl transition-opacity duration-700 ${isSearchOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={() => setIsSearchOpen(false)}
          />
          
          {/* Content */}
          <div className={`relative min-h-screen w-full transition-all duration-700 delay-100 ${isSearchOpen ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'}`}>
            <div className="max-w-screen-2xl mx-auto px-6 md:px-12 pt-12 md:pt-32 pb-24">
              {/* Close Button Row (Mobile Optimized) */}
              <div className="flex justify-end mb-8 md:absolute md:top-12 md:right-12">
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  aria-label="Close search overlay"
                  className="p-3 rounded-full hover:bg-stone-50 text-surface-on/20 hover:text-primary transition-all duration-500"
                >
                  <span className="material-symbols-outlined text-3xl md:text-4xl font-light" aria-hidden="true">close</span>
                </button>
              </div>

              <div className="flex items-center justify-between border-b border-primary/15 pb-6 md:pb-10 mb-16 group">
                <div className="flex-1 flex items-center gap-4 md:gap-10">
                  <span className="material-symbols-outlined text-3xl md:text-5xl text-primary font-light" aria-hidden="true">search</span>
                  <label htmlFor="navbar-overlay-search" className="sr-only">Search our collection</label>
                  <input 
                    type="text" 
                    id="navbar-overlay-search"
                    aria-label="Search our collection"
                    placeholder="Search our collection..." 
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchVal.trim()) {
                        setIsSearchOpen(false);
                        router.push(`/category/search?q=${encodeURIComponent(searchVal.trim())}`);
                      }
                    }}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-3xl md:text-8xl font-display font-light text-surface-on placeholder:text-stone-300 antialiased outline-none"
                    autoFocus={isSearchOpen}
                  />
                </div>
              </div>

              {/* Trending / Quick Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                <div className="space-y-8">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Trending Now</h3>
                  <div className="flex flex-wrap gap-4">
                    {['Lace Bralettes', 'Silk Robes', 'Bridal Set', 'Wireless Comfort', 'Midnight Black'].map((term) => (
                      <button 
                        key={term} 
                        type="button"
                        onClick={() => {
                          setSearchVal(term);
                          setIsSearchOpen(false);
                          router.push(`/category/search?q=${encodeURIComponent(term)}`);
                        }}
                        aria-label={`Search ${term}`} 
                        className="px-8 py-3 rounded-full border border-stone-300 text-xs font-semibold text-surface-on/60 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-300"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-8">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Suggested Collections</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { name: 'Bras Collection', href: '/category/bras' },
                      { name: 'Panties Collection', href: '/category/panties' },
                      { name: 'Bestsellers', href: '/category/bestsellers' },
                      { name: 'Special Offers', href: '/category/sale' },
                    ].map((col) => (
                      <Link 
                        key={col.name} 
                        href={col.href} 
                        onClick={() => setIsSearchOpen(false)}
                        className="text-xl font-display font-light text-surface-on/60 hover:text-primary transition-colors"
                      >
                        {col.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[100] transition-all duration-700 ${isMenuOpen ? 'visible' : 'invisible'}`}>
        <div 
          className={`absolute inset-0 bg-surface-on/20 backdrop-blur-md transition-opacity duration-700 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMenuOpen(false)}
        />
        <div className={`absolute top-0 left-0 w-[82%] max-w-[320px] h-full bg-white transition-transform duration-500 ease-out px-6 py-5 flex flex-col justify-between rounded-r-[2.5rem] shadow-2xl overflow-y-auto ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          {/* Top Header & Quick Buttons */}
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Menu</span>
              <button 
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu drawer"
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-surface-on hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-lg" aria-hidden="true">close</span>
              </button>
            </div>

            {/* Quick Icons Row (Wishlist and Support) */}
            <div className="grid grid-cols-2 gap-2.5 my-3.5">
              <Link 
                href="/wishlist" 
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-stone-50 rounded-xl text-surface-on-variant hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="material-symbols-outlined text-base">favorite</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">Wishlist</span>
                {isMounted && wishlistItems.length > 0 && (
                  <span className="w-4 h-4 bg-primary text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
              
              <Link 
                href="/contact" 
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-stone-50 rounded-xl text-surface-on-variant hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="material-symbols-outlined text-base">support_agent</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">Support</span>
              </Link>
            </div>

            {/* Main Nav Items */}
            <div className="pt-2">
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-surface-on/35 mb-2.5">Explore</p>
              <nav className="flex flex-col gap-2.5">
                {/* Home Link */}
                <div>
                  <Link 
                    href="/" 
                    className={`text-xl font-display font-light transition-colors tracking-tight block ${pathname === '/' ? 'text-primary font-normal' : 'text-surface-on'}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                </div>

                {navLinks.map((link) => (
                  <div key={link.name} className="space-y-2">
                    <div className="flex items-center justify-between group">
                      {link.groups || link.subsections ? (
                        <button 
                          type="button"
                          onClick={() => {
                            setMobileExpanded(mobileExpanded === link.name ? null : link.name);
                          }}
                          className={`text-xl font-display font-light transition-colors tracking-tight text-left flex-1 flex items-center justify-between py-0.5 ${pathname === link.href || mobileExpanded === link.name ? 'text-primary font-normal' : 'text-surface-on'}`}
                        >
                          <span>{link.name}</span>
                          <span className={`material-symbols-outlined transition-transform duration-300 text-primary/70 text-lg ${mobileExpanded === link.name ? 'rotate-180' : ''}`}>
                            expand_more
                          </span>
                        </button>
                      ) : (
                        <Link 
                          href={link.href} 
                          className={`text-xl font-display font-light transition-colors tracking-tight block py-0.5 ${pathname === link.href ? 'text-primary font-normal' : 'text-surface-on'}`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {link.name}
                        </Link>
                      )}
                    </div>
                    
                    {/* Mobile Sub-sections & Grouped Divisions Accordion */}
                    {(link.groups || link.subsections) && (
                      <div className={`overflow-hidden transition-all duration-300 flex flex-col gap-2.5 pl-3 border-l-2 border-primary/20 ${mobileExpanded === link.name ? 'max-h-[300px] opacity-100 overflow-y-auto pt-1 pb-1' : 'max-h-0 opacity-0'}`}>
                        <div className="flex flex-col gap-1">
                          <Link 
                            href={link.href}
                            className="text-[11px] font-bold uppercase tracking-wider text-primary hover:underline flex items-center justify-between"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <span>Explore All Products</span>
                            <span>&rarr;</span>
                          </Link>
                          <Link 
                            href="/all-categories"
                            className="text-[11px] font-bold uppercase tracking-wider text-stone-600 hover:text-primary flex items-center justify-between"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <span className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-xs text-primary">grid_view</span>
                              <span>All Categories</span>
                            </span>
                            <span>&rarr;</span>
                          </Link>
                        </div>

                        {/* If categorized into groups like Bras & Panties */}
                        {link.groups && link.groups.map((group) => (
                          <div key={group.groupName} className="space-y-1.5 pt-1.5 border-t border-stone-100 first:border-t-0 first:pt-0">
                            <div className="flex items-center justify-between">
                              <Link 
                                href={group.groupHref}
                                onClick={() => setIsMenuOpen(false)}
                                className="text-[11px] font-black uppercase tracking-wider text-stone-900 hover:text-primary flex items-center gap-1"
                              >
                                <span>{group.groupName}</span>
                                <span className="material-symbols-outlined text-[10px] text-primary">arrow_forward</span>
                              </Link>
                            </div>
                            <div className="flex flex-col gap-1 pl-1">
                              {group.items.map((sub) => (
                                <Link 
                                  key={sub.name} 
                                  href={sub.href}
                                  className="text-[11px] font-light text-stone-600 hover:text-primary transition-colors py-0.5"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  {sub.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}

                        {/* Fallback for regular subsections */}
                        {!link.groups && link.subsections && link.subsections.map((sub) => (
                          <Link 
                            key={sub.name} 
                            href={sub.href}
                            className="text-xs font-semibold text-surface-on/70 hover:text-primary transition-colors py-0.5"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </div>

          {/* Footer Utility Links */}
          <div className="pt-4 border-t border-stone-100 mt-4">
            <div className="flex items-center gap-4 mb-2">
              <Link href="/size-guide" className="text-[10px] font-bold uppercase tracking-wider text-surface-on/70 hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Size Guide</Link>
              <span className="text-stone-300">•</span>
              <Link href="/contact" className="text-[10px] font-bold uppercase tracking-wider text-surface-on/70 hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Contact Us</Link>
            </div>
            <p className="text-[9px] text-surface-on-variant/60 font-light">
              Bloomina Collective &copy; 2026
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar - hidden on product detail pages to avoid collision with action bar */}
      {!pathname?.startsWith('/product/') && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-stone-200/80 px-4 py-2 flex items-center justify-around shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
          <Link href="/" className={`flex flex-col items-center gap-0.5 text-[9px] font-bold uppercase tracking-wider ${pathname === '/' ? 'text-primary' : 'text-stone-500'}`}>
            <span className="material-symbols-outlined text-xl" aria-hidden="true">home</span>
            <span>Home</span>
          </Link>
        <Link href="/products" className={`flex flex-col items-center gap-0.5 text-[9px] font-bold uppercase tracking-wider ${pathname?.startsWith('/category') || pathname === '/products' ? 'text-primary' : 'text-stone-500'}`}>
          <span className="material-symbols-outlined text-xl" aria-hidden="true">grid_view</span>
          <span>Shop</span>
        </Link>
        <Link href="/wishlist" className={`flex flex-col items-center gap-0.5 text-[9px] font-bold uppercase tracking-wider relative ${pathname === '/wishlist' ? 'text-primary' : 'text-stone-500'}`}>
          <span className="material-symbols-outlined text-xl" aria-hidden="true">favorite</span>
          <span>Wishlist</span>
          {isMounted && wishlistCount > 0 && (
            <span className="absolute -top-1 right-1 min-w-3.5 h-3.5 px-1 bg-primary text-white text-[8px] font-bold rounded-full flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
        </Link>
        <Link href="/account" className={`flex flex-col items-center gap-0.5 text-[9px] font-bold uppercase tracking-wider ${pathname === '/account' ? 'text-primary' : 'text-stone-500'}`}>
          <span className="material-symbols-outlined text-xl" aria-hidden="true">person</span>
          <span>Account</span>
        </Link>
        <Link href="/cart" className={`flex flex-col items-center gap-0.5 text-[9px] font-bold uppercase tracking-wider relative ${pathname === '/cart' ? 'text-primary' : 'text-stone-500'}`}>
          <span className="material-symbols-outlined text-xl" aria-hidden="true">shopping_cart</span>
          <span>Cart</span>
          {isMounted && cartCount > 0 && (
            <span className="absolute -top-1 right-1 min-w-3.5 h-3.5 px-1 bg-primary text-white text-[8px] font-bold rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
      )}
    </>
  );
};

export default Navbar;
