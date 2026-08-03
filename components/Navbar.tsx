"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';

const navLinks = [
  { 
    name: 'Bras', 
    href: '/category/bras',
    subsections: [
      { name: 'Padded Bras', href: '/category/bras/padded-bras' },
      { name: 'Non-Padded', href: '/category/bras/non-padded' },
      { name: 'Full Coverage', href: '/category/bras/full-coverage-bras' },
      { name: 'Feeding & Maternity', href: '/category/bras/feeding-maternity-bras' },
      { name: 'Minimizer Bras', href: '/category/bras/minimizer-bra' },
    ],
    featured: {
      title: 'The Petal Bra',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTbghw_WZVzhd9DKApPxJcoUK9cwJkf44QoDbHoRjTRnubMMge4zVDFV4aKhYlPUZNpOupfdzT_0TFOc5M6oK763b3jWnP3FX8u0mOjZs3PFlSuFUrwyW4_flxdqhvotNurlXfZlqgu9fsu5PAuM8dAy-TskCzImUd_-ghDraPg07vOihUfj8zdinMGOjJgvlkxSv-3v0qUaYWyUveFWSIXwp6uyeh7Wq5XildCnMHdWUN0Mar7Gjox8ZGa_kkMAJD0mIuDs0er5Y'
    }
  },
  { 
    name: 'Panties', 
    href: '/category/panties'
  },
  { name: 'Bestsellers', href: '/category/bestsellers' },
  { name: 'Signature', href: '/category/signature' }
];

const Navbar = () => {
  const router = useRouter();
  const [searchVal, setSearchVal] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

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
          <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.05em] md:tracking-[0.3em] text-white animate-pulse whitespace-nowrap overflow-hidden text-ellipsis">
            Ethereal Comfort: Free Shipping all over Kerala
          </p>
        </div>

        <div className="max-w-screen-xl mx-auto px-4 md:px-6 h-16 md:h-20 flex justify-between items-center antialiased relative">
          {/* MOBILE ONLY: Left Side (Menu & Search) */}
          <div className="flex lg:hidden items-center justify-start gap-4 z-10 flex-1">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="text-surface-on-variant hover:text-primary transition-all duration-300 flex-shrink-0"
            >
              <span className="material-symbols-outlined font-light scale-110">menu</span>
            </button>
            
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`text-surface-on-variant hover:text-primary transition-all duration-300 flex-shrink-0 ${isSearchOpen ? 'text-primary scale-110' : ''}`}
            >
              <span className="material-symbols-outlined text-[20px] font-light">search</span>
            </button>
          </div>

          {/* DESKTOP ONLY: Left Side (Logo) */}
          <div className="hidden lg:flex items-center justify-start flex-1 z-10">
            <Link href="/" className="flex items-center">
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
            <Link href="/" className="flex items-center">
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
            <nav className="flex items-center gap-10 px-4 h-full">
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
            {/* Inline search bar in navbar (Desktop) */}
            <div className="hidden lg:flex items-center gap-2 bg-stone-50 hover:bg-stone-100 border border-stone-200/50 rounded-full px-3 py-1.5 transition-all duration-300 group">
              <span className="material-symbols-outlined text-lg text-surface-on-variant/60 font-light group-hover:text-primary transition-colors">search</span>
              <input
                type="text"
                placeholder="Search..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchVal.trim()) {
                    router.push(`/category/search?q=${encodeURIComponent(searchVal.trim())}`);
                  }
                }}
                className="bg-transparent border-none p-0 focus:ring-0 text-[10px] font-semibold uppercase tracking-wider text-surface-on placeholder:text-stone-300 w-28 focus:w-56 transition-all duration-300 outline-none"
              />
            </div>
            <Link href="/contact" className="hidden lg:flex text-surface-on-variant hover:text-primary transition-colors duration-300 flex-shrink-0" title="Contact Us">
              <span className="material-symbols-outlined text-[20px] md:text-2xl font-light">info</span>
            </Link>
            <Link href="/account" className="text-surface-on-variant hover:text-primary transition-colors duration-300 flex-shrink-0">
              <span className="material-symbols-outlined text-[20px] md:text-2xl font-light">person</span>
            </Link>
            <Link href="/wishlist" className="hidden sm:flex text-surface-on-variant hover:text-primary transition-colors duration-300 items-center gap-0.5 group relative flex-shrink-0">
              <span className="material-symbols-outlined text-[20px] md:text-2xl font-light group-hover:scale-110 transition-transform">favorite</span>
              {isMounted && wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            <Link href="/cart" className="text-surface-on-variant hover:text-primary transition-colors duration-300 flex items-center gap-0.5 group relative flex-shrink-0">
              <span className="material-symbols-outlined text-[20px] md:text-2xl font-light group-hover:scale-110 transition-transform">shopping_cart</span>
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
            className={`absolute top-full left-0 w-full bg-white/95 backdrop-blur-2xl border-t border-stone-50 overflow-hidden transition-all duration-500 ease-out shadow-2xl ${hoveredLink && navLinks.find(l => l.name === hoveredLink)?.subsections ? 'max-h-[500px] opacity-100 py-12' : 'max-h-0 opacity-0 py-0 pointer-events-none'}`}
          >
            <div className="max-w-screen-xl mx-auto px-12 grid grid-cols-12 gap-12">
              {/* Sub-sections */}
              <div className="col-span-8 grid grid-cols-2 gap-x-12 gap-y-8">
                {navLinks.find(l => l.name === hoveredLink)?.subsections?.map((sub) => (
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

              {/* Featured Card */}
              <div className="col-span-4 border-l border-stone-100 pl-12 flex flex-col justify-center">
                {hoveredLink && navLinks.find(l => l.name === hoveredLink)?.featured ? (
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
                ) : (
                  <div className="space-y-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">The Bloomina Way</p>
                    <p className="text-sm font-light leading-relaxed text-surface-on-variant">
                      Crafted for the feminine silhouette, our collections embrace the philosophy of ethereal comfort and timeless elegance.
                    </p>
                    <Link href="/about" className="inline-block text-[10px] font-bold uppercase tracking-widest text-primary underline underline-offset-8">Our Philosophy</Link>
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
                  className="p-3 rounded-full hover:bg-stone-50 text-surface-on/20 hover:text-primary transition-all duration-500"
                >
                  <span className="material-symbols-outlined text-3xl md:text-4xl font-light">close</span>
                </button>
              </div>

              <div className="flex items-center justify-between border-b border-primary/15 pb-6 md:pb-10 mb-16 group">
                <div className="flex-1 flex items-center gap-4 md:gap-10">
                  <span className="material-symbols-outlined text-3xl md:text-5xl text-primary font-light">search</span>
                  <input 
                    type="text" 
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
                      <button key={term} className="px-8 py-3 rounded-full border border-stone-100 text-xs font-semibold text-surface-on/40 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-300">
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-8">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Suggested Collections</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {['Innerwear Essentials', 'Lounge Sanctuary', 'Silk Rituals', 'New Arrivals'].map((col) => (
                      <Link key={col} href="/products" className="text-xl font-display font-light text-surface-on/60 hover:text-primary transition-colors">
                        {col}
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
        <div className={`absolute top-0 left-0 w-[80%] max-w-[320px] h-full bg-white transition-transform duration-700 ease-out p-12 flex flex-col rounded-r-[3rem] shadow-2xl ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="self-end text-surface-on-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-3xl font-light">close</span>
          </button>

          {/* Quick Icons Row (Wishlist and Info/Support) */}
          <div className="flex items-center gap-4 mt-8 py-4 border-b border-stone-100">
            <Link 
              href="/wishlist" 
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-stone-50 rounded-2xl text-surface-on-variant hover:text-primary transition-colors duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="material-symbols-outlined font-light text-[20px]">favorite</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">Wishlist</span>
              {isMounted && wishlistItems.length > 0 && (
                <span className="w-4 h-4 bg-primary text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            
            <Link 
              href="/contact" 
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-stone-50 rounded-2xl text-surface-on-variant hover:text-primary transition-colors duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="material-symbols-outlined font-light text-[20px]">info</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">Support</span>
            </Link>
          </div>

          <div className="mt-8 space-y-12 overflow-y-auto">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-surface-on/30">Explore</h2>
            <nav className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <div key={link.name} className="space-y-4">
                  <div className="flex items-center justify-between group">
                    <Link 
                      href={link.href} 
                      className={`text-3xl font-display font-light transition-colors tracking-tight ${pathname === link.href ? 'text-primary' : 'text-surface-on'}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                    {link.subsections && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setMobileExpanded(mobileExpanded === link.name ? null : link.name);
                        }}
                        className="p-2 text-primary/40"
                      >
                        <span className={`material-symbols-outlined transition-transform duration-500 ${mobileExpanded === link.name ? 'rotate-180' : ''}`}>
                          expand_more
                        </span>
                      </button>
                    )}
                  </div>
                  
                  {/* Mobile Sub-sections Accordion */}
                  {link.subsections && (
                    <div className={`overflow-hidden transition-all duration-500 flex flex-col gap-4 pl-4 border-l border-primary/10 ${mobileExpanded === link.name ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
                      {link.subsections.map((sub) => (
                        <Link 
                          key={sub.name} 
                          href={sub.href}
                          className="text-sm font-semibold text-surface-on/60 hover:text-primary transition-colors"
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

          <div className="mt-auto space-y-8 pt-12 border-t border-primary/5">
            <div className="flex flex-col gap-4">
              <Link href="/account" className="text-xs font-bold uppercase tracking-widest text-surface-on/40 hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>My Account</Link>
              <Link href="/size-guide" className="text-xs font-bold uppercase tracking-widest text-surface-on/40 hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Size Guide</Link>
              <Link href="/contact" className="text-xs font-bold uppercase tracking-widest text-surface-on/40 hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Contact Us</Link>
              <Link href="/feedback" className="text-xs font-bold uppercase tracking-widest text-surface-on/40 hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Feedback</Link>
            </div>
            <p className="text-[10px] text-surface-on-variant font-light">
              Crafting elegance since 2026. <br />
              Bloomina Collective.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
