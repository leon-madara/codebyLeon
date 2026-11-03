/* Images are precompressed WebP derivatives; native srcSet avoids a second encode. */
import data from "@/content/articles.json";

export function ArticleImage({ src, alt, priority = false, className, sizes = "(max-width: 800px) calc(100vw - 40px), 760px" }: {
  src: string; alt: string; priority?: boolean; className?: string; sizes?: string;
}) {
  const image = (data.images as Record<string, { width: number; height: number; srcSet: { src: string; width: number }[] }>)[src];
  if (!image) return null;
  return <img src={src} alt={alt} width={image.width} height={image.height}
    srcSet={image.srcSet.map((item) => `${item.src} ${item.width}w`).join(", ")}
    sizes={sizes}
    loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"}
    decoding="async" className={className} />;
}
