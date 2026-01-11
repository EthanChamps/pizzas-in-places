'use client';

import { useState, useEffect, useCallback } from 'react';
import { getBlogPosts, getBlogPost, createBlogPost, updateBlogPost, deleteBlogPost, type BlogPost, type CreateBlogPostInput } from '@/lib/admin-api';
import BlogEditor from './BlogEditor';
import StatusBadge from './StatusBadge';
import ConfirmDialog from './ConfirmDialog';

type FilterType = 'all' | 'published' | 'drafts';

export default function BlogPanel() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [filter, setFilter] = useState<FilterType>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<BlogPost | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getBlogPosts({ page: pagination.page });
      let filteredPosts = data.posts;

      // Client-side filtering since API doesn't support published filter
      if (filter === 'published') {
        filteredPosts = data.posts.filter(p => p.is_published);
      } else if (filter === 'drafts') {
        filteredPosts = data.posts.filter(p => !p.is_published);
      }

      setPosts(filteredPosts);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, filter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEdit = async (postId: string) => {
    try {
      const data = await getBlogPost(postId);
      setEditingPost(data.post);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load post');
    }
  };

  const handleCreate = async (data: CreateBlogPostInput) => {
    await createBlogPost(data);
    setIsCreating(false);
    fetchData();
  };

  const handleUpdate = async (data: CreateBlogPostInput) => {
    if (!editingPost) return;
    await updateBlogPost(editingPost.id, data);
    setEditingPost(null);
    fetchData();
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteBlogPost(deleteConfirm.id);
      setDeleteConfirm(null);
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete post');
      setDeleteConfirm(null);
    }
  };

  const handleTogglePublish = async (post: BlogPost) => {
    try {
      const fullPost = await getBlogPost(post.id);
      await updateBlogPost(post.id, {
        ...fullPost.post,
        is_published: !post.is_published,
      });
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update post');
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (isLoading && posts.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  // Show editor full-screen
  if (isCreating || editingPost) {
    return (
      <BlogEditor
        post={editingPost}
        onSave={editingPost ? handleUpdate : handleCreate}
        onCancel={() => {
          setIsCreating(false);
          setEditingPost(null);
        }}
      />
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {(['all', 'published', 'drafts'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                filter === f
                  ? 'bg-orange-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors text-sm"
        >
          New Post
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          {error}
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No posts found
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">{post.title}</div>
                      <div className="text-xs text-gray-500">/{post.slug}</div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <StatusBadge
                        status={post.is_published ? 'published' : 'draft'}
                        variant="blog"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                      {formatDate(post.updated_at)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {post.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                              {tag}
                            </span>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="text-xs text-gray-400">+{post.tags.length - 3}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(post.id)}
                          className="text-orange-600 hover:text-orange-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleTogglePublish(post)}
                          className="text-gray-600 hover:text-gray-700"
                        >
                          {post.is_published ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(post)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        title="Delete Post"
        message={`Are you sure you want to delete "${deleteConfirm?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
