import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
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

  it('marks the blog link active on blog routes', () => {
    renderNavigation('/blog/how-to-design');

    expect(screen.getByRole('link', { name: 'BLOG' })).toHaveClass('is-active');
  });

  it('toggles theme from the header switch', async () => {
    const user = userEvent.setup();
    const { container } = renderNavigation('/');

    const toggle = container.querySelector('.navigation__toggle-switch');
    expect(toggle).not.toBeNull();
    expect(toggle).not.toHaveClass('is-active');

    await user.click(toggle as HTMLElement);

    expect(toggle).toHaveClass('is-active');
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });
});
