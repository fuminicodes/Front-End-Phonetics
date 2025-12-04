'use client';

import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  level?: 'page' | 'section' | 'component';
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`Error Boundary (${this.props.level}):`, error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return <DefaultErrorFallback level={this.props.level} error={this.state.error} />;
    }
    
    return this.props.children;
  }
}

function DefaultErrorFallback({ level, error }: { level?: string; error?: Error }) {
  const isPageLevel = level === 'page';
  
  if (isPageLevel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Algo salió mal</h1>
          <p className="text-gray-600 mt-2">
            Ha ocurrido un error inesperado. Por favor, recarga la página.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
          >
            Recargar página
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4 border border-red-200 bg-red-50 rounded">
      <p className="text-red-800 text-sm">
        Error en este componente. El resto de la página sigue funcionando.
      </p>
      {process.env.NODE_ENV === 'development' && error && (
        <details className="mt-2">
          <summary className="text-xs text-red-600 cursor-pointer">
            Detalles del error (desarrollo)
          </summary>
          <pre className="text-xs text-red-700 mt-1 whitespace-pre-wrap">
            {error.message}
          </pre>
        </details>
      )}
    </div>
  );
}