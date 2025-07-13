"use client";

import React from "react";
import companyImage from '@/assets/company.png';
import doctor from '@/assets/doctor.png';
import mainImage from '@/assets/mainImage.png';
import contactus from '@/assets/contactus.png';

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative h-screen max-h-[600px] w-full overflow-hidden">
                <img
                    src={mainImage}
                    alt="Medical professionals working"
                    className="absolute inset-0 w-full h-full object-cover brightness-75"
                />
                
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-transparent flex items-center">
                    <div className="container mx-auto px-6 lg:px-12">
                        <div className="max-w-2xl ml-auto text-right">
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-xl">
                                Discover Your Next Medical Career Opportunity
                            </h1>
                            <p className="text-xl text-white mb-8 drop-shadow-md">
                                Connecting healthcare professionals with top institutions worldwide
                            </p>
                            <button className="bg-white text-blue-800 hover:bg-blue-100 font-semibold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                                Browse Jobs
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Scrolling indicator */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-4 border-white rounded-full flex justify-center">
                        <div className="w-1 h-2 bg-white mt-2 rounded-full"></div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            Your Career Journey Starts Here
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            We partner with leading healthcare providers to bring you the best opportunities in the medical field.
                        </p>
                    </div>
                    
                    <div className="flex flex-col lg:flex-row gap-10 items-center">
                        <div className="lg:w-1/2 order-2 lg:order-1">
                            <div className="bg-blue-700 p-10 rounded-2xl text-white h-full flex flex-col justify-center">
                                <h3 className="text-2xl font-bold mb-4">Why Choose Us?</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start">
                                        <span className="bg-white text-blue-700 rounded-full p-1 mr-3 flex-shrink-0">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                                        </span>
                                        <span>Curated selection of premium medical positions</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="bg-white text-blue-700 rounded-full p-1 mr-3 flex-shrink-0">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                                        </span>
                                        <span>Direct connections with hiring managers</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="bg-white text-blue-700 rounded-full p-1 mr-3 flex-shrink-0">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                                        </span>
                                        <span>Personalized career guidance</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        
                        <div className="lg:w-1/2 order-1 lg:order-2">
                            <img 
                                src={doctor} 
                                alt="Doctor smiling" 
                                className="rounded-2xl shadow-xl w-full h-auto object-cover max-h-[500px]"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Partners Section */}
            <section className="py-20 bg-gray-100">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="flex flex-col lg:flex-row items-center gap-10">
                        <div className="lg:w-1/2">
                            <img 
                                src={companyImage} 
                                alt="Medical facility" 
                                className="rounded-2xl shadow-lg w-full h-auto object-cover"
                            />
                        </div>
                        
                        <div className="lg:w-1/2">
                            <h2 className="text-3xl font-bold text-gray-800 mb-6">
                                Trusted by Leading Healthcare Institutions
                            </h2>
                            <p className="text-lg text-gray-600 mb-8">
                                We've established partnerships with over 500 hospitals, clinics, and research centers across the globe to bring you exclusive career opportunities.
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {[1, 2, 3, 4, 5, 6].map((item) => (
                                    <div key={item} className="bg-white p-4 rounded-lg shadow-md flex items-center justify-center h-20">
                                        <span className="text-gray-400 font-bold">Logo {item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Us Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="flex flex-col lg:flex-row items-center gap-10">
                        <div className="lg:w-1/2">
                            <img 
                                src={contactus} 
                                alt="Contact us" 
                                className="rounded-2xl shadow-xl w-full h-auto object-cover"
                            />
                        </div>
                        
                        <div className="lg:w-1/2">
                            <h2 className="text-3xl font-bold text-gray-800 mb-6">
                                Get In Touch With Us
                            </h2>
                            <p className="text-lg text-gray-600 mb-8">
                                Have questions about our services or need career advice? Our team is ready to assist you with personalized guidance.
                            </p>
                            <form className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-gray-700 mb-2">Your Name</label>
                                    <input 
                                        type="text" 
                                        id="name" 
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter your name"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-gray-700 mb-2">Email Address</label>
                                    <input 
                                        type="email" 
                                        id="email" 
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-gray-700 mb-2">Your Message</label>
                                    <textarea 
                                        id="message" 
                                        rows="4"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="How can we help you?"
                                    ></textarea>
                                </div>
                                <button 
                                    type="submit"
                                    className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-md"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-blue-800 text-white">
                <div className="container mx-auto px-6 lg:px-12 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Advance Your Medical Career?</h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Join thousands of healthcare professionals who found their dream jobs through our platform.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button className="bg-white text-blue-800 hover:bg-blue-100 font-semibold py-3 px-8 rounded-full text-lg transition-all duration-300 shadow-lg">
                            Register Now
                        </button>
                        <button className="bg-transparent border-2 border-white hover:bg-white/10 font-semibold py-3 px-8 rounded-full text-lg transition-all duration-300 shadow-lg">
                            Browse Jobs
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;