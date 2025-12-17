"use client";
import FullPageLoader from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import React, { useState, useEffect } from "react";
import { format } from "date-fns";

const Articles = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedArticle, setSelectedArticle] = useState(null); // For modal

    const { refetch: refetchArticles, loading: loadingArticles, data: articlesResponse } = useGet({
        url: `${apiUrl}/user/get-articles?page=${currentPage}`,
    });

    useEffect(() => {
        refetchArticles();
    }, [currentPage, refetchArticles]);

    if (loadingArticles) {
        return <FullPageLoader />;
    }

    // API structure fix: top-level is "data"
    const articles = articlesResponse?.articles.data || [];
    const pagination = {
        current_page: articlesResponse?.articles.current_page || 1,
        last_page: articlesResponse?.last_page || 1,
        prev_page_url: articlesResponse?.articles.prev_page_url,
        next_page_url: articlesResponse?.articles.next_page_url,
        links: articlesResponse?.articles.links || [],
    };

    if (articles.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-xl text-gray-600">No articles found.</p>
            </div>
        );
    }

    const isValidUrl = (url) => url && typeof url === "string" && !url.includes("HTTP/1.0 400") && !url.includes("Invalid");

    const getVideoEmbedUrl = (videoUrl) => {
        if (!videoUrl) return null;
        if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
            const videoId = videoUrl.match(/(?:youtube\.com\/.*v=|youtu\.be\/)([^&?]+)/)?.[1];
            return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : null;
        }
        if (videoUrl.includes("vimeo.com")) {
            const videoId = videoUrl.split("/").pop();
            return videoId ? `https://player.vimeo.com/video/${videoId}?autoplay=1` : null;
        }
        return null;
    };

    const openModal = (article) => setSelectedArticle(article);
    const closeModal = () => setSelectedArticle(null);

    return (
        <>
            <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-6">
                {/* Hero Header */}
                <div className="w-full p-4 text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-bg-primary mb-4">
                        Medilinky Articles
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Stay informed with the latest healthcare tips, medical updates, and wellness advice from our experts.
                    </p>
                </div>

                {/* Articles Grid */}
                <div className="w-full p-2 md:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.map((article) => {
                            const hasImage = isValidUrl(article.image_link);
                            const hasVideo = isValidUrl(article.video);
                            const embedUrl = getVideoEmbedUrl(article.video);

                            return (
                                <article
                                    key={article.id}
                                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col group cursor-pointer"
                                    onClick={() => openModal(article)} // Optional: click whole card
                                >
                                    {/* Media Section */}
                                    <div className="relative h-72 overflow-hidden bg-gray-100">
                                        {hasVideo && embedUrl ? (
                                            <iframe
                                                src={embedUrl}
                                                title={article.title}
                                                className="w-full h-full pointer-events-none"
                                                frameBorder="0"
                                                allowFullScreen
                                            />
                                        ) : hasVideo ? (
                                            <div className="relative h-full">
                                                <video src={article.video} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                    <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M8 5v14l11-7z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        ) : hasImage ? (
                                            <img
                                                src={article.image_link}
                                                alt={article.title}
                                                className="w-full h-full object-fit group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="h-full bg-gradient-to-br from-blue-100 via-teal-100 to-bg-primary/20 flex items-center justify-center">
                                                <svg className="w-24 h-24 text-bg-primary opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2m-8 0h8" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex items-center text-sm text-gray-500 mb-3">
                                            <span>By {article.user?.first_name || "Admin"}</span>
                                            <span className="mx-2">•</span>
                                            <time>{format(new Date(article.created_at), "MMM d, yyyy")}</time>
                                        </div>

                                        <h2 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2">
                                            {article.title}
                                        </h2>

                                        <p className="text-gray-600 flex-grow line-clamp-3 mb-4">
                                            {article.body}
                                        </p>

                                        {/* Show More Button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent card click if used
                                                openModal(article);
                                            }}
                                            className="mt-auto self-start text-bg-primary font-semibold hover:text-blue-700 transition-colors inline-flex items-center"
                                        >
                                            Show More
                                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>

                {/* Pagination */}
                {pagination.last_page > 1 && (
                    <div className="max-w-7xl mx-auto mt-12 flex justify-center">
                        <nav className="flex space-x-2">
                            <button
                                onClick={() => setCurrentPage(pagination.current_page - 1)}
                                disabled={!pagination.prev_page_url}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${pagination.prev_page_url
                                    ? "bg-bg-primary text-white hover:bg-blue-700"
                                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    }`}
                            >
                                ← Previous
                            </button>

                            {pagination.links.map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() => link.url && setCurrentPage(new URL(link.url).searchParams.get("page") || pagination.current_page)}
                                    disabled={!link.url || link.active}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${link.active
                                        ? "bg-bg-primary text-white"
                                        : link.url
                                            ? "bg-gray-100 hover:bg-gray-200 text-gray-800"
                                            : "text-gray-400 cursor-not-allowed"
                                        }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}

                            <button
                                onClick={() => setCurrentPage(pagination.current_page + 1)}
                                disabled={!pagination.next_page_url}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${pagination.next_page_url
                                    ? "bg-bg-primary text-white hover:bg-blue-700"
                                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    }`}
                            >
                                Next →
                            </button>
                        </nav>
                    </div>
                )}
            </div>

            {/* Modal Dialog */}
            {selectedArticle && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={closeModal}>
                    <div
                        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Media */}
                        {(() => {
                            const hasImage = isValidUrl(selectedArticle.image_link);
                            const hasVideo = isValidUrl(selectedArticle.video);
                            const embedUrl = getVideoEmbedUrl(selectedArticle.video);

                            return (
                                <div className="relative h-96 bg-gray-100">
                                    {hasVideo && embedUrl ? (
                                        <iframe src={embedUrl} className="w-full h-full" frameBorder="0" allowFullScreen />
                                    ) : hasVideo ? (
                                        <video controls autoPlay className="w-full h-full object-cover">
                                            <source src={selectedArticle.video} />
                                        </video>
                                    ) : hasImage ? (
                                        <img src={selectedArticle.image_link} alt={selectedArticle.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="h-full bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center">
                                            <svg className="w-32 h-32 text-bg-primary opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2m-8 0h8" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            );
                        })()}

                        {/* Modal Content */}
                        <div className="p-8">
                            <div className="flex items-center text-sm text-gray-500 mb-4">
                                <span>By {selectedArticle.user?.first_name || "Admin"}</span>
                                <span className="mx-2">•</span>
                                <time>{format(new Date(selectedArticle.created_at), "MMMM d, yyyy")}</time>
                            </div>

                            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">
                                {selectedArticle.title}
                            </h2>

                            <div className="prose prose-lg max-w-none text-gray-700">
                                <p className="whitespace-pre-wrap">{selectedArticle.body}</p>
                            </div>

                            <button
                                onClick={closeModal}
                                className="mt-8 px-6 py-3 bg-bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Articles;