export type CloudflareImageVariant = "public" | "thumbnail" | "hero" | "lqip" | string;

export type CloudflareImageUrls = {
  preview: string; // The optimized fast preview (<50KB)
  final: string;   // The full high-quality image
};

// Check if Cloudflare Images is active (by checking environment variables)
export function isCloudflareEnabled(): boolean {
  return typeof import.meta.env.VITE_CLOUDFLARE_ACCOUNT_HASH === 'string' && 
         import.meta.env.VITE_CLOUDFLARE_ACCOUNT_HASH.trim().length > 0;
}

// Generate full delivery URL
export function cloudflareImageUrl(accountHash: string, imageId: string, variant: CloudflareImageVariant): string {
  // If variant contains width/height/quality/etc. or is standard variant name
  return `https://imagedelivery.net/${accountHash}/${imageId}/${variant}`;
}

// Generate the fast preview and final URLs for blur-up loading
export function cloudflareBlurUpUrls(
  accountHash: string,
  imageId: string,
  finalVariant: CloudflareImageVariant = "public",
  isHero: boolean = false
): CloudflareImageUrls {
  // Dynamic parameters for fast preview under 50KB:
  // - Hero images: slightly higher width for visual balance (600px, quality 55)
  // - Small images: standard card width (400px, quality 50)
  const previewOptions = isHero
    ? "width=600,quality=55,format=auto"
    : "width=400,quality=50,format=auto";

  return {
    preview: cloudflareImageUrl(accountHash, imageId, previewOptions),
    final: cloudflareImageUrl(accountHash, imageId, finalVariant),
  };
}

// Map of local image filenames (cleaned of cache hashes) to Cloudflare Image IDs.
// Users can upload local assets to Cloudflare Images using these custom IDs.
export const LOCAL_TO_CLOUDFLARE_MAP: Record<string, string> = {
  // Core Portfolio & About
  'portfolio-legit.png': 'portfolio_legit',
  'portfolio-me.jpg': 'portfolio_me',
  'project-logistics.jpg': 'project_logistics',
  'project-restaurant.jpg': 'project_restaurant',
  'project-saas.jpg': 'project_saas',

  // Legit Logistics Case Study Screens
  'portfolio-legit-dashboard.png': 'legit_dashboard',
  'portfolio-legit-dashboard-mobile.png': 'legit_dashboard_mobile',
  'portfolio-legit-driver.png': 'legit_driver',
  'portfolio-legit-driver-mobile.png': 'legit_driver_mobile',
  'portfolio-legit-lookup.png': 'legit_lookup',
  'portfolio-legit-lookup-mobile.png': 'legit_lookup_mobile',
  'portfolio-legit-tracking.png': 'legit_tracking',
  'portfolio-legit-tracking-mobile.png': 'legit_tracking_mobile',

  // Delivah Dispatch Case Study Screens
  'delivah-dispatch.png': 'delivah_dispatch',
  'delivah-home-hero.png': 'delivah_home_hero',
  'delivah-home-hero-mobile.png': 'delivah_home_hero_mobile',
  'delivah-services.png': 'delivah_services',
  'delivah-services-mobile.png': 'delivah_services_mobile',
  'delivah-contact-form.png': 'delivah_contact_form',
  'delivah-contact-form-mobile.png': 'delivah_contact_form_mobile',
  'delivah-register-step-1.png': 'delivah_register_step_1',
  'delivah-register-step-1-mobile.png': 'delivah_register_step_1_mobile',
  'delivah-register-document-upload.png': 'delivah_register_document_upload',
  'delivah-register-document-upload-mobile.png': 'delivah_register_document_upload_mobile',
  'delivah-admin-login.png': 'delivah_admin_login',
  'delivah-admin-login-mobile.png': 'delivah_admin_login_mobile',

  // Kossy Langat Case Study Screens
  'kossy-langat.png': 'kossy_langat',
  'kossy-home-hero.png': 'kossy_home_hero',
  'kossy-home-hero-mobile.png': 'kossy_home_hero_mobile',
  'kossy-about-values.png': 'kossy_about_values',
  'kossy-about-values-mobile.png': 'kossy_about_values_mobile',
  'kossy-mentorship-hero.png': 'kossy_mentorship_hero',
  'kossy-mentorship-hero-mobile.png': 'kossy_mentorship_hero_mobile',
  'kossy-work-index.png': 'kossy_work_index',
  'kossy-work-index-mobile.png': 'kossy_work_index_mobile',

  // Blog Post Editorial Illustrations
  'article1-architectural-glass.png': 'blog_article1_glass',
  'article1-mechanical-joints.png': 'blog_article1_joints',
  'article1-abstract-titanium.png': 'blog_article1_titanium',
  'article2-brutalist-desert.png': 'blog_article2_desert',
  'article2-analog-compass.png': 'blog_article2_compass',
  'article2-obsidian-crystal.png': 'blog_article2_obsidian',
  'article3-polished-stone.png': 'blog_article3_stone',
  'article3-concrete-archway.png': 'blog_article3_archway',
  'article3-metallic-shield.png': 'blog_article3_shield',

  // Process Page Journey & Hero Illustration Images
  '07-refresh-process.png': 'process_hero',
  '02-launch-plan.png': 'process_stage1',
  '06-refresh-strategy.png': 'process_stage2',
  '08-refresh-transformation.png': 'process_stage3',
  '11-ongoing-workflow.png': 'process_stage4',
  '12-ongoing-success.png': 'process_stage5',
  'process-journey-path.png': 'process_journey_path'
};

// Retrieve Cloudflare imageId by path/src string
export function getCloudflareImageId(src: string): string | null {
  if (!src) return null;
  // Extract filename (e.g. "/portfolio-legit.png" -> "portfolio-legit.png")
  const cleanSrc = src.split('?')[0].split('/').pop() || '';
  // Strip Vite production cache-busting hashes:
  // e.g. "article1-architectural-glass-B3d5x234.png" -> "article1-architectural-glass.png"
  const cleanName = cleanSrc.replace(/-[a-zA-Z0-9]{8,10}\.(png|jpg|jpeg|webp|svg)$/, '.$1');

  return LOCAL_TO_CLOUDFLARE_MAP[cleanName] || LOCAL_TO_CLOUDFLARE_MAP[cleanSrc] || null;
}
