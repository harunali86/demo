import { Suspense } from 'react';
import Navbar from "@/components/ui/Navbar";
import HeroCarousel from "@/components/home/HeroCarousel";
import CategoryRail from "@/components/home/CategoryRail";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import DealOfTheDay from "@/components/home/DealOfTheDay";
import FlashSales from "@/components/home/FlashSales";
import RecentlyViewed from "@/components/home/RecentlyViewed";
import Footer from "@/components/ui/Footer";
import FilterBar from "@/components/home/FilterBar";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f1f3f6]">
      <Navbar />
      <HeroCarousel />
      <CategoryRail />

      {/* Filters */}
      <div className="mt-6 mx-4">
        <Suspense fallback={<div className="h-12 bg-[#12121a] rounded-xl" />}>
          <FilterBar />
        </Suspense>
      </div>

      {/* Featured Products */}
      <div className="mt-6 mx-4">
        <Suspense fallback={<div className="h-96 bg-[#12121a] rounded-xl" />}>
          <FeaturedProducts />
        </Suspense>
      </div>

      {/* Deal of the Day */}
      <div className="mt-6 mx-4">
        <DealOfTheDay />
      </div>

      {/* Flash Sales */}
      <div className="mt-6 mx-4">
        <FlashSales />
      </div>

      {/* Recently Viewed */}
      <div className="mt-6 mx-4 mb-8">
        <RecentlyViewed />
      </div>

      <Footer />
    </main>
  );
}
