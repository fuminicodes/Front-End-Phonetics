'use client';

import { Suspense } from 'react';
import { 
  useSearchParam, 
  useFilterParams, 
  usePaginationParams, 
  useSortParams,
  useViewModeParam,
  useBooleanParam
} from '@/shared/hooks/use-query-params';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Typography } from '@/shared/ui/typography';
import { Can } from '@/shared/ui/can';

// Mock data for demonstration
const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user', status: 'inactive' },
  { id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'moderator', status: 'active' },
  { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', role: 'user', status: 'active' },
  { id: 6, name: 'David Lee', email: 'david@example.com', role: 'admin', status: 'inactive' },
  { id: 7, name: 'Emma Davis', email: 'emma@example.com', role: 'user', status: 'active' },
  { id: 8, name: 'Frank Miller', email: 'frank@example.com', role: 'moderator', status: 'active' },
];

function URLStateContent() {
  // URL state management with nuqs
  const [search, setSearch] = useSearchParam();
  const { role, status, setRole, setStatus } = useFilterParams();
  const { page, pageSize, setPage, setPageSize } = usePaginationParams();
  const { sortBy, sortOrder, setSortBy, setSortOrder } = useSortParams();
  const [viewMode, setViewMode] = useViewModeParam();
  const [showArchived, setShowArchived] = useBooleanParam('archived');

  // Filter and sort data based on URL params
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = !search || 
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = !role || user.role === role;
    const matchesStatus = !status || user.status === status;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortBy) return 0;
    
    const aValue = a[sortBy as keyof typeof a];
    const bValue = b[sortBy as keyof typeof b];
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = sortedUsers.slice(startIndex, endIndex);
  const totalPages = Math.ceil(sortedUsers.length / pageSize);

  const handleClearFilters = () => {
    setSearch('');
    setRole('');
    setStatus('');
    setPage(1);
    setSortBy('');
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 space-y-6 max-w-7xl">
        
        {/* Header */}
        <header className="text-center space-y-4">
          <Typography variant="h1">
            🔗 URL as State Demo
          </Typography>
          <Typography variant="p" className="max-w-2xl mx-auto">
            All filters, search, pagination, and sorting are synced with the URL.
            <br />
            Try filtering data and share the URL - it will preserve your view!
          </Typography>
        </header>

        {/* Current URL Display */}
        <Card variant="flat">
          <CardHeader>
            <CardTitle className="text-lg">Current URL Query Params</CardTitle>
          </CardHeader>
          <CardContent>
            <code className="text-sm bg-black/5 dark:bg-white/5 p-3 rounded-lg block overflow-x-auto">
              {typeof window !== 'undefined' ? window.location.search || '(no params)' : ''}
            </code>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card variant="default">
          <CardHeader>
            <CardTitle>🔍 Filters & Search</CardTitle>
            <CardDescription>All values are synced with URL parameters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Search */}
              <div>
                <label className="text-sm font-medium mb-2 block">Search</label>
                <Input
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1); // Reset to page 1 on search
                  }}
                />
              </div>

              {/* Filters Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Role Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Role</label>
                  <select
                    value={role}
                    onChange={(e) => {
                      setRole(e.target.value);
                      setPage(1);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-accent-secondary/20 bg-surface-primary/50 backdrop-blur-sm"
                  >
                    <option value="">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderator</option>
                    <option value="user">User</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <select
                    value={status}
                    onChange={(e) => {
                      setStatus(e.target.value);
                      setPage(1);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-accent-secondary/20 bg-surface-primary/50 backdrop-blur-sm"
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* Page Size */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Page Size</label>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setPage(1);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-accent-secondary/20 bg-surface-primary/50 backdrop-blur-sm"
                  >
                    <option value="5">5 per page</option>
                    <option value="10">10 per page</option>
                    <option value="20">20 per page</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button 
                  onClick={handleClearFilters}
                  variant="glass"
                  size="sm"
                >
                  Clear All Filters
                </Button>
                <Button
                  onClick={() => setShowArchived(!showArchived)}
                  variant={showArchived ? 'solid' : 'glass'}
                  size="sm"
                >
                  {showArchived ? '✓ Show Archived' : 'Show Archived'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>📊 Results ({sortedUsers.length} users)</CardTitle>
                <CardDescription>
                  Showing {startIndex + 1}-{Math.min(endIndex, sortedUsers.length)} of {sortedUsers.length}
                </CardDescription>
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'table' ? 'solid' : 'glass'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                >
                  Table
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'solid' : 'glass'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  List
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'solid' : 'glass'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  Grid
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Table View */}
            {viewMode === 'table' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-accent-secondary/20">
                      <th className="text-left p-3">
                        <button
                          onClick={() => {
                            setSortBy('name');
                            setSortOrder(sortBy === 'name' && sortOrder === 'asc' ? 'desc' : 'asc');
                          }}
                          className="font-medium hover:text-accent-primary"
                        >
                          Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </button>
                      </th>
                      <th className="text-left p-3">
                        <button
                          onClick={() => {
                            setSortBy('email');
                            setSortOrder(sortBy === 'email' && sortOrder === 'asc' ? 'desc' : 'asc');
                          }}
                          className="font-medium hover:text-accent-primary"
                        >
                          Email {sortBy === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </button>
                      </th>
                      <th className="text-left p-3">
                        <button
                          onClick={() => {
                            setSortBy('role');
                            setSortOrder(sortBy === 'role' && sortOrder === 'asc' ? 'desc' : 'asc');
                          }}
                          className="font-medium hover:text-accent-primary"
                        >
                          Role {sortBy === 'role' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </button>
                      </th>
                      <th className="text-left p-3">
                        <button
                          onClick={() => {
                            setSortBy('status');
                            setSortOrder(sortBy === 'status' && sortOrder === 'asc' ? 'desc' : 'asc');
                          }}
                          className="font-medium hover:text-accent-primary"
                        >
                          Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </button>
                      </th>
                      <th className="text-left p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.map((user) => (
                      <tr key={user.id} className="border-b border-accent-secondary/10 hover:bg-accent-secondary/5">
                        <td className="p-3">{user.name}</td>
                        <td className="p-3 text-muted-foreground">{user.email}</td>
                        <td className="p-3">
                          <span className="px-2 py-1 rounded-full text-xs bg-accent-primary/10 text-accent-primary">
                            {user.role}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.status === 'active' 
                              ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                              : 'bg-gray-500/10 text-gray-600 dark:text-gray-400'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Can permission="users:update">
                              <Button variant="glass" size="sm">Edit</Button>
                            </Can>
                            <Can permission="users:delete">
                              <Button variant="glass" size="sm">Delete</Button>
                            </Can>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div className="space-y-3">
                {paginatedUsers.map((user) => (
                  <div key={user.id} className="p-4 rounded-lg border border-accent-secondary/20 bg-surface-primary/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="flex gap-2 mt-2">
                          <span className="px-2 py-1 rounded-full text-xs bg-accent-primary/10 text-accent-primary">
                            {user.role}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.status === 'active' 
                              ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                              : 'bg-gray-500/10 text-gray-600 dark:text-gray-400'
                          }`}>
                            {user.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Can permission="users:update">
                          <Button variant="glass" size="sm">Edit</Button>
                        </Can>
                        <Can permission="users:delete">
                          <Button variant="glass" size="sm">Delete</Button>
                        </Can>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedUsers.map((user) => (
                  <Card key={user.id} variant="flat">
                    <CardContent className="pt-6">
                      <div className="text-center space-y-3">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary mx-auto flex items-center justify-center text-2xl text-white">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold">{user.name}</h3>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        <div className="flex gap-2 justify-center">
                          <span className="px-2 py-1 rounded-full text-xs bg-accent-primary/10 text-accent-primary">
                            {user.role}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.status === 'active' 
                              ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                              : 'bg-gray-500/10 text-gray-600 dark:text-gray-400'
                          }`}>
                            {user.status}
                          </span>
                        </div>
                        <div className="flex gap-2 justify-center">
                          <Can permission="users:update">
                            <Button variant="glass" size="sm">Edit</Button>
                          </Can>
                          <Can permission="users:delete">
                            <Button variant="glass" size="sm">Delete</Button>
                          </Can>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* No Results */}
            {paginatedUsers.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Typography variant="p">No users found matching your filters.</Typography>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-accent-secondary/20">
                <Button
                  variant="glass"
                  size="sm"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                >
                  ← Previous
                </Button>
                
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? 'solid' : 'glass'}
                      size="sm"
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  ))}
                </div>
                
                <Button
                  variant="glass"
                  size="sm"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                >
                  Next →
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card variant="default">
          <CardHeader>
            <CardTitle>💡 How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <p>• All filter values are automatically synced with URL query parameters</p>
              <p>• Try changing filters and copy the URL - it preserves your exact view</p>
              <p>• Share the URL with others and they'll see the same filtered results</p>
              <p>• Use browser back/forward buttons - your filter state is preserved</p>
              <p>• Refresh the page - your filters remain applied</p>
              <p>• Perfect for bookmarking specific views or sharing filtered data</p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

export default function URLStatePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <URLStateContent />
    </Suspense>
  );
}
