import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface UseInfiniteScrollOptions {
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  threshold?: number;
  rootMargin?: string;
}

export function useInfiniteScroll({
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  threshold = 0.1,
  rootMargin = '100px',
}: UseInfiniteScrollOptions) {
  const { ref, inView } = useInView({
    threshold,
    rootMargin,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return { ref };
}

// Hook for infinite scroll with posts
export function useInfinitePosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

  const fetchPosts = async (pageNum: number, isLoadMore = false) => {
    if (isLoadMore) {
      setIsFetchingNextPage(true);
    } else {
      setIsLoading(true);
    }

    try {
      const response = await fetch(`http://localhost:5000/api/posts?page=${pageNum}&limit=10`);
      const data = await response.json();

      if (isLoadMore) {
        setPosts(prev => [...prev, ...data]);
      } else {
        setPosts(data);
      }

      setHasNextPage(data.length === 10);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
      setIsFetchingNextPage(false);
    }
  };

  const fetchNextPage = () => {
    if (hasNextPage && !isFetchingNextPage) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPosts(nextPage, true);
    }
  };

  const refresh = () => {
    setPage(1);
    setPosts([]);
    setHasNextPage(true);
    fetchPosts(1);
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const { ref } = useInfiniteScroll({
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  });

  return {
    posts,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    refresh,
    loadMoreRef: ref,
  };
}
