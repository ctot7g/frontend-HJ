// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { Button } from "@/components/button-custom";

// const SLIDE_INTERVAL = 3000;
// const FALLBACK_IMAGE = "/product-img1.png";

// export function ProductsPageHeroSection() {
//   const [heroImages, setHeroImages] = useState<string[]>([]);
//   const [currentSlide, setCurrentSlide] = useState(0);

//   useEffect(() => {
//     fetch(`${process.env.NEXT_PUBLIC_API_URL}/products-hero`)
//       .then((r) => r.json())
//       .then((data) => {
//         if (data?.hero_images?.length > 0) {
//           setHeroImages(data.hero_images);
//         }
//       })
//       .catch(() => {});
//   }, []);

//   const slides = heroImages.length > 0 ? heroImages : [FALLBACK_IMAGE];

//   useEffect(() => {
//     if (slides.length <= 1) return;
//     const timer = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % slides.length);
//     }, SLIDE_INTERVAL);
//     return () => clearInterval(timer);
//   }, [slides.length]);

//   return (
//     <div className="relative">
//       {/* Light blue background for right side */}
//       <div className="absolute inset-0 hidden w-full overflow-hidden lg:block">
//         <div className="relative mx-auto h-full px-4">
//           <div className="bg-light-blue absolute right-0 mt-[-70px] h-full md:w-[50%] 2xl:w-[50%]"></div>
//         </div>
//       </div>

//       <div className="relative h-[350px] overflow-hidden md:h-[620px] 2xl:h-[550px]">
//         {/* Hero Image */}
//         <div className="absolute inset-0 h-full w-full md:mt-[-80px] md:ml-[46px] 2xl:mt-[0px] 2xl:ml-[68px]">
//           <Image
//             src={slides[currentSlide]}
//             alt="Sofa Deals Product Page"
//             fill
//             className="object-cover object-center transition-opacity duration-500"
//             priority
//           />

//           {/* Slide indicator dots */}
//           {slides.length > 1 && (
//             <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 z-10">
//               {slides.map((_, i) => (
//                 <button
//                   key={i}
//                   onClick={() => setCurrentSlide(i)}
//                   className={`h-2 rounded-full transition-all duration-300 ${
//                     i === currentSlide
//                       ? "w-6 bg-white"
//                       : "w-2 bg-white/50 hover:bg-white/75"
//                   }`}
//                 />
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Shop Now button */}
//         <div className="absolute bottom-38 left-4 z-10 px-2 sm:px-[32px]">
//           <Button
//             variant="main"
//             size="xl"
//             rounded="full"
//             className="bg-blue relative items-center justify-start"
//             onClick={() => {
//               document
//                 .getElementById("filters-section")
//                 ?.scrollIntoView({ behavior: "smooth" });
//             }}
//             icon={
//               <Image
//                 src="/arrow-right.png"
//                 alt="arrow-right"
//                 width={20}
//                 height={20}
//                 className="text-blue absolute top-1/2 right-2 h-[30px] w-[30px] -translate-y-1/2 rounded-full bg-[#fff] object-contain p-2 sm:h-[40px] sm:w-[40px]"
//               />
//             }
//           >
//             Shop Now
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/button-custom";

const SLIDE_INTERVAL = 3000;
const FALLBACK_IMAGE = "/product-img1.png";

export function ProductsPageHeroSection() {
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/products-hero`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.hero_images?.length > 0) {
          setHeroImages(data.hero_images);
        }
      })
      .catch(() => {});
  }, []);

  const slides = heroImages.length > 0 ? heroImages : [FALLBACK_IMAGE];

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setOpacity(0);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setOpacity(1);
      }, 500);
    }, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative">
      <div className="relative h-[350px] overflow-hidden md:h-[450px] 2xl:h-[550px]">
        <Image
          src={slides[currentSlide]}
          alt="Sofa Deals Product Page"
          fill
          className="object-cover object-center"
          style={{ opacity, transition: "opacity 0.5s ease-in-out" }}
          priority
        />

        {/* Slide indicator dots */}
        {slides.length > 1 && (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 z-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setOpacity(0);
                  setTimeout(() => { setCurrentSlide(i); setOpacity(1); }, 500);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentSlide ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        )}

        {/* Shop Now button */}
        <div className="absolute bottom-8 left-8 z-10">
          <Button
            variant="main"
            size="xl"
            rounded="full"
            className="bg-blue relative items-center justify-start"
            onClick={() => {
              document.getElementById("filters-section")?.scrollIntoView({ behavior: "smooth" });
            }}
            icon={
              <Image
                src="/arrow-right.png"
                alt="arrow-right"
                width={20}
                height={20}
                className="text-blue absolute top-1/2 right-2 h-[30px] w-[30px] -translate-y-1/2 rounded-full bg-[#fff] object-contain p-2 sm:h-[40px] sm:w-[40px]"
              />
            }
          >
            Shop Now
          </Button>
        </div>
      </div>
    </div>
  );
}