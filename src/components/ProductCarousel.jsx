import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Sparkles } from 'lucide-react';
import ProductCard from './ProductCard';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ProductCarousel = ({ products, title, subtitle }) => {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {(title || subtitle) && (
          <div className="mb-14 flex flex-col items-center text-center">
            {subtitle && (
              <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[4px] text-[10px] mb-4">
                <Sparkles className="w-4 h-4" /> {subtitle}
              </div>
            )}
            {title && <h2 className="text-4xl md:text-5xl font-black tracking-tight">{title}</h2>}
            <div className="w-16 h-1.5 bg-primary/20 mt-6 rounded-full overflow-hidden">
               <div className="w-1/2 h-full bg-primary rounded-full animate-progress-slow shadow-[0_0_15px_rgba(255,153,0,0.5)]"></div>
            </div>
          </div>
        )}

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          className="pb-12"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ProductCarousel;
