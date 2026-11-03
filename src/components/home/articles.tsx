import { Inter, IBM_Plex_Mono } from "next/font/google";
import { ArrowUpRight } from "lucide-react";
import data from "@/content/articles.json";
import { ArticleImage } from "@/components/blog/article-image";
import { ArticleTitle } from "@/components/blog/article-title";
import { SectionLabel } from "./section-label";
import styles from "./articles.module.css";

const inter = Inter({ subsets: ["latin"], variable: "--articles-sans" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--articles-mono" });
const featured = data.posts[0];

export function Articles() {
  return (
    <section id="articles" aria-labelledby="articles-heading" className={`${styles.section} ${inter.variable} ${mono.variable}`}>
      <div className={styles.inner}>
        <header className={styles.heading}>
          <div>
            <SectionLabel>Insights &amp; Field Notes</SectionLabel>
            <h2 id="articles-heading">Practical Website &amp; Software<em>Field Notes for Growing Brands.</em></h2>
          </div>
          <a href="/blog" className={styles.archive}>All articles <ArrowUpRight size={15} aria-hidden /></a>
        </header>
        <div className={styles.layout}>
          <a href={`/blog/${featured.slug}`} className={styles.featured}>
            <div className={styles.meta}>Blueprint 01 // {featured.category}</div>
            <ArticleImage src={featured.featuredImage} alt="" className={styles.image} sizes="(max-width: 639px) calc(100vw - 80px), (max-width: 1279px) 42vw, 430px" />
            <ArticleTitle title={featured.title} accent={featured.titleItalic} className={styles.cardTitle} />
            <p className={styles.description}>{featured.description}</p>
            <div className={styles.cardFooter}><span>{featured.author} · {featured.readTime} min read</span><span>Open article <ArrowUpRight size={14} aria-hidden /></span></div>
          </a>
          <a href={`/blog/${featured.slug}`} className={styles.spotlight}>
            <div className={styles.meta}>Editor’s Ink Spotlight // {featured.category}</div>
            <ArticleImage src={featured.featuredImage} alt="" className={styles.image} sizes="(max-width: 639px) calc(100vw - 80px), (max-width: 1279px) 42vw, 380px" />
            <ArticleTitle title={featured.title} accent={featured.titleItalic} className={styles.cardTitle} />
            <p className={styles.description}>{featured.description}</p>
            <div className={styles.cardFooter}><span>{featured.author} · {featured.readTime} min read</span><span>Open spotlight <ArrowUpRight size={14} aria-hidden /></span></div>
          </a>
          <ol className={styles.ledger} aria-label="Article index">
            {data.posts.map((post, index) => (
              <li key={post.slug}>
                <a href={`/blog/${post.slug}`} className={`${styles.row} ${index === 0 ? styles.active : ""}`}>
                  <span className={styles.number} aria-hidden>{String(index + 1).padStart(2, "0")}</span>
                  <div className={styles.rowContent}>
                    <div className={styles.meta}>{post.category} · {post.readTime} min read</div>
                    <ArticleTitle title={post.title} accent={post.titleItalic} className={styles.rowTitle} />
                  </div>
                  <span className={styles.read}>Read <ArrowUpRight size={11} aria-hidden /></span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
