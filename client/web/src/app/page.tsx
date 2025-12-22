'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Sparkles, PartyPopper, Package } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { useAuthStore } from '@/store';
import { getProducts, getVendors } from '@/actions/products';
import type { Product, Vendor } from '@/types';

export default function HomePage() {
  const { user, isAuthenticated } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, vendorsRes] = await Promise.all([
          getProducts({ limit: 10 }),
          getVendors({ limit: 5 }),
        ]);

        if (productsRes.success && productsRes.data) {
          setProducts(productsRes.data.products);
        }
        if (vendorsRes.success && vendorsRes.data) {
          setVendors(vendorsRes.data.vendors);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto-rotate banners
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const banners = [
    {
      id: 1,
      title: 'Fast & Fresh',
      subtitle: 'Food delivered in 30 mins',
      bgColor: 'from-orange-400 to-red-500',
    },
    {
      id: 2,
      title: 'Best Prices',
      subtitle: 'Save up to 30% on groceries',
      bgColor: 'from-green-400 to-blue-500',
    },
    {
      id: 3,
      title: 'Limited Time',
      subtitle: 'Special offers just for you',
      bgColor: 'from-purple-400 to-pink-500',
    },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
        <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl flex items-center justify-center mb-6">
          <span className="text-white text-4xl font-bold">D</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Drop</h1>
        <p className="text-gray-500 text-center mb-8">Food, Grocery & More Delivered</p>
        <Link href="/auth" className="w-full max-w-xs">
          <Button fullWidth size="lg">
            Get Started
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-4">
      {/* Welcome Header */}
      <div className="px-4 py-4 bg-orange-50 border-b border-orange-100">
        <p className="text-sm text-gray-600">Welcome back, {user?.name || 'User'}!</p>
        <h1 className="text-2xl font-bold text-gray-900">What would you like to order?</h1>
      </div>

      {/* Banner Carousel */}
      <div className="relative h-40 overflow-hidden">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentBanner ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className={`h-full bg-gradient-to-r ${banner.bgColor} relative flex items-center px-6`}>
              <div className="text-white">
                <h2 className="text-2xl font-bold">{banner.title}</h2>
                <p className="text-white/90 mt-1">{banner.subtitle}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Banner Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentBanner ? 'w-6 bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-4 grid grid-cols-3 gap-3">
        <Link href="/party">
          <Card hoverable className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-center py-4">
            <PartyPopper className="h-6 w-6 mx-auto mb-1" />
            <span className="text-sm font-medium">Party Mode</span>
          </Card>
        </Link>
        <Link href="/genie">
          <Card hoverable className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-center py-4">
            <Package className="h-6 w-6 mx-auto mb-1" />
            <span className="text-sm font-medium">Genie</span>
          </Card>
        </Link>
        <Link href="/offers">
          <Card hoverable className="bg-gradient-to-br from-orange-500 to-red-500 text-white text-center py-4">
            <Sparkles className="h-6 w-6 mx-auto mb-1" />
            <span className="text-sm font-medium">Offers</span>
          </Card>
        </Link>
      </div>

      {/* Restaurants Section */}
      <section className="px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Popular Restaurants</h2>
          <Link
            href="/search"
            className="text-orange-500 text-sm font-medium flex items-center gap-1 hover:text-orange-600"
          >
            See all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : vendors.length > 0 ? (
          <div className="space-y-3">
            {vendors.slice(0, 3).map((vendor) => (
              <Link key={vendor.id} href={`/store/${vendor.id}`}>
                <Card hoverable className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{vendor.name}</h3>
                    <p className="text-sm text-gray-500">{vendor.type}</p>
                  </div>
                  <Badge variant="default">{vendor.rating}</Badge>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No vendors available</p>
        )}
      </section>

      {/* Products Section */}
      <section className="px-4 py-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-orange-500" />
          <h2 className="text-lg font-semibold text-gray-900">Trending Now</h2>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {products.slice(0, 4).map((product) => (
              <Card key={product.id} hoverable className="p-3">
                <div className="aspect-square bg-gray-100 rounded-lg mb-2" />
                <h4 className="font-medium text-gray-900 text-sm line-clamp-2">{product.name}</h4>
                <p className="text-orange-500 font-semibold text-sm mt-1">
                  ₹{product.price}
                </p>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No products available</p>
        )}
      </section>

      {/* Subscription Banner */}
      <section className="px-4 py-4">
        <Link href="/subscription">
          <Card className="bg-gradient-to-r from-amber-500 to-orange-500 overflow-hidden">
            <div className="flex items-center justify-between p-4">
              <div className="text-white">
                <Badge variant="default" className="bg-white/20 text-white mb-2">
                  PRIME
                </Badge>
                <h3 className="font-bold text-lg">Get Free Delivery</h3>
                <p className="text-white/90 text-sm mt-1">
                  Subscribe to Drop Prime for unlimited free deliveries
                </p>
              </div>
              <ChevronRight className="h-8 w-8 text-white/70" />
            </div>
          </Card>
        </Link>
      </section>
    </div>
  );
}
