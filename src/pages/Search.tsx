import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, User, MessageSquare, Heart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { debounce } from '@/lib/utils';
import { apiClient } from '@/lib/api';
import UserBadge from '@/components/UserBadge';
import { formatTimeAgo } from '@/lib/utils';

interface SearchResult {
  id: string;
  type: 'post' | 'user';
  content?: string;
  fullName?: string;
  role?: 'patient' | 'doctor';
  genotype?: string;
  createdAt?: string;
  likesCount?: number;
  commentsCount?: number;
}

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const { user } = useAuth();

  const search = async (searchQuery: string, type: string = 'all') => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      // This would be implemented in your backend
      const response = await fetch(`https://sickleconnect.onrender.com/api/search?q=${encodeURIComponent(searchQuery)}&type=${type}`);
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = debounce(search, 300);

  useEffect(() => {
    if (query) {
      debouncedSearch(query, activeTab);
    }
  }, [query, activeTab]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: query });
    search(query, activeTab);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (query) {
      search(query, value);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* Header */}
      <header className="bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Search</h1>
          <div className="text-muted-foreground">
            Welcome back, {user?.fullName}!
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Search Form */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Search SickleConnect</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search posts, users, or topics..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-10"
                    aria-label="Search query"
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Searching...' : 'Search'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Search Results */}
          {query && (
            <Card>
              <CardHeader>
                <Tabs value={activeTab} onValueChange={handleTabChange}>
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="posts">Posts</TabsTrigger>
                    <TabsTrigger value="users">Users</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab}>
                  <TabsContent value="all" className="space-y-4">
                    {results.length === 0 && !isLoading ? (
                      <div className="text-center py-8">
                        <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No results found for "{query}"</p>
                      </div>
                    ) : (
                      results.map((result) => (
                        <Card key={result.id} className="p-4">
                          {result.type === 'post' ? (
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <MessageSquare className="h-4 w-4 text-primary" />
                                <span className="text-sm text-muted-foreground">Post</span>
                              </div>
                              <p className="mb-2">{result.content}</p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>{result.likesCount} likes</span>
                                <span>{result.commentsCount} comments</span>
                                <span>{formatTimeAgo(result.createdAt!)}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="text-primary font-semibold">
                                  {result.fullName?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold">{result.fullName}</h3>
                                  {result.role && (
                                    <UserBadge 
                                      role={result.role} 
                                      genotype={result.genotype} 
                                      size="sm" 
                                    />
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">User</p>
                              </div>
                            </div>
                          )}
                        </Card>
                      ))
                    )}
                  </TabsContent>
                  <TabsContent value="posts">
                    {results.filter(r => r.type === 'post').length === 0 ? (
                      <div className="text-center py-8">
                        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No posts found</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {results.filter(r => r.type === 'post').map((result) => (
                          <Card key={result.id} className="p-4">
                            <p className="mb-2">{result.content}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{result.likesCount} likes</span>
                              <span>{result.commentsCount} comments</span>
                              <span>{formatTimeAgo(result.createdAt!)}</span>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="users">
                    {results.filter(r => r.type === 'user').length === 0 ? (
                      <div className="text-center py-8">
                        <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No users found</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {results.filter(r => r.type === 'user').map((result) => (
                          <Card key={result.id} className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="text-primary font-semibold">
                                  {result.fullName?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold">{result.fullName}</h3>
                                  {result.role && (
                                    <UserBadge 
                                      role={result.role} 
                                      genotype={result.genotype} 
                                      size="sm" 
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default SearchPage;
