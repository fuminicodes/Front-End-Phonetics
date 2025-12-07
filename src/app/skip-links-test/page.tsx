'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Typography } from '@/shared/ui/typography';
import { Alert, AlertTitle, AlertDescription } from '@/shared/ui/alert';

export default function SkipLinksTestPage() {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 space-y-8 max-w-4xl">
        {/* Instructions Card */}
        <Card variant="elevated" className="border-info-500/30 bg-info-50/50 dark:bg-info-900/20">
          <CardHeader>
            <CardTitle>⌨️ Skip Links Test Page</CardTitle>
            <CardDescription>
              Test keyboard navigation and accessibility features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="info">
              <AlertTitle>How to Test</AlertTitle>
              <AlertDescription>
                <ol className="list-decimal list-inside space-y-2 mt-2">
                  <li><strong>Press Tab</strong> - Skip links will appear at the top of the page</li>
                  <li><strong>Press Tab again</strong> - Navigate between skip links</li>
                  <li><strong>Press Enter</strong> - Activate a skip link to jump to that section</li>
                  <li><strong>Verify</strong> - The page should smoothly scroll and focus the target</li>
                </ol>
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Typography variant="h4">Expected Skip Links:</Typography>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Skip to main content (default, always available)</li>
                <li>Skip to navigation (default, always available)</li>
              </ul>
            </div>

            <Alert variant="success">
              <AlertTitle>✅ Accessibility Features</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>WCAG 2.4.1 (Bypass Blocks) - Level A compliant</li>
                  <li>Keyboard accessible via Tab key</li>
                  <li>Visible focus indicators</li>
                  <li>Smooth scroll to target sections</li>
                  <li>Glassmorphism design with backdrop blur</li>
                  <li>Dark mode support</li>
                </ul>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Spacer to test scrolling */}
        <div className="h-screen flex items-center justify-center">
          <Card>
            <CardContent className="text-center py-16">
              <Typography variant="h2" className="mb-4">
                👆 Press Tab Now
              </Typography>
              <Typography variant="p" className="text-lg">
                Skip links should appear at the top of the page when you press the Tab key.
              </Typography>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Section */}
        <section id="navigation" tabIndex={-1}>
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>🧭 Navigation Section</CardTitle>
              <CardDescription>
                This is the navigation target area
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Typography variant="p">
                If you used the "Skip to navigation" link, you should have been brought here.
              </Typography>
              <nav className="mt-4 space-y-2">
                <a href="#main-content" className="block text-primary-500 hover:text-primary-600">
                  → Go to Main Content
                </a>
                <a href="#features" className="block text-primary-500 hover:text-primary-600">
                  → Go to Features
                </a>
                <a href="#testing" className="block text-primary-500 hover:text-primary-600">
                  → Go to Testing Guide
                </a>
              </nav>
            </CardContent>
          </Card>
        </section>

        {/* Spacer */}
        <div className="h-32" />

        {/* Features Section */}
        <section id="features" tabIndex={-1}>
          <Card>
            <CardHeader>
              <CardTitle>✨ Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card variant="flat">
                  <CardContent className="py-6">
                    <Typography variant="h4" className="mb-2">🎨 Design</Typography>
                    <Typography variant="p" className="text-sm">
                      Glassmorphism effect with backdrop blur, matching the Nebula Glass design system
                    </Typography>
                  </CardContent>
                </Card>

                <Card variant="flat">
                  <CardContent className="py-6">
                    <Typography variant="h4" className="mb-2">♿ Accessibility</Typography>
                    <Typography variant="p" className="text-sm">
                      WCAG 2.1 compliant, keyboard navigable, screen reader friendly
                    </Typography>
                  </CardContent>
                </Card>

                <Card variant="flat">
                  <CardContent className="py-6">
                    <Typography variant="h4" className="mb-2">🌙 Dark Mode</Typography>
                    <Typography variant="p" className="text-sm">
                      Full support for light and dark themes with proper contrast
                    </Typography>
                  </CardContent>
                </Card>

                <Card variant="flat">
                  <CardContent className="py-6">
                    <Typography variant="h4" className="mb-2">⚡ Performance</Typography>
                    <Typography variant="p" className="text-sm">
                      Lightweight CSS animations, smooth scrolling, optimized rendering
                    </Typography>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Spacer */}
        <div className="h-32" />

        {/* Testing Guide Section */}
        <section id="testing" tabIndex={-1}>
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>🧪 Testing Guide</CardTitle>
              <CardDescription>
                How to verify skip links are working correctly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Typography variant="h4" className="mb-2">Keyboard Testing</Typography>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Load this page</li>
                  <li>Press <kbd className="px-2 py-1 bg-accent-primary/10 rounded text-sm">Tab</kbd></li>
                  <li>Skip link should appear at top-left with glassmorphism effect</li>
                  <li>Press <kbd className="px-2 py-1 bg-accent-primary/10 rounded text-sm">Enter</kbd> on a skip link</li>
                  <li>Verify smooth scroll to target section</li>
                  <li>Verify focus is on target element (visible focus ring)</li>
                </ol>
              </div>

              <div>
                <Typography variant="h4" className="mb-2">Visual Testing</Typography>
                <ul className="list-disc list-inside space-y-2">
                  <li>Skip link has glassmorphism (blur, borders, transparency)</li>
                  <li>Primary color border (blue) when focused</li>
                  <li>Smooth hover effect (scale up slightly)</li>
                  <li>Shadow increases on hover</li>
                  <li>Proper contrast in both light and dark modes</li>
                </ul>
              </div>

              <div>
                <Typography variant="h4" className="mb-2">Screen Reader Testing</Typography>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>NVDA (Windows):</strong> Should announce "Skip to [target], link"</li>
                  <li><strong>JAWS (Windows):</strong> Should announce link label and role</li>
                  <li><strong>VoiceOver (macOS):</strong> Should announce "Skip to [target], link"</li>
                  <li>After activation, should announce target element</li>
                </ul>
              </div>

              <Alert variant="warning">
                <AlertTitle>⚠️ Common Issues</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Skip link not appearing: Check z-index conflicts</li>
                    <li>Target not receiving focus: Add tabIndex={'{-1}'} to target</li>
                    <li>No smooth scroll: Check browser scroll-behavior settings</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </section>

        {/* Spacer */}
        <div className="h-32" />

        {/* Documentation Section */}
        <section id="documentation" tabIndex={-1}>
          <Card>
            <CardHeader>
              <CardTitle>📚 Documentation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Typography variant="p">
                For complete documentation, examples, and API reference, see:
              </Typography>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="/documentation/SKIP_LINKS.md" 
                    className="text-primary-500 hover:text-primary-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    📄 Skip Links Documentation
                  </a>
                </li>
                <li>
                  <a 
                    href="/src/shared/ui/skip-links.examples.tsx" 
                    className="text-primary-500 hover:text-primary-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    💡 Usage Examples (8 patterns)
                  </a>
                </li>
                <li>
                  <a 
                    href="/documentation/DESIGN_SYSTEM.md" 
                    className="text-primary-500 hover:text-primary-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    🎨 Nebula Glass Design System
                  </a>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Success Message */}
        <div className="text-center py-16">
          <Alert variant="success">
            <AlertTitle>✅ Skip Links Implementation Complete</AlertTitle>
            <AlertDescription>
              <Typography variant="p" className="mt-2">
                The Skip Links component is fully integrated and ready for production use.
                It meets WCAG 2.1 Level A compliance and follows the Nebula Glass design system.
              </Typography>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
