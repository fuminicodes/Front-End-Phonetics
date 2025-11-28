'use client';

import { useState, useEffect } from 'react';

export default function HeaderTest() {
  const [headerInfo, setHeaderInfo] = useState<any>({});
  const [testResult, setTestResult] = useState<string>('');

  useEffect(() => {
    // Gather information about the current request environment
    const info = {
      userAgent: navigator.userAgent,
      userAgentLength: navigator.userAgent.length,
      cookieLength: document.cookie.length,
      localStorageSize: getLocalStorageSize(),
      sessionStorageSize: getSessionStorageSize(),
      referrer: document.referrer,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    };

    setHeaderInfo(info);
  }, []);

  const getLocalStorageSize = () => {
    try {
      let total = 0;
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length;
        }
      }
      return total;
    } catch (e) {
      return 0;
    }
  };

  const getSessionStorageSize = () => {
    try {
      let total = 0;
      for (const key in sessionStorage) {
        if (sessionStorage.hasOwnProperty(key)) {
          total += sessionStorage[key].length + key.length;
        }
      }
      return total;
    } catch (e) {
      return 0;
    }
  };

  const testRequest = async () => {
    setTestResult('Testing...');
    try {
      const response = await fetch('/api/test-headers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ test: 'header-test' }),
      });

      if (response.ok) {
        setTestResult('✅ Request successful - No header issues detected');
      } else {
        setTestResult(`❌ Request failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setTestResult(`❌ Request error: ${error}`);
    }
  };

  const clearAllData = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      // Clear cookies by setting them to expire
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
      window.location.reload();
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🔍 Header Diagnostics
          </h1>
          <p className="text-gray-600">
            Diagnostic page to identify and resolve header-related issues
          </p>
        </header>

        <div className="space-y-6">
          {/* Header Information */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Header Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">User Agent Length</label>
                <p className={`text-lg ${headerInfo.userAgentLength > 500 ? 'text-red-600' : 'text-green-600'}`}>
                  {headerInfo.userAgentLength} characters
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cookie Size</label>
                <p className={`text-lg ${headerInfo.cookieLength > 4096 ? 'text-red-600' : 'text-green-600'}`}>
                  {headerInfo.cookieLength} bytes
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">localStorage Size</label>
                <p className={`text-lg ${headerInfo.localStorageSize > 1024 ? 'text-yellow-600' : 'text-green-600'}`}>
                  {headerInfo.localStorageSize} bytes
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">sessionStorage Size</label>
                <p className={`text-lg ${headerInfo.sessionStorageSize > 1024 ? 'text-yellow-600' : 'text-green-600'}`}>
                  {headerInfo.sessionStorageSize} bytes
                </p>
              </div>
            </div>
          </div>

          {/* Test Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Connection Test</h2>
            <button
              onClick={testRequest}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-4"
            >
              Test Request
            </button>
            <button
              onClick={clearAllData}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Clear All Browser Data
            </button>
            <p className="mt-4 text-gray-700">{testResult}</p>
          </div>

          {/* Recommendations */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">Recommendations</h2>
            <ul className="space-y-2 text-blue-700">
              {headerInfo.userAgentLength > 500 && (
                <li>⚠️ User agent string is unusually long - may indicate problematic browser extensions</li>
              )}
              {headerInfo.cookieLength > 4096 && (
                <li>⚠️ Cookies are too large - clear browser cookies for this domain</li>
              )}
              {headerInfo.localStorageSize > 5242880 && (
                <li>⚠️ localStorage contains large amounts of data - clear localStorage</li>
              )}
              {headerInfo.cookieLength <= 4096 && headerInfo.userAgentLength <= 500 && headerInfo.localStorageSize <= 1024 && (
                <li>✅ No obvious header-related issues detected</li>
              )}
            </ul>
          </div>

          {/* Raw Data */}
          <details className="bg-gray-100 p-4 rounded">
            <summary className="font-semibold cursor-pointer">Raw Data (Click to expand)</summary>
            <pre className="mt-2 text-sm overflow-auto">
              {JSON.stringify(headerInfo, null, 2)}
            </pre>
          </details>
        </div>

        <div className="mt-8 text-center">
          <a 
            href="/"
            className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Back to Main App
          </a>
        </div>
      </div>
    </div>
  );
}