import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { BlogPost } from "../types";
import { SectionTitle } from "./SectionTitle";
import { LucideIcon } from "./LucideIcon";
import { MotionCard } from "./MotionCard";
import { apiUrl, getImageUrl } from "../lib/api";

interface LatestBlogsProps {
  limit?: number;
  showTitle?: boolean;
}

export function LatestBlogs({ limit, showTitle = true }: LatestBlogsProps) {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(apiUrl("/blogs"));
        if (!res.ok) {
          console.error("LatestBlogs: fetch failed", res.status);
          setPosts([]);
          return;
        }

        const json = await res.json();
        const list = Array.isArray(json)
          ? json
          : Array.isArray(json?.data)
          ? json.data
          : [];

        const sorted = (list || []).slice().sort((a: any, b: any) => {
          const aDate = Date.parse(a.publishedAt || a.createdAt || "") || 0;
          const bDate = Date.parse(b.publishedAt || b.createdAt || "") || 0;
          return bDate - aDate;
        });
        setPosts(sorted);
      } catch (err: any) {
        console.error("LatestBlogs: fetch error", err);
        setPosts([]);
      }
    };

    load();
  }, []);

  const normalize = (it: any) => {
    const contentHtml = it.content || "";
    const text = String(contentHtml).replace(/<[^>]*>/g, "").trim();
    return {
      id: it.id || it._id || "",
      slug: it.slug || "",
      title: it.title || "",
      excerpt: it.excerpt || text.slice(0, 160),
      content: String(contentHtml || ""),
      image: getImageUrl(it.image),
      category: it.category || "AI RESEARCH",
      author: it.authorName || it.createdBy || "RedFort Core Lab",
      date: it.publishedAt ? new Date(it.publishedAt).toLocaleDateString() : it.createdAt ? new Date(it.createdAt).toLocaleDateString() : "",
      tags: Array.isArray(it.tags) ? it.tags : [],
    } as BlogPost;
  };

  const displayedBlogs = (limit ? posts.slice(0, limit) : posts).map(normalize);

  return (
    <section className="bg-black text-white py-28 relative overflow-hidden border-b border-neutral-900">
      {/* Red Ambient Background Glow */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-red-600/10 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {showTitle && (
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
            <SectionTitle
              subtitle="PUBLICATIONS & INSIGHTS"
              title="Latest AI Research {& Architecture Papers}"
              light
            />
            {limit && (
              <Link
                to="/blog"
                className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-red-600 hover:text-white transition-colors border-b-2 border-red-600 pb-1 mb-4 md:mb-12 self-start md:self-auto"
              >
                <span>VIEW ALL PUBLICATIONS</span>
                <span>→</span>
              </Link>
            )}
          </div>
        )}

        {displayedBlogs.length === 0 ? (
          <div className="text-center py-20 border border-red-600/30 rounded-3xl bg-neutral-950">
            <p className="text-xs font-mono text-neutral-400">
              No latest research publications available right now.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedBlogs.map((post, idx) => (
              <MotionCard
                key={post.id}
                className="rounded-3xl border border-red-600/40 hover:border-red-600/70 bg-neutral-950 overflow-hidden flex flex-col justify-between group cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.8)] hover:shadow-[0_0_15px_rgba(211,47,47,0.18)] transition-all duration-300"
                data-aos="fade-up"
                data-aos-delay={idx * 80}
                id={`blog-post-${post.id}`}
              >
                {/* Image Header */}
                <div className="h-56 overflow-hidden relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  
                  {/* Floating Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-red-600 text-white font-mono text-[10px] font-bold px-3 py-1 rounded-full tracking-widest uppercase shadow-[0_0_12px_#D32F2F]">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Text Content */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center text-[10px] text-neutral-400 font-mono mb-3 uppercase tracking-wider">
                      <span className="flex items-center space-x-1">
                        <LucideIcon name="Calendar" className="w-3.5 h-3.5 text-red-600" />
                        <span>{post.date}</span>
                      </span>
                      <span className="mx-2 text-neutral-700">•</span>
                      <span className="flex items-center space-x-1">
                        <LucideIcon name="User" className="w-3.5 h-3.5 text-red-600" />
                        <span>{post.author}</span>
                      </span>
                    </div>

                    <h3 className="text-xl font-sans font-extrabold text-white mb-3 group-hover:text-red-600 transition-colors line-clamp-2">
                      <Link to={`/blog/${post.slug}`} className="hover:underline">
                        {post.title}
                      </Link>
                    </h3>

                    <p className="text-neutral-400 text-xs leading-relaxed font-body mb-6 line-clamp-3">
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

                    <div className="text-neutral-500 hover:text-red-600 transition-colors">
                      <LucideIcon name="Bookmark" className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </MotionCard>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

