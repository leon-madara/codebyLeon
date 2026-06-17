import { render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { projects } from '@/data/projects';
import PortfolioCarouselMobile from './PortfolioCarouselMobile';

vi.mock('@gsap/react', () => ({
  useGSAP: vi.fn(),
}));

vi.mock('gsap', () => ({
  default: {
    registerPlugin: vi.fn(),
  },
}));

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {},
}));

describe('PortfolioCarouselMobile', () => {
  const renderMobilePortfolio = () =>
    render(
      <MemoryRouter>
        <PortfolioCarouselMobile />
      </MemoryRouter>
    );

  it('renders a full-screen intro chapter with detailed context and project previews', () => {
    const { container } = renderMobilePortfolio();

    expect(screen.getByRole('heading', { name: /our work/i })).toBeInTheDocument();
    expect(
      screen.getByText(/three projects, three business problems/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/swipe through the proof cuts/i)).toBeInTheDocument();

    projects.forEach((project) => {
      expect(screen.getByText(project.name, { selector: '.portfolio-mobile__intro-project-name' })).toBeInTheDocument();
    });

    expect(container.querySelector('.portfolio-mobile__intro-chapter')).toBeInTheDocument();
    expect(container.querySelector('.portfolio-mobile__proof-gallery')).toBeInTheDocument();
    expect(container.querySelector('.portfolio-mobile__scroll-wrapper')).not.toBeInTheDocument();
  });

  it('renders three horizontal proof panels with visible article CTAs', () => {
    const { container } = renderMobilePortfolio();
    const panels = container.querySelectorAll('.portfolio-mobile__proof-panel');

    expect(panels).toHaveLength(3);
    projects.forEach((project) => {
      expect(screen.getByRole('heading', { name: project.name })).toBeInTheDocument();
      expect(screen.getByRole('img', { name: project.name })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: new RegExp(`View ${project.name}`, 'i') })).toBeInTheDocument();
    });

    expect(screen.getByText('01 / 03')).toBeInTheDocument();
    expect(screen.getByText('02 / 03')).toBeInTheDocument();
    expect(screen.getByText('03 / 03')).toBeInTheDocument();
    expect(container.querySelector('.portfolio-mobile__proof-panel[aria-hidden="true"]')).not.toBeInTheDocument();
  });

  it('uses mobile artwork when a project provides it', () => {
    renderMobilePortfolio();

    const kossyImage = screen.getByRole('img', { name: 'Kossy Langat' });
    const delivahImage = screen.getByRole('img', { name: 'Delivah Dispatch' });

    expect(kossyImage).toHaveAttribute(
      'src',
      '/portfolio/case-studies/kossy/kossy-home-hero-mobile.png'
    );
    expect(delivahImage).toHaveAttribute(
      'src',
      '/portfolio/case-studies/delivah/delivah-home-hero-mobile.png'
    );
  });

  it('uses ScrollTrigger pinning for the intro and scroll-driven horizontal proof cuts', () => {
    const { container } = renderMobilePortfolio();
    const source = readFileSync(
      resolve(process.cwd(), 'src/components/sections/PortfolioCarouselMobile.tsx'),
      'utf8'
    );
    const css = readFileSync(
      resolve(process.cwd(), 'src/styles/sections/portfolio-mobile.css'),
      'utf8'
    );

    expect(container.querySelector('.portfolio-mobile__list')).not.toBeInTheDocument();
    expect(container.querySelector('.portfolio-mobile__card')).not.toBeInTheDocument();
    expect(container.querySelector('.portfolio-mobile__proof-track')).toBeInTheDocument();
    expect(source).toMatch(/useGSAP\(/);
    expect(source).toMatch(/ScrollTrigger\.create\(\{[\s\S]*pin:\s*introRef\.current/s);
    expect(source).toMatch(/gsap\.to\(trackRef\.current,[\s\S]*scrollTrigger:\s*\{[\s\S]*pin:\s*galleryRef\.current/s);
    expect(source).toMatch(/snap:\s*\{/);
    expect(source).toMatch(/x:\s*\(\)\s*=>\s*-getHorizontalDistance\(\)/);
    expect(css).toMatch(/\.portfolio-mobile__heading\s*{[\s\S]*white-space:\s*nowrap;/);
    expect(css).toMatch(/\.portfolio-mobile__proof-gallery\s*{[\s\S]*overflow:\s*hidden;/);
    expect(css).not.toMatch(/\.portfolio-mobile__proof-track\s*{[\s\S]*overflow-x:\s*auto;/);
  });
});
