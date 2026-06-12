import os
import re

files = [
    'src/pages/LegitLogisticsCaseStudyPage.tsx',
    'src/pages/KossyLangatCaseStudyPage.tsx',
    'src/pages/DelivahDispatchCaseStudyPage.tsx'
]

for filepath in files:
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Extract the identifier (e.g., 'legit', 'kossy', 'delivah') from the class name
    match = re.search(r'className="blog-post-page-wrapper[^"]*case-study--([^"\s]+)"', content)
    if not match:
        print(f"Could not find case-study-- class in {filepath}")
        continue
    case_study_id = match.group(1)

    # 1. Add stripRef to refs
    content = re.sub(
        r'(const pageWrapperRef = useRef<HTMLDivElement>\(null\);)',
        r'\1\n  const stripRef = useRef<HTMLDivElement>(null);',
        content
    )

    # 2. Update handleProjectNav logic
    new_handle_nav = """const handleProjectNav = contextSafe((path: string, direction: -1 | 1 = 1, clickedElement?: HTMLElement) => {
    if (isNavigatingRef.current) return;
    const wrapper = pageWrapperRef.current;
    if (!wrapper) { navigate(path, { state: { transitionDirection: direction } }); return; }

    isNavigatingRef.current = true;
    gsap.killTweensOf(wrapper);

    // If a subnav edge link is clicked and we are on desktop, execute morph animation
    if (clickedElement && clickedElement.classList.contains('v1-subnav-edge') && window.innerWidth >= 768) {
      const brandElement = document.querySelector('.v1-subnav-brand');
      const strip = stripRef.current;
      
      if (brandElement && strip) {
        const edgePrev = strip.querySelector('.v1-subnav-edge:first-child');
        const edgeNext = strip.querySelector('.v1-subnav-edge:last-child');
        const chevrons = strip.querySelectorAll('.v1-subnav-chevron');
        
        if (edgePrev && edgeNext) {
          const clickedRect = clickedElement.getBoundingClientRect();
          const brandRect = brandElement.getBoundingClientRect();
          const prevRect = edgePrev.getBoundingClientRect();
          const nextRect = edgeNext.getBoundingClientRect();
          
          const clickedCenter = clickedRect.left + clickedRect.width / 2;
          const brandCenter = brandRect.left + brandRect.width / 2;
          const prevCenter = prevRect.left + prevRect.width / 2;
          const nextCenter = nextRect.left + nextRect.width / 2;

          const tl = gsap.timeline({
            onComplete: () => {
              isNavigatingRef.current = false;
              navigate(path, { state: { transitionDirection: direction } });
            }
          });

          // 1. Fade out chevrons
          tl.to(chevrons, {
            opacity: 0,
            duration: 0.25,
            ease: 'power2.out'
          }, 0);

          const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
          
          // Identify elements for the 3-way swap
          const isNextClicked = clickedElement === edgeNext;
          const targetEdge = isNextClicked ? edgePrev : edgeNext;
          const targetEdgeCenter = isNextClicked ? prevCenter : nextCenter;

          // Animate Clicked to Center (morphing to pill)
          tl.to(clickedElement, {
            x: brandCenter - clickedCenter,
            backgroundColor: isDark ? 'rgba(217, 117, 26, 0.12)' : 'rgba(217, 117, 26, 0.05)',
            borderColor: isDark ? 'rgba(217, 117, 26, 0.25)' : 'rgba(217, 117, 26, 0.15)',
            borderStyle: 'solid',
            borderWidth: '1px',
            borderRadius: '9999px',
            paddingLeft: '16px',
            paddingRight: '16px',
            paddingTop: '6px',
            paddingBottom: '6px',
            color: isDark ? '#FD9F68' : '#D9751A',
            fontWeight: '700',
            fontSize: '12px',
            scale: 1,
            opacity: 1,
            duration: 0.55,
            ease: 'power2.inOut'
          }, 0);

          // Animate Brand to Opposite Edge (dropping pill style)
          tl.to(brandElement, {
            x: targetEdgeCenter - brandCenter,
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            paddingLeft: '0px',
            paddingRight: '0px',
            paddingTop: '0px',
            paddingBottom: '0px',
            color: 'var(--text-secondary)',
            fontWeight: '400',
            fontSize: '14px',
            scale: 1,
            opacity: 1,
            duration: 0.55,
            ease: 'power2.inOut'
          }, 0);

          // Animate the other edge across the screen (keeping plain text style)
          tl.to(targetEdge, {
            x: clickedCenter - targetEdgeCenter,
            opacity: 1,
            duration: 0.55,
            ease: 'power2.inOut'
          }, 0);

          // Fade out the page body content smoothly
          tl.to(wrapper, {
            opacity: 0,
            y: -10,
            duration: 0.45,
            ease: 'power2.in'
          }, 0.1);

          return;
        }
      }
    }

    // Fallback: simple fade transition of the page content
    const tl = gsap.timeline({
      onComplete: () => {
        isNavigatingRef.current = false;
        navigate(path, { state: { transitionDirection: direction } });
      }
    });

    tl.to(wrapper, {
      opacity: 0,
      y: -10,
      duration: 0.45,
      ease: 'power2.in'
    });
  });"""

    if case_study_id != "legit":
        new_handle_nav = new_handle_nav.replace("isDark ? 'rgba(217, 117, 26, 0.12)' : 'rgba(217, 117, 26, 0.05)'", "'var(--case-study-accent-soft)'")
        new_handle_nav = new_handle_nav.replace("isDark ? 'rgba(217, 117, 26, 0.25)' : 'rgba(217, 117, 26, 0.15)'", "'var(--case-study-accent)'")
        new_handle_nav = new_handle_nav.replace("isDark ? '#FD9F68' : '#D9751A'", "'var(--case-study-accent)'")
        new_handle_nav = new_handle_nav.replace("const isDark = document.documentElement.getAttribute('data-theme') === 'dark';\n          ", "")

    content = re.sub(
        r'const handleProjectNav = contextSafe\(\(path: string, direction: -1 \| 1 = 1, clickedElement\?: HTMLElement\) => \{.*?(?=\n  usePageSeo)',
        new_handle_nav + "\n",
        content,
        flags=re.DOTALL
    )

    # 3. Restructure DOM
    # First, find the return block and extract the strip
    strip_match = re.search(r'(\s*\{\/\* Subnav Strip \*\/\}.*?</div>\n)', content, re.DOTALL)
    if strip_match:
        strip_code = strip_match.group(1)
        # remove it from its current position
        content = content.replace(strip_code, "")
        
        # add ref to strip
        strip_code = strip_code.replace('className="v1-subnav-strip"', 'className="v1-subnav-strip" ref={stripRef}')

        # Now replace the main return
        return_start = f'return (\n    <div className="blog-post-page-wrapper case-study-white-bg case-study--{case_study_id}" ref={{pageWrapperRef}}>'
        new_return = f'return (\n    <div className="case-study--{case_study_id}">\n{strip_code}\n      <div className="blog-post-page-wrapper case-study-white-bg" ref={{pageWrapperRef}}>'
        
        content = content.replace(return_start, new_return)
        
        # add closing div for the new wrapper at the end
        content = re.sub(r'(</aside>\s*\{\/\* Slider Stage \*\/\}.*?</div>\n    </div>)\n  \);\n}', r'\1\n    </div>\n  );\n}', content, flags=re.DOTALL)

    with open(filepath, 'w') as f:
        f.write(content)
    
    print(f"Refactored {filepath}")
