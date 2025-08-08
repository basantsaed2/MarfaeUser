"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

const Testimonials = () => {
  const testimonialsRef = useRef(null);
  const isTestimonialsInView = useInView(testimonialsRef, {
    threshold: 0.3,
    once: false,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerSlide, setCardsPerSlide] = useState(1); // Default to 1 card for small screens
  const containerRef = useRef(null);

  const testimonials = [
    {
      quote:
        "From application to interview, Rekrutalen was there every step. I felt confident and supported throughout my job search!",
      rating: 5,
      author: "Jack Dexter",
      title: "Insurance Manager",
      image: "https://via.placeholder.com/100?text=JD",
    },
    {
      quote:
        "I got matched with a great company thanks to Rekrutalen. The process was smooth and fast. Best experience with a recruitment agency!",
      rating: 4,
      author: "William Hall",
      title: "Construction Mechanic",
      image: "https://via.placeholder.com/100?text=WH",
    },
    {
      quote:
        "Rekrutalen helped me land my dream job in just two weeks! Their team is super supportive and professional. Highly recommend!",
      rating: 5,
      author: "Maggie Ulrey",
      title: "PR Coordinator",
      image: "https://via.placeholder.com/100?text=MU",
    },
    {
      quote:
        "The personalized guidance from Rekrutalen made all the difference. I secured a role that perfectly fits my skills!",
      rating: 5,
      author: "Sarah Johnson",
      title: "Nurse Practitioner",
      image: "https://via.placeholder.com/100?text=SJ",
    },
    {
      quote:
        "Fast, efficient, and reliable. Rekrutalen connected me with my ideal employer in record time!",
      rating: 4,
      author: "Michael Lee",
      title: "Medical Technician",
      image: "https://via.placeholder.com/100?text=ML",
    },
    {
      quote:
        "An amazing service! Rekrutalen’s support helped me transition to a better career path with ease.",
      rating: 5,
      author: "Emily Carter",
      title: "Healthcare Admin",
      image: "https://via.placeholder.com/100?text=EC",
    },
  ];

  // Logic to determine cards per slide based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) { // xl breakpoint
        setCardsPerSlide(3);
      } else if (window.innerWidth >= 768) { // md breakpoint
        setCardsPerSlide(2);
      } else {
        setCardsPerSlide(1); // Default to 1 for smaller screens
      }
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Group testimonials dynamically based on cardsPerSlide
  const slides = [];
  for (let i = 0; i < testimonials.length; i += cardsPerSlide) {
    slides.push(testimonials.slice(i, i + cardsPerSlide));
  }

  // Auto-scroll logic now uses a dynamic number of slides
  useEffect(() => {
    if (isTestimonialsInView) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isTestimonialsInView, slides.length]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.6, 0.05, 0.01, 0.9],
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, 0.05, 0.01, 0.9],
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.6, 0.05, 0.01, 0.9],
      },
    },
    hover: {
      scale: 1.03,
      y: -10,
      boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.18)",
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const dotVariants = {
    inactive: { scale: 0.8, opacity: 0.5, backgroundColor: "#D1D5DB" },
    active: { scale: 1.2, opacity: 1, backgroundColor: "#2563EB" },
    transition: { duration: 0.3, ease: "easeInOut" },
  };

  return (
    <section
      ref={testimonialsRef}
      className="relative py-8 bg-gradient-to-b from-white to-blue-50 overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000 transform -translate-x-1/2 -translate-y-1/2"></div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          className="text-center mb-4"
          variants={containerVariants}
          initial="hidden"
          animate={isTestimonialsInView ? "visible" : "hidden"}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 relative leading-tight"
            variants={titleVariants}
          >
            <span className="inline-block mr-3 text-blue-600">★</span> What Our{" "}
            <span className="text-blue-600">Clients</span> Say
          </motion.h2>
          <motion.p
            className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light"
            variants={itemVariants}
          >
            Hear directly from the professionals who have experienced the{" "}
            <strong className="text-blue-700">Rekrutalen difference</strong>.
            Their success stories are our greatest pride.
          </motion.p>
        </motion.div>
        <div className="relative">
          <div className="overflow-hidden rounded-3xl">
            <motion.div
              ref={containerRef}
              className="flex"
              style={{
                width: `${slides.length * 100}%`,
                transform: `translateX(-${
                  currentIndex * (100 / slides.length)
                }%)`,
              }}
              transition={{ duration: 0.8, ease: [0.6, 0.05, 0.01, 0.9] }}
            >
              {slides.map((slide, slideIndex) => (
                <div
                  key={slideIndex}
                  className="flex gap-8 p-4"
                  style={{ width: `${100 / slides.length}%` }}
                >
                  {slide.map((testimonial, index) => (
                    <motion.div
                      key={index}
                      className="flex-1 p-4 bg-white rounded-3xl shadow-xl border border-blue-100/50 hover:border-blue-300 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden group"
                      variants={itemVariants}
                      initial="hidden"
                      animate={isTestimonialsInView ? "visible" : "hidden"}
                      whileHover="hover"
                    >
                      <span className="absolute top-4 left-4 text-blue-200 text-6xl opacity-30 transform -rotate-12 transition-all duration-300 group-hover:opacity-50 group-hover:scale-110">
                        &ldquo;
                      </span>
                      <div className="mb-6 z-10">
                        <img
                          src={testimonial.image}
                          alt={`${testimonial.author} profile`}
                          className="w-20 h-20 rounded-full object-cover border-4 border-blue-300 ring-4 ring-blue-100 transition-all duration-300 group-hover:border-blue-500 group-hover:ring-blue-200"
                        />
                      </div>
                      <div className="flex mb-4">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-2xl ${
                              i < testimonial.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            } transition-colors duration-200`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <p className="text-gray-800 text-lg mb-6 italic leading-relaxed font-serif relative z-10">
                        &quot;{testimonial.quote}&quot;
                      </p>
                      <h4 className="text-xl font-bold text-blue-800 mb-1 z-10">
                        {testimonial.author}
                      </h4>
                      <p className="text-gray-600 text-lg z-10">
                        {testimonial.title}
                      </p>
                    </motion.div>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>
          <div className="flex justify-center mt-12 space-x-3">
            {slides.map((_, index) => (
              <motion.div
                key={index}
                className="w-3 h-3 bg-gray-400 rounded-full cursor-pointer shadow-md"
                animate={currentIndex === index ? "active" : "inactive"}
                variants={dotVariants}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite cubic-bezier(0.68, -0.55, 0.27, 1.55);
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;