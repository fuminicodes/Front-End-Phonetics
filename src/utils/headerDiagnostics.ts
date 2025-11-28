// Utility to diagnose and fix header-related issues

export class HeaderDiagnostics {
  /**
   * Check if the current environment has problematic headers
   */
  static diagnoseHeaders(): {
    hasIssues: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];

    try {
      // Check localStorage size
      if (typeof window !== 'undefined' && window.localStorage) {
        let totalStorageSize = 0;
        const largeItems: string[] = [];

        Object.keys(localStorage).forEach(key => {
          try {
            const value = localStorage.getItem(key) || '';
            totalStorageSize += value.length;
            if (value.length > 1024) {
              largeItems.push(`${key} (${Math.round(value.length / 1024)}KB)`);
            }
          } catch (e) {
            issues.push(`Error accessing localStorage item: ${key}`);
          }
        });

        if (totalStorageSize > 5242880) { // 5MB
          issues.push(`Large localStorage detected: ${Math.round(totalStorageSize / 1024)}KB total`);
          recommendations.push('Clear localStorage data');
        }

        if (largeItems.length > 0) {
          issues.push(`Large localStorage items found: ${largeItems.join(', ')}`);
          recommendations.push('Remove large localStorage items');
        }
      }

      // Check cookies if accessible
      if (typeof document !== 'undefined' && document.cookie) {
        const cookieSize = document.cookie.length;
        if (cookieSize > 4096) { // 4KB typical limit
          issues.push(`Large cookies detected: ${Math.round(cookieSize / 1024)}KB`);
          recommendations.push('Clear browser cookies for this domain');
        }
      }

      // Check user agent
      if (typeof navigator !== 'undefined' && navigator.userAgent) {
        if (navigator.userAgent.length > 512) {
          issues.push(`Large user agent string: ${navigator.userAgent.length} characters`);
          recommendations.push('Browser may have unusual user agent string');
        }
      }

    } catch (error) {
      issues.push(`Error during diagnostics: ${error}`);
    }

    return {
      hasIssues: issues.length > 0,
      issues,
      recommendations
    };
  }

  /**
   * Clear problematic data to resolve header issues
   */
  static clearProblematicData(): boolean {
    try {
      // Clear large localStorage items
      if (typeof window !== 'undefined' && window.localStorage) {
        const keys = Object.keys(localStorage);
        let clearedItems = 0;

        keys.forEach(key => {
          try {
            const value = localStorage.getItem(key);
            if (value && value.length > 1024) {
              localStorage.removeItem(key);
              clearedItems++;
            }
          } catch (e) {
            console.warn(`Could not clear localStorage item: ${key}`);
          }
        });

        if (clearedItems > 0) {
          console.log(`Cleared ${clearedItems} large localStorage items`);
        }
      }

      return true;
    } catch (error) {
      console.error('Error clearing problematic data:', error);
      return false;
    }
  }

  /**
   * Display diagnostic information in console
   */
  static logDiagnostics(): void {
    const diagnostics = this.diagnoseHeaders();
    
    console.group('🔍 Header Diagnostics');
    
    if (diagnostics.hasIssues) {
      console.warn('Issues detected:');
      diagnostics.issues.forEach(issue => console.warn(`- ${issue}`));
      
      console.info('Recommendations:');
      diagnostics.recommendations.forEach(rec => console.info(`- ${rec}`));
    } else {
      console.info('✅ No header-related issues detected');
    }
    
    console.groupEnd();
  }
}

// Auto-run diagnostics in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  setTimeout(() => {
    HeaderDiagnostics.logDiagnostics();
  }, 1000);
}