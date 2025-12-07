/**
 * SkipLinks Component - Usage Examples
 * Accessibility navigation component following Nebula Glass Design System
 * 
 * This file demonstrates the correct usage of the SkipLinks component
 * for keyboard navigation and WCAG 2.1 compliance.
 */

import { SkipLinks } from './skip-links';

// ============================================
// EXAMPLE 1: Default Skip Links
// ============================================
export function DefaultSkipLinksExample() {
  return (
    <>
      <SkipLinks />
      {/* Your page content */}
      <main id="main-content" tabIndex={-1}>
        <h1>Main Content</h1>
        <p>Content goes here...</p>
      </main>
    </>
  );
}

// ============================================
// EXAMPLE 2: Custom Skip Links
// ============================================
export function CustomSkipLinksExample() {
  return (
    <>
      <SkipLinks
        links={[
          { href: '#main-content', label: 'Skip to main content' },
          { href: '#navigation', label: 'Skip to navigation' },
          { href: '#search', label: 'Skip to search' },
          { href: '#footer', label: 'Skip to footer' },
        ]}
      />
      {/* Your page structure */}
      <nav id="navigation">Navigation here</nav>
      <div id="search">Search bar here</div>
      <main id="main-content" tabIndex={-1}>Main content</main>
      <footer id="footer">Footer here</footer>
    </>
  );
}

// ============================================
// EXAMPLE 3: With Single Skip Link
// ============================================
export function SingleSkipLinkExample() {
  return (
    <>
      <SkipLinks
        links={[
          { href: '#main-content', label: 'Skip to content' }
        ]}
      />
      <main id="main-content" tabIndex={-1}>
        <h1>Welcome</h1>
        <p>Content...</p>
      </main>
    </>
  );
}

// ============================================
// EXAMPLE 4: Dashboard Layout with Multiple Regions
// ============================================
export function DashboardSkipLinksExample() {
  return (
    <>
      <SkipLinks
        links={[
          { href: '#main-content', label: 'Skip to dashboard' },
          { href: '#sidebar', label: 'Skip to sidebar menu' },
          { href: '#user-profile', label: 'Skip to user profile' },
          { href: '#notifications', label: 'Skip to notifications' },
        ]}
      />
      
      <div className="flex">
        <aside id="sidebar">
          <nav>Sidebar navigation</nav>
        </aside>
        
        <main id="main-content" tabIndex={-1}>
          <div id="user-profile">Profile section</div>
          <div id="notifications">Notifications</div>
          <div>Dashboard content</div>
        </main>
      </div>
    </>
  );
}

// ============================================
// EXAMPLE 5: Form-Heavy Page
// ============================================
export function FormPageSkipLinksExample() {
  return (
    <>
      <SkipLinks
        links={[
          { href: '#registration-form', label: 'Skip to registration form' },
          { href: '#help', label: 'Skip to help section' },
          { href: '#contact', label: 'Skip to contact information' },
        ]}
      />
      
      <header>Page header</header>
      
      <main id="main-content" tabIndex={-1}>
        <form id="registration-form">
          <h2>Registration</h2>
          {/* Form fields */}
        </form>
        
        <section id="help">
          <h2>Need Help?</h2>
          <p>Help content...</p>
        </section>
        
        <section id="contact">
          <h2>Contact Us</h2>
          <p>Contact info...</p>
        </section>
      </main>
    </>
  );
}

// ============================================
// EXAMPLE 6: Content-Heavy Blog/Article
// ============================================
export function ArticleSkipLinksExample() {
  return (
    <>
      <SkipLinks
        links={[
          { href: '#article-content', label: 'Skip to article' },
          { href: '#table-of-contents', label: 'Skip to table of contents' },
          { href: '#comments', label: 'Skip to comments' },
          { href: '#related-articles', label: 'Skip to related articles' },
        ]}
      />
      
      <header>Site header</header>
      
      <main id="main-content" tabIndex={-1}>
        <nav id="table-of-contents">
          <h2>Table of Contents</h2>
          <ul>{/* TOC items */}</ul>
        </nav>
        
        <article id="article-content">
          <h1>Article Title</h1>
          <p>Article content...</p>
        </article>
        
        <section id="comments">
          <h2>Comments</h2>
          {/* Comments */}
        </section>
        
        <aside id="related-articles">
          <h2>Related Articles</h2>
          {/* Related content */}
        </aside>
      </main>
    </>
  );
}

// ============================================
// EXAMPLE 7: E-commerce Product Page
// ============================================
export function ProductPageSkipLinksExample() {
  return (
    <>
      <SkipLinks
        links={[
          { href: '#product-details', label: 'Skip to product details' },
          { href: '#reviews', label: 'Skip to customer reviews' },
          { href: '#recommendations', label: 'Skip to recommendations' },
        ]}
      />
      
      <header>Store header with navigation</header>
      
      <main id="main-content" tabIndex={-1}>
        <section id="product-details">
          <h1>Product Name</h1>
          <p>Description...</p>
          <button>Add to Cart</button>
        </section>
        
        <section id="reviews">
          <h2>Customer Reviews</h2>
          {/* Reviews */}
        </section>
        
        <section id="recommendations">
          <h2>You Might Also Like</h2>
          {/* Product recommendations */}
        </section>
      </main>
    </>
  );
}

// ============================================
// EXAMPLE 8: Testing Skip Links
// ============================================
export function TestSkipLinksExample() {
  return (
    <>
      <SkipLinks
        links={[
          { href: '#section-1', label: 'Skip to Section 1' },
          { href: '#section-2', label: 'Skip to Section 2' },
          { href: '#section-3', label: 'Skip to Section 3' },
        ]}
      />
      
      <div style={{ height: '100vh', padding: '2rem' }}>
        <h1>Press Tab to see Skip Links</h1>
        <p>The skip links will appear at the top when you focus them.</p>
      </div>
      
      <section id="section-1" tabIndex={-1} style={{ height: '100vh', padding: '2rem' }}>
        <h2>Section 1</h2>
        <p>Content for section 1</p>
      </section>
      
      <section id="section-2" tabIndex={-1} style={{ height: '100vh', padding: '2rem' }}>
        <h2>Section 2</h2>
        <p>Content for section 2</p>
      </section>
      
      <section id="section-3" tabIndex={-1} style={{ height: '100vh', padding: '2rem' }}>
        <h2>Section 3</h2>
        <p>Content for section 3</p>
      </section>
    </>
  );
}

// ============================================
// DESIGN SYSTEM NOTES
// ============================================
/*
 * WCAG 2.1 COMPLIANCE:
 * ✅ Success Criterion 2.4.1 (Bypass Blocks) - Level A
 * ✅ Keyboard accessible (Tab key navigation)
 * ✅ Visible on focus
 * ✅ Screen reader compatible
 * ✅ Smooth scroll behavior
 * ✅ Focus management after navigation
 * 
 * GLASSMORPHISM FEATURES:
 * ✅ Uses .glass-panel utility
 * ✅ Backdrop blur effect
 * ✅ Primary color border (2px, 50% opacity)
 * ✅ Rounded corners (rounded-glass)
 * ✅ Enhanced shadow on hover
 * ✅ Smooth transitions (200ms)
 * 
 * ACCESSIBILITY BEST PRACTICES:
 * 1. Hidden by default (position: absolute, top: -9999px)
 * 2. Appears on focus (top: 1rem)
 * 3. High contrast focus ring (primary-500)
 * 4. Clear visual feedback on hover
 * 5. Smooth scroll to target
 * 6. Focus transferred to target after navigation
 * 7. tabIndex={-1} on targets for programmatic focus
 * 
 * USAGE GUIDELINES:
 * - Place SkipLinks as first element in layout
 * - Ensure all skip targets have corresponding IDs
 * - Use tabIndex={-1} on skip targets (allows focus but not tab stop)
 * - Test with keyboard navigation (Tab key)
 * - Test with screen readers
 * - Keep link labels clear and descriptive
 * 
 * TARGET ELEMENT REQUIREMENTS:
 * - Must have a valid ID matching the href
 * - Should have tabIndex={-1} for programmatic focus
 * - Should be a semantic landmark (<main>, <nav>, <section>, etc.)
 * 
 * KEYBOARD NAVIGATION:
 * 1. User presses Tab key
 * 2. Skip link appears at top of page
 * 3. User presses Enter to activate
 * 4. Page scrolls smoothly to target
 * 5. Focus moves to target element
 * 6. Screen reader announces target
 * 
 * TESTING CHECKLIST:
 * - [ ] Skip links appear on Tab focus
 * - [ ] Skip links are visible and readable
 * - [ ] Clicking skip link scrolls to target
 * - [ ] Focus moves to target after navigation
 * - [ ] Works with keyboard only (no mouse)
 * - [ ] Works with screen readers (NVDA, JAWS, VoiceOver)
 * - [ ] Glassmorphism effect is visible
 * - [ ] Dark mode styling is correct
 */
