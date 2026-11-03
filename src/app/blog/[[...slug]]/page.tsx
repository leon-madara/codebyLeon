import type { Metadata } from "next";
import Link from "next/link";
import { House } from "lucide-react";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Children, isValidElement, type ReactElement, type ReactNode } from "react";
import { ArticleTitle } from "@/components/blog/article-title";
import { CodeBlock } from "@/components/blog/code-block";
import { ArticleTurnLink } from "@/components/blog/article-turn";
import data from "@/content/articles.json";
import { BlogHeader, ReadingRail } from "@/components/blog/article-controls";
import { ArticleImage } from "@/components/blog/article-image";
import { SectionLabel } from "@/components/home/section-label";
import styles from "@/components/blog/blog.module.css";
import { socialMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug?: string[] }> };
const posts = data.posts;
export function generateStaticParams() {
  return [{ slug: [] }, ...posts.map((post) => ({ slug: [post.slug] }))];
}
const titleFor = (post: typeof posts[number]) => `${post.title} ${post.titleItalic ?? ""}`.trim();
const notes = posts.map((post) => ({ slug: post.slug, title: titleFor(post), category: post.category }));
const formatDate = (date: string) => new Date(`${date}T12:00:00Z`).toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

type Chapter = { id: string; title: string };
function ChapterNav({ chapters, inline = false }: { chapters: Chapter[]; inline?: boolean }) {
  return <nav className={`${styles.chapters} ${inline ? styles.chaptersInline : styles.chaptersDesktop}`} aria-label="On this page">
    <h2>On this page</h2>
    <ol>{chapters.map((chapter, index) => <li key={chapter.id}>
      <a href={`#${chapter.id}`}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><span>{chapter.title}</span></a>
    </li>)}</ol>
  </nav>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = slug?.length === 1 ? posts.find((item) => item.slug === slug[0]) : undefined;
  if (slug?.length && !post) notFound();
  const title = post ? titleFor(post) : "Articles";
  const description = post?.description ?? "Notes on websites, design and software from Code by Leon.";
  const url = `https://codebyleon.com/blog${post ? `/${post.slug}` : ""}`;
  const social = socialMetadata(title, description, `/blog${post ? `/${post.slug}` : ""}`, post?.featuredImage);
  return { title: `${title} | Code by Leon`, description, alternates: { canonical: url }, ...social,
    openGraph: { ...social.openGraph, type: post ? "article" : "website",
      ...(post ? { publishedTime: post.publishedDate, authors: [post.author] } : {}) } };
}

export default async function BlogPage({ params }: Props) {
  const { slug } = await params;
  const activeIndex = slug?.length === 1 ? posts.findIndex((post) => post.slug === slug[0]) : -1;
  if (slug?.length && activeIndex < 0) notFound();
  const post = activeIndex >= 0 ? posts[activeIndex] : undefined;
  const next = post ? posts[activeIndex + 1] : undefined;
  // Source line IDs also come from Markdown's heading nodes, so repeated titles remain distinct.
  const chapters = post?.content.split("\n").flatMap((line, index) =>
    line.startsWith("## ") ? [{ id: `chapter-${index + 1}`, title: line.slice(3).trim() }] : []
  ) ?? [];
  return <div className={styles.page}>
    <BlogHeader posts={notes} activeIndex={activeIndex} />
    {post ? <main className={styles.layout}>
      <ReadingRail key={post.slug} slug={post.slug} title={titleFor(post)} />
      <article className={styles.article} data-article-index={activeIndex}>
        <header>
          <div className={styles.meta}><span>{post.category}</span><span>{post.readTime} min read</span></div>
          <ArticleTitle as="h1" title={post.title} accent={post.titleItalic} className={styles.title} />
          <p className={styles.dek}>{post.description}</p>
          <div className={styles.byline}><span>By {post.author}</span><time dateTime={post.publishedDate}>{formatDate(post.publishedDate)}</time></div>
          <ArticleImage src={post.featuredImage} alt={titleFor(post)} priority className={styles.cover} />
        </header>
        {chapters.length > 0 && <ChapterNav chapters={chapters} inline />}
        <div id="article-body" className={styles.body}>
          <ReactMarkdown components={{
            h2: ({ node, children }) => <h2 id={`chapter-${node?.position?.start.line}`} tabIndex={-1}>{children}</h2>,
            pre: ({ children }) => {
              const element = Children.toArray(children).find(isValidElement) as ReactElement<{ children?: ReactNode; className?: string }> | undefined;
              const code = String(element?.props.children ?? "").replace(/\n$/, "");
              const language = element?.props.className?.replace("language-", "") ?? "";
              return <CodeBlock code={code} language={language} />;
            },
            img: ({ src, alt }) => typeof src === "string" ? <ArticleImage src={src} alt={alt ?? ""} /> : null,
            a: ({ href, children }) => <a href={href?.startsWith("/get-started?") ? href.replace("/get-started?", "/get-started.html?") : href}>{children}</a>,
          }}>{post.content}</ReactMarkdown>
        </div>
        {next && <ArticleTurnLink className={styles.next} index={activeIndex + 1} slug={next.slug}><span>Keep reading →</span><ArticleTitle title={next.title} accent={next.titleItalic} className={styles.nextTitle} /></ArticleTurnLink>}
      </article>
      {chapters.length > 0 && <ChapterNav chapters={chapters} />}
    </main> : <main className={styles.archive}>
      <div className={styles.archiveHeading}><SectionLabel>Insights</SectionLabel><h1 className={styles.title}>Articles & field notes</h1><p className={styles.dek}>Notes on websites, design and software, from planning a clearer website to building tools that fit your business.</p></div>
      {posts.map((item, index) => <Link key={item.slug} prefetch={false} href={`/blog/${item.slug}`} className={styles.entry}>
        <ArticleImage src={item.featuredImage} alt={titleFor(item)} priority={index === 0} sizes="(max-width: 600px) calc(100vw - 40px), (max-width: 900px) 200px, 260px" />
        <div className={styles.entryContent}><div className={styles.meta}><span>{item.category}</span><span>{item.readTime} min read</span></div><ArticleTitle as="h2" title={item.title} accent={item.titleItalic} /><p>{item.description}</p><div className={styles.byline}>{item.author} · {formatDate(item.publishedDate)}</div></div>
      </Link>)}
    </main>}
    <footer className={styles.footer}><div className={styles.footerHomeWrap}><Link href="/" className={styles.footerHome} aria-label="Back to Home" aria-describedby="back-home-hint"><House size={18} aria-hidden="true" /></Link><span id="back-home-hint" role="tooltip" className={styles.footerHomeHint}>Back to Home</span></div><Link href="/get-started.html" className={styles.footerProject}>Discuss your project</Link></footer>
  </div>;
}
