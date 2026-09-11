import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { BlogPost } from "../types";
import { PageBanner } from "../components/layout/PageBanner";
import { SectionTitle } from "../components/ui/SectionTitle";
import { LucideIcon } from "../components/ui/LucideIcon";
import { MotionCard } from "../components/ui/MotionCard";
import { apiUrl, getImageUrl } from "../lib/api";
import { logger } from '../lib/logger';
import Seo from "../components/Seo";

export default function BlogIndex() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const postsPerPage = 6;

  // Extract all unique categories dynamically
  const categories = useMemo(() => {
    const list = new Set(posts.map((b) => b.category));
    return ["All", ...Array.from(list)];
  }, [posts]);

  // Filter posts based on search text and category selections
  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const filteredBlogs = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory]);

  // Paginate filtered posts
  const paginatedBlogs = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    return filteredBlogs.slice(startIndex, startIndex + postsPerPage);
  }, [filteredBlogs, currentPage]);

  const totalPages = Math.max(Math.ceil(filteredBlogs.length / postsPerPage), 1);

  // Fetch blog posts from backend
  useEffect(() => {
    const ac = new AbortController();
    setLoading(true);
    setError(null);

    fetch(apiUrl("/blogs"), { signal: ac.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load (${res.status})`);
        return res.json();
      })
      .then((raw) => {
        logger.debug("BlogIndex API response:", raw);
        // backend may return { success, message, data: [...] }
        const arr = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : [];

        const mapped: BlogPost[] = arr.map((it: any) => {
          const contentHtml = it.content || "";
          const text = String(contentHtml).replace(/<[^>]*>/g, "").trim();
          return {
            id: it.id || it._id || "",
            slug: it.slug || "",
            title: it.title || "",
            excerpt: it.excerpt || text.slice(0, 160),
            content: String(contentHtml || ""),
            image: getImageUrl(it.image),
            category: it.category || it.metaCategory || "General",
            author: it.authorName || it.createdBy || "",
            date: it.publishedAt ? new Date(it.publishedAt).toLocaleDateString() : it.createdAt ? new Date(it.createdAt).toLocaleDateString() : "",
            tags: Array.isArray(it.tags) ? it.tags : [],
          };
        });

        setPosts(mapped);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        logger.error(err);
        setError("Unable to load publications from server.");
        setLoading(false);
      });

    return () => ac.abort();
  }, []);

  return (
    <div className="bg-black text-white min-h-screen">
      <Seo
        title="Blog"
        description="Engineering and AI writing from the RedFort AI team: architecture, machine learning practice, and lessons from production systems."
      />
      {/* Page Banner */}
      <PageBanner
        title="Engineering Publications"
        subtitle="Weekly research papers, coding guidelines, and technical deep-dives authored by our senior architects."
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Blog" }
        ]}
      />

      {/* Main Content Area */}
      <section className="py-20 bg-black border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-6">

          {/* Search & Category Filter bar */}
          <div className="flex flex-col lg:flex-row gap-6 justify-between items-center mb-16 border-b border-neutral-900 pb-10">
            {/* Search Input */}
            <div className="relative w-full lg:max-w-md font-body">
              <input
                type="text"
                placeholder="Search articles, tags, authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-red-600 text-white placeholder-neutral-500 px-5 py-3.5 pl-12 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-red-600 transition-colors duration-200"
              />
              <LucideIcon
                name="Search"
                className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-red-600 font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category selection scroll bar */}
            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto font-mono">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-[10px] uppercase font-bold tracking-widest rounded-xl border transition-all duration-200 cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-red-600 border-red-600 text-white shadow-[0_0_12px_#D32F2F]"
                      : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-red-600 hover:text-red-600"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Post (Only show on page 1 and if no query/filter active) */}
          {currentPage === 1 && searchQuery === "" && selectedCategory === "All" && posts.length > 0 && (
            <div className="red-glow-card border border-neutral-850 bg-neutral-950 rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 mb-16 group">
              <div className="lg:col-span-7 h-80 lg:h-auto overflow-hidden relative">
                <img
                  src={getImageUrl(posts[0].image)}
                  alt={posts[0].title}
                  className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/60" />
                <div className="absolute top-6 left-6">
                  <span className="bg-red-600 text-white font-mono text-[10px] font-bold px-3 py-1.5 rounded-full tracking-widest uppercase shadow-[0_0_12px_#D32F2F]">
                    FEATURED PUBLICATION
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 p-8 md:p-12 flex flex-col justify-between font-sans bg-neutral-950">
                <div>
                  <div className="flex items-center text-[10px] text-neutral-400 font-mono mb-4 uppercase tracking-widest">
                    <span className="flex items-center space-x-1">
                      <LucideIcon name="Calendar" className="w-3.5 h-3.5 text-red-600" />
                      <span>{posts[0].date}</span>
                    </span>
                    <span className="mx-2 text-neutral-700">•</span>
                    <span>{posts[0].author}</span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-sans font-black text-white mb-4 group-hover:text-red-600 transition-colors leading-tight">
                    <Link to={`/blog/${posts[0].slug}`} className="hover:underline">
                      {posts[0].title}
                    </Link>
                  </h3>

                  <p className="text-neutral-400 text-sm leading-relaxed mb-6 font-body">
                    {posts[0].excerpt}
                  </p>
                </div>

                <div className="pt-6 border-t border-neutral-900 flex items-center justify-between">
                  <Link
                    to={`/blog/${posts[0].slug}`}
                    className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-red-600 group-hover:translate-x-1 transition-transform"
                  >
                    <span>READ PAPER</span>
                    <span>→</span>
                  </Link>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                    {posts[0].category}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Blogs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedBlogs.map((post, idx) => (
              <MotionCard
                key={post.id}
                className="red-glow-card rounded-3xl border border-neutral-850 bg-neutral-950 overflow-hidden flex flex-col justify-between group"
                data-aos="fade-up"
                data-aos-delay={idx * 80}
              >
                <div className="h-52 overflow-hidden relative">
                  <img
                    src={getImageUrl(post.image)}
                    alt={post.title}
                    className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-red-600 text-white font-mono text-[10px] font-bold px-3 py-1 rounded-full tracking-widest uppercase shadow-[0_0_12px_#D32F2F]">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center text-[10px] text-neutral-400 font-mono mb-3 uppercase tracking-widest">
                      <span>{post.date}</span>
                    </div>

                    <h4 className="text-lg font-sans font-extrabold text-white mb-3 group-hover:text-red-600 transition-colors line-clamp-2">
                      <Link to={`/blog/${post.slug}`} className="hover:underline">
                        {post.title}
                      </Link>
                    </h4>

                    <p className="text-neutral-400 text-xs leading-relaxed mb-6 line-clamp-3 font-body">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-neutral-900 flex items-center justify-between">
                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-red-600 group-hover:translate-x-1 transition-transform"
                    >
                      <span>READ PAPER</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </MotionCard>
            ))}
          </div>

          {/* Empty Search Fallback */}
          {filteredBlogs.length === 0 && (
            <div className="text-center py-24 border border-neutral-850 rounded-3xl bg-neutral-950">
              <div className="text-neutral-600 mb-4">
                <LucideIcon name="ShieldQuestion" className="w-12 h-12 mx-auto" />
              </div>
              <h4 className="text-xl font-sans font-extrabold text-white mb-2">
                No Publications Located
              </h4>
              <p className="text-neutral-400 text-sm max-w-sm mx-auto leading-relaxed font-body">
                No articles match search term "{searchQuery}". Try executing another database query.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="mt-8 bg-red-600 hover:bg-red-600/90 text-white px-8 py-3 text-xs font-mono font-bold tracking-widest rounded-xl transition-all shadow-[0_0_15px_#D32F2F]"
              >
                RESET FILTERS
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-4 mt-16 pt-10 border-t border-neutral-900">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((c) => Math.max(c - 1, 1))}
                className="p-3 rounded-xl border border-neutral-800 bg-neutral-950 hover:border-red-600 hover:text-red-600 text-neutral-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all shrink-0"
                aria-label="Previous Page"
              >
                <LucideIcon name="ChevronLeft" className="w-4 h-4" />
              </button>

              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                Page <span className="font-black text-white">{currentPage}</span> of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((c) => Math.min(c + 1, totalPages))}
                className="p-3 rounded-xl border border-neutral-800 bg-neutral-950 hover:border-red-600 hover:text-red-600 text-neutral-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all shrink-0"
                aria-label="Next Page"
              >
                <LucideIcon name="ChevronRight" className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </section>

      {/* Newsletter Banner */}
      <section className="bg-black text-white py-24 border-t border-neutral-900 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-950 border border-neutral-800 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest text-red-600 uppercase font-bold">
              JOIN OUR SCHOLARLY CIRCLE
            </span>
          </div>
          <h2 className="text-2xl md:text-4xl font-sans font-black text-white tracking-tight">
            Subscribe to <span className="text-red-600 drop-shadow-[0_0_15px_#D32F2F]">RedFort Technical Insights</span>
          </h2>
          <p className="text-neutral-400 text-sm max-w-lg mx-auto font-body leading-relaxed">
            Get our latest code blueprints, machine learning fine-tuning schedules, and performance audits sent directly to your desk.
          </p>
          <div className="pt-2 max-w-md mx-auto">
            {newsletterSubscribed ? (
              <p className="text-xs font-mono text-red-600 font-bold py-3">
                ✓ Successfully subscribed to RedFort Technical Insights.
              </p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setNewsletterSubscribed(true);
                  e.currentTarget.reset();
                }}
                className="flex"
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your corporate email"
                  className="flex-grow bg-neutral-950 border border-neutral-800 focus:border-red-600 text-white placeholder-neutral-500 px-4 py-3.5 rounded-l-xl text-xs focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-600/90 text-white px-6 py-3 rounded-r-xl text-xs font-mono font-bold tracking-widest cursor-pointer shadow-[0_0_15px_rgba(211,47,47,0.5)] transition-all"
                >
                  SUBSCRIBE
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
