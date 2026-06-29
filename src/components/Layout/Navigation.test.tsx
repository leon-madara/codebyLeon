import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

const { scrollToMock, scrollSmootherGetMock } = vi.hoisted(() => ({
  scrollToMock: vi.fn(),
  scrollSmootherGetMock: vi.fn(),
}));

vi.mock('gsap/ScrollSmoother', () => ({
  ScrollSmoother: {
    get: scrollSmootherGetMock,
  },
}));

import { Navigation } from './Navigation';
import { ThemeProvider } from '../../contexts/ThemeContext';

function renderNavigation(initialRoute = '/') {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <ThemeProvider>
        <Routes>
          <Route path="*" element={<Navigation />} />
        </Routes>
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe('Navigation', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    window.history.replaceState(null, '', '/');
    document.body.style.overflow = '';
    scrollToMock.mockReset();
    scrollSmootherGetMock.mockReset();
    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
  });

  it('renders as a full-width attached header', () => {
    renderNavigation('/');

    const nav = screen.getByRole('navigation', { name: 'Main navigation' });
    expect(nav).toHaveClass('navigation');
    expect(nav).not.toHaveClass('navigation--floating');
    expect(nav).not.toHaveClass('is-hidden');
    expect(screen.getByRole('link', { name: 'Code by Leon home' })).toHaveAttribute('href', '/#hero');
  });

  it('uses in-page section anchors on the home route', () => {
    renderNavigation('/');

    expect(screen.getByRole('link', { name: 'PORTFOLIO' })).toHaveAttribute('href', '#portfolio');
    expect(screen.getByRole('link', { name: 'ABOUT' })).toHaveAttribute('href', '#about');
    expect(screen.getByRole('link', { name: 'SERVICES' })).toHaveAttribute('href', '#services');
  });

  it('uses cross-route section anchors off the home route', () => {
    renderNavigation('/blog');

    expect(screen.getByRole('link', { name: 'PORTFOLIO' })).toHaveAttribute('href', '/#portfolio');
    expect(screen.getByRole('link', { name: 'ABOUT' })).toHaveAttribute('href', '/#about');
    expect(screen.getByRole('link', { name: 'SERVICES' })).toHaveAttribute('href', '/#services');
  });

  it('snaps ScrollSmoother to an in-page section without rebounding to the hero', async () => {
    const user = userEvent.setup();
    const services = document.createElement('section');
    services.id = 'services';
    document.body.appendChild(services);
    scrollSmootherGetMock.mockReturnValue({ scrollTo: scrollToMock });
    window.history.replaceState(null, '', '/#hero');

    renderNavigation('/');
    const navigation = screen.getByRole('navigation', { name: 'Main navigation' });
    vi.spyOn(navigation, 'getBoundingClientRect').mockReturnValue({
      bottom: 72,
      height: 72,
      left: 0,
      right: 1280,
      top: 0,
      width: 1280,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
    await user.click(screen.getByRole('link', { name: 'SERVICES' }));

    expect(scrollToMock).toHaveBeenCalledWith(services, false, 'top top+=88');
    expect(window.location.hash).toBe('#services');
    services.remove();
  });

  it('links to the process page and marks it active on the process route', () => {
    renderNavigation('/process');

    expect(screen.getByRole('link', { name: 'PROCESS' }))
      .toHaveAttribute('href', '/process');
    expect(screen.getByRole('link', { name: 'PROCESS' })).toHaveClass('is-active');
  });

  it('marks the blog link active on blog routes', () => {
    renderNavigation('/blog/how-to-design');

    expect(screen.getByRole('link', { name: 'BLOG' })).toHaveClass('is-active');
  });

  it('marks the portfolio link active on case study routes', () => {
    renderNavigation('/work/legit-logistics');

    expect(screen.getByRole('link', { name: 'PORTFOLIO' })).toHaveClass('is-active');
  });

  it('toggles theme from the header switch', async () => {
    const user = userEvent.setup();
    renderNavigation('/');

    const toggles = screen.getAllByRole('button', { name: /switch to dark theme/i });
    const toggle = toggles[0];
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveAttribute('aria-pressed', 'false');

    await user.click(toggle);

    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });

  it('opens and closes the mobile menu from the hamburger button', async () => {
    const user = userEvent.setup();
    renderNavigation('/');

    const menuButton = screen.getByRole('button', { name: 'Open navigation menu' });
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('dialog', { name: 'Mobile navigation' })).not.toBeInTheDocument();

    await user.click(menuButton);

    expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('dialog', { name: 'Mobile navigation' })).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('hidden');

    await user.click(screen.getByRole('button', { name: 'Close navigation menu' }));

    expect(screen.queryByRole('dialog', { name: 'Mobile navigation' })).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe('');
  });

  it('renders mobile menu links, quote CTA, and theme toggle inside the menu', async () => {
    const user = userEvent.setup();
    renderNavigation('/');

    expect(screen.getByRole('link', { name: 'Build Your Quote - Configure your project and see pricing' }))
      .toHaveAttribute('href', '/get-started.html');

    await user.click(screen.getByRole('button', { name: 'Open navigation menu' }));

    const menu = screen.getByRole('dialog', { name: 'Mobile navigation' });
    expect(within(menu).getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/#hero');
    expect(within(menu).getByRole('link', { name: 'Portfolio' })).toHaveAttribute('href', '#portfolio');
    expect(within(menu).getByRole('link', { name: 'About' })).toHaveAttribute('href', '#about');
    expect(within(menu).getByRole('link', { name: 'Services' })).toHaveAttribute('href', '#services');
    expect(within(menu).getByRole('link', { name: 'Process' })).toHaveAttribute('href', '/process');
    expect(within(menu).getByRole('link', { name: 'Blog' })).toHaveAttribute('href', '/blog');
    expect(within(menu).queryByRole('link', { name: 'Build Your Quote - Configure your project and see pricing' }))
      .not.toBeInTheDocument();
    expect(within(menu).getByRole('button', { name: 'Switch to dark theme' })).toBeInTheDocument();
  });

  it('closes the mobile menu when a menu link is selected', async () => {
    const user = userEvent.setup();
    renderNavigation('/');

    await user.click(screen.getByRole('button', { name: 'Open navigation menu' }));
    const menu = screen.getByRole('dialog', { name: 'Mobile navigation' });

    await user.click(within(menu).getByRole('link', { name: 'Blog' }));

    expect(screen.queryByRole('dialog', { name: 'Mobile navigation' })).not.toBeInTheDocument();
  });

  it('closes the mobile menu when Escape is pressed', async () => {
    const user = userEvent.setup();
    renderNavigation('/');

    await user.click(screen.getByRole('button', { name: 'Open navigation menu' }));
    expect(screen.getByRole('dialog', { name: 'Mobile navigation' })).toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog', { name: 'Mobile navigation' })).not.toBeInTheDocument();
  });

  it('toggles theme from inside the mobile menu', async () => {
    const user = userEvent.setup();
    renderNavigation('/');

    await user.click(screen.getByRole('button', { name: 'Open navigation menu' }));
    const menu = screen.getByRole('dialog', { name: 'Mobile navigation' });
    const mobileToggle = within(menu).getByRole('button', { name: 'Switch to dark theme' });

    await user.click(mobileToggle);

    expect(mobileToggle).toHaveAttribute('aria-pressed', 'true');
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });
});
