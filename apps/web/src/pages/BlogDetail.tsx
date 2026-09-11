import { useMemo, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import AOS from "aos";
import { BlogPost } from "../types";
import { PageBanner } from "../components/layout/PageBanner";
import { CTA } from "../components/sections/CTA";
import { LucideIcon } from "../components/ui/LucideIcon";
import { MotionTilt } from "../components/ui/MotionTilt";
import { MotionCard } from "../components/ui/MotionCard";
import { apiUrl, getImageUrl, fetchAllPages } from "../lib/api";
import { logger } from '../lib/logger';
import { sanitizeHtml } from "../lib/sanitize";
import Seo from "../components/Seo";

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch specific post by slug
  useEffect(() => {
    if (!slug) return;
    const ac = new AbortController();
    setLoading(true);
    setError(null);

    fetch(apiUrl(`/blogs/${slug}`), { signal: ac.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Not found (${res.status})`);
        return res.json();
      })
      .then((raw) => {
        logger.debug("BlogDetail API response:", raw);
        // backend can return { success, message, data: [...] } or single object
        let it: any = null;
        if (raw == null) it = null;
        else if (Array.isArray(raw)) it = raw[0] || null;
        else if (Array.isArray(raw?.data)) it = raw.data[0] || null;
        else it = raw?.data || raw;

        if (!it) throw new Error("Article not found");

        const contentHtml = it.content || "";
        const text = String(contentHtml).replace(/<[^>]*>/g, "").trim();

        const mapped: BlogPost = {
          id: it.id || it._id || "",
          slug: it.slug || "",
          title: it.title || "",
          excerpt: it.excerpt || text.slice(0, 160),
          content: String(contentHtml || ""),
          image: getImageUrl(it.image),
          category: it.category || "General",
          author: it.authorName || it.createdBy || "",
          date: it.publishedAt ? new Date(it.publishedAt).toLocaleDateString() : it.createdAt ? new Date(it.createdAt).toLocaleDateString() : "",
          tags: Array.isArray(it.tags) ? it.tags : [],
          // Authored in the CMS; previously fetched and discarded.
          metaTitle: it.metaTitle || undefined,
          metaDescription: it.metaDescription || undefined,
          publishedAt: it.publishedAt || it.createdAt || undefined,
        };

        setCurrentPost(mapped);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        logger.error(err);
        setError("Failed to load article.");
        setLoading(false);
      });

    return () => ac.abort();
  }, [slug]);

  // Fetch list of blogs to show related posts
  useEffect(() => {
    const ac = new AbortController();
    fetchAllPages("/blogs", { signal: ac.signal })
      .then((raw: any) => {
        // The API wraps every payload as { success, message, data }. Treating
        // that object as an array made .filter throw straight into the catch
        // below, so related posts silently never appeared.
        const list: any[] = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.data)
            ? raw.data
            : Array.isArray(raw?.data?.data)
              ? raw.data.data
              : [];

        const related = list
          .filter((b: any) => (b.slug || b._id) !== slug)
          .slice(0, 3)
          .map((it: any) => ({
            id: it.id || it._id || "",
            slug: it.slug || "",
            title: it.title || "",
            excerpt: it.excerpt || "",
            content: it.content || "",
            image: getImageUrl(it.image),
            category: it.category || "General",
            author: it.authorName || it.createdBy || "",
            date: it.publishedAt ? new Date(it.publishedAt).toLocaleDateString() : it.createdAt ? new Date(it.createdAt).toLocaleDateString() : "",
            tags: Array.isArray(it.tags) ? it.tags : [],
          }));
        setRelatedBlogs(related);
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        logger.error("BlogDetail: related posts failed", err);
      });

    return () => ac.abort();
  }, [slug]);


  // Order matters: currentPost is null until the fetch resolves, so the
  // not-found screen must come last or it renders during every load and
  // makes the loading and error states unreachable.
  if (loading) {
    return (
      <div className="bg-black min-h-screen pt-32 pb-20 text-center font-sans">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-red-600">
            <LucideIcon name="Loader2" className="w-12 h-12 mx-auto animate-spin" />
          </div>
          <h2 className="text-2xl font-sans font-extrabold text-white">Loading article…</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black min-h-screen pt-32 pb-20 text-center font-sans">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-red-600">
            <LucideIcon name="ShieldAlert" className="w-16 h-16 mx-auto animate-bounce" />
          </div>
          <h2 className="text-3xl font-sans font-extrabold text-white">Unable to load article</h2>
          <p className="text-neutral-400 text-sm">{error}</p>
          <button
            onClick={() => navigate("/blog")}
            className="bg-red-600 hover:bg-red-600/90 text-white font-mono font-bold text-xs tracking-widest px-8 py-3.5 rounded-xl shadow-[0_0_15px_#D32F2F] transition-all"
          >
            RETURN TO PUBLICATIONS
          </button>
        </div>
      </div>
    );
  }

  // Fetch finished, no error, but no article matched the slug.
  if (!currentPost) {
    return (
      <div className="bg-black min-h-screen pt-32 pb-20 text-center font-sans">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-red-600">
            <LucideIcon name="ShieldAlert" className="w-16 h-16 mx-auto animate-bounce" />
          </div>
          <h2 className="text-3xl font-sans font-extrabold text-white">
            Article Not Located
          </h2>
          <p className="text-neutral-400 text-sm">
            The technical publication you are searching for does not exist in our database. It may
            have been renamed or deprecated.
          </p>
          <button
            onClick={() => navigate("/blog")}
            className="bg-red-600 hover:bg-red-600/90 text-white font-mono font-bold text-xs tracking-widest px-8 py-3.5 rounded-xl shadow-[0_0_15px_#D32F2F] transition-all"
          >
            RETURN TO PUBLICATIONS
          </button>
        </div>
      </div>
    );
  }

  const handleShare = (network: string) => {
    const pageUrl = window.location.href;
    const title = currentPost.title;

    if (network === "copy") {
      navigator.clipboard.writeText(pageUrl);
      alert("Article link copied to clipboard securely.");
    } else if (network === "twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(pageUrl)}`, "_blank");
    } else if (network === "linkedin") {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`, "_blank");
    }
  };

  // Crude helper to format content body cleanly with responsive headers, bold text and listings
  const renderParagraphs = (content: string) => {
    return content.split("\n\n").map((para, pIdx) => {
      const trimmed = para.trim();
      if (!trimmed) return null;

      // Header H1 or H2 formatting
      if (trimmed.startsWith("# ")) {
        return (
          <h2 key={pIdx} className="text-2xl md:text-3xl font-sans font-extrabold text-white tracking-tight mt-10 mb-6 leading-tight">
            {trimmed.replace("# ", "")}
          </h2>
        );
      }
      if (trimmed.startsWith("## ")) {
        return (
          <h3 key={pIdx} className="text-xl md:text-2xl font-sans font-bold text-white tracking-tight mt-8 mb-4">
            {trimmed.replace("## ", "")}
          </h3>
        );
      }
      if (trimmed.startsWith("### ")) {
        return (
          <h4 key={pIdx} className="text-lg font-sans font-bold text-white tracking-tight mt-6 mb-3">
            {trimmed.replace("### ", "")}
          </h4>
        );
      }

      // Code blocks formatter
      if (trimmed.startsWith("```")) {
        const cleaned = trimmed.replace(/```[a-z]*/, "").replace(/```$/, "").trim();
        return (
          <pre
            key={pIdx}
            className="bg-neutral-950 border-l-4 border-red-600 rounded-r-lg p-5 text-neutral-200 text-xs font-mono overflow-x-auto leading-relaxed my-6 shadow-md"
          >
            <code>{cleaned}</code>
          </pre>
        );
      }

      // Bullet points lists formatter
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const items = trimmed.split(/\n[-*] /g);
        return (
          <ul key={pIdx} className="space-y-2.5 my-6 pl-5 text-sm md:text-base text-neutral-300 list-disc font-body">
            {items.map((item, iIdx) => (
              <li key={iIdx} className="leading-relaxed">
                {item.replace(/^[-*] /, "").trim()}
              </li>
            ))}
          </ul>
        );
      }

      // Ordered lists formatter
      if (/^\d+\./.test(trimmed)) {
        const items = trimmed.split(/\n\d+\. /g);
        return (
          <ol key={pIdx} className="space-y-2.5 my-6 pl-5 text-sm md:text-base text-neutral-300 list-decimal font-body">
            {items.map((item, iIdx) => (
              <li key={iIdx} className="leading-relaxed">
                {item.replace(/^\d+\. /, "").trim()}
              </li>
            ))}
          </ol>
        );
      }

      // Standard text paragraphs
      return (
        <p key={pIdx} className="text-neutral-300 text-sm md:text-base leading-relaxed mb-6 font-body">
          {trimmed}
        </p>
      );
    });
  };  return (
    <div className="bg-black text-white min-h-screen">
      <Seo
        title={currentPost.metaTitle || currentPost.title}
        description={currentPost.metaDescription || currentPost.excerpt}
        image={currentPost.image}
        type="article"
        publishedTime={currentPost.publishedAt}
        author={currentPost.author}
      />
      {/* Dynamic breadcrumb page banner */}
      <PageBanner
        title={currentPost.title}
        subtitle={`Authored by ${currentPost.author} on ${currentPost.date}`}
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Blog", path: "/blog" },
          { label: currentPost.category }
        ]}
      />

      <article className="py-20 bg-black relative">
        <div className="max-w-4xl mx-auto px-6">
          {/* Article Cover Image */}
          <MotionTilt className="aspect-[21/9] rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.9)] mb-14 border border-neutral-900">
            <img
              src={currentPost.image}
              alt={currentPost.title}
              className="w-full h-full object-cover brightness-90"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          </MotionTilt>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left sidebar: Share & tags */}
            <div className="lg:col-span-3 space-y-8 font-body">
              {/* Publication metadata */}
              <div className="border-t border-b border-neutral-900 py-6 space-y-5">
                <div>
                  <span className="block text-[10px] text-neutral-500 uppercase tracking-widest font-mono font-bold">
                    Category
                  </span>
                  <span className="text-xs font-mono font-bold text-red-600 block uppercase tracking-widest mt-1.5">
                    {currentPost.category}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-neutral-500 uppercase tracking-widest font-mono font-bold">
                    Published
                  </span>
                  <span className="text-xs font-mono text-white block font-bold mt-1.5">
                    {currentPost.date}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-neutral-500 uppercase tracking-widest font-mono font-bold">
                    Architect
                  </span>
                  <span className="text-xs font-mono text-white block font-bold mt-1.5">
                    {currentPost.author}
                  </span>
                </div>
              </div>

              {/* Share links */}
              <div>
                <span className="block text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-bold mb-4">
                  Share Article
                </span>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleShare("twitter")}
                    className="w-9 h-9 rounded-xl border border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-red-600 hover:border-red-600 flex items-center justify-center transition-all cursor-pointer"
                    aria-label="Share on Twitter"
                  >
                    <LucideIcon name="Twitter" className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleShare("linkedin")}
                    className="w-9 h-9 rounded-xl border border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-red-600 hover:border-red-600 flex items-center justify-center transition-all cursor-pointer"
                    aria-label="Share on LinkedIn"
                  >
                    <LucideIcon name="Linkedin" className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleShare("copy")}
                    className="w-9 h-9 rounded-xl border border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-red-600 hover:border-red-600 flex items-center justify-center transition-all cursor-pointer"
                    aria-label="Copy Link"
                  >
                    <LucideIcon name="Link" className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tags list */}
              <div>
                <span className="block text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-bold mb-3">
                  Key Index
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentPost.tags.map((tag, tagIdx) => (
                    <span
                      key={tagIdx}
                      className="bg-neutral-950 text-neutral-400 border border-neutral-800 px-2.5 py-1 text-[10px] font-mono uppercase font-bold tracking-wider rounded-full hover:border-red-600 hover:text-red-600 transition-colors cursor-default"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right main: Formatted Article */}
            <div className="lg:col-span-9">
              {currentPost.content && /\/?<[a-z][\s\S]*>/i.test(currentPost.content) ? (
                <div
                  className="prose prose-invert prose-sm md:prose-base max-w-none [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white [&_p]:text-neutral-300 [&_a]:text-red-600 [&_blockquote]:border-l-red-600 [&_code]:text-red-400 [&_pre]:bg-neutral-950 [&_pre]:border [&_pre]:border-neutral-800"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(currentPost.content) }}
                />
              ) : (
                renderParagraphs(currentPost.content)
              )}
            </div>
          </div>
        </div>
      </article>

      {/* Related Blogs Block */}
      {relatedBlogs.length > 0 && (
        <section className="py-20 bg-black border-t border-neutral-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-950 border border-neutral-800 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
              <span className="text-[10px] font-mono tracking-widest text-red-600 uppercase font-bold">
                RECENT LITERATURE
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-sans font-black text-white tracking-tight mb-12">
              Related Technical Publications
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedBlogs.map((post, idx) => (
                <MotionCard
                  key={post.id}
                  className="red-glow-card rounded-3xl border border-neutral-850 bg-neutral-950 overflow-hidden flex flex-col justify-between group"
                  data-aos="fade-up"
                  data-aos-delay={idx * 80}
                >
                  <div className="h-44 overflow-hidden relative">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover grayscale brightness-80 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  </div>
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-neutral-500 block mb-2 uppercase tracking-widest">
                        {post.date}
                      </span>
                      <h4 className="text-base font-sans font-extrabold text-white mb-3 group-hover:text-red-600 transition-colors line-clamp-2">
                        <Link to={`/blog/${post.slug}`} className="hover:underline">
                          {post.title}
                        </Link>
                      </h4>
                    </div>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center space-x-1.5 text-xs font-mono font-bold text-red-600 group-hover:translate-x-1 transition-transform mt-4"
                    >
                      <span>READ</span>
                      <span>→</span>
                    </Link>
                  </div>
                </MotionCard>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA section */}
      <CTA />
    </div>
  );
}
