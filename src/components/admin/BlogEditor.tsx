'use client';

import { useState, useEffect, useRef } from 'react';
import type { BlogPost, PostContent, CreateBlogPostInput } from '@/lib/admin-api';

interface BlogEditorProps {
  post?: BlogPost | null;
  onSave: (data: CreateBlogPostInput) => Promise<void>;
  onCancel: () => void;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 200);
}

function getInitialFormData(post?: BlogPost | null): CreateBlogPostInput {
  if (post) {
    return {
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content.length > 0 ? post.content : [{ type: 'paragraph', text: '' }],
      featured_image_url: post.featured_image_url || '',
      reading_time: post.reading_time,
      tags: post.tags,
      is_published: post.is_published,
      published_at: post.published_at,
      seo_title: post.seo_title || '',
      seo_description: post.seo_description || '',
    };
  }
  return {
    slug: '',
    title: '',
    excerpt: '',
    content: [{ type: 'paragraph', text: '' }],
    featured_image_url: '',
    reading_time: 5,
    tags: [],
    is_published: false,
    seo_title: '',
    seo_description: '',
  };
}

export default function BlogEditor({ post, onSave, onCancel }: BlogEditorProps) {
  const [formData, setFormData] = useState<CreateBlogPostInput>(() => getInitialFormData(post));
  const [tagsInput, setTagsInput] = useState(() => post?.tags.join(', ') || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoSlug, setAutoSlug] = useState(() => !post);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onCancel]);

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: autoSlug ? generateSlug(title) : prev.slug,
    }));
  };

  const handleTagsChange = (value: string) => {
    setTagsInput(value);
    const tags = value
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0)
      .slice(0, 10);
    setFormData(prev => ({ ...prev, tags }));
  };

  const addContentBlock = (type: 'paragraph' | 'image') => {
    const newBlock: PostContent = type === 'paragraph'
      ? { type: 'paragraph', text: '' }
      : { type: 'image', src: '', alt: '', caption: '' };
    setFormData(prev => ({
      ...prev,
      content: [...prev.content, newBlock],
    }));
  };

  const updateContentBlock = (index: number, updates: Partial<PostContent>) => {
    setFormData(prev => ({
      ...prev,
      content: prev.content.map((block, i) => i === index ? { ...block, ...updates } : block),
    }));
  };

  const removeContentBlock = (index: number) => {
    if (formData.content.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== index),
    }));
  };

  const moveContentBlock = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= formData.content.length) return;

    setFormData(prev => {
      const newContent = [...prev.content];
      [newContent[index], newContent[newIndex]] = [newContent[newIndex], newContent[index]];
      return { ...prev, content: newContent };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      // Filter out empty content blocks
      const cleanedContent = formData.content.filter(block => {
        if (block.type === 'paragraph') return block.text && block.text.trim().length > 0;
        if (block.type === 'image') return block.src && block.src.trim().length > 0;
        return false;
      });

      if (cleanedContent.length === 0) {
        throw new Error('At least one content block is required');
      }

      await onSave({
        ...formData,
        content: cleanedContent,
        featured_image_url: formData.featured_image_url || undefined,
        seo_title: formData.seo_title || undefined,
        seo_description: formData.seo_description || undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save post');
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 py-6" ref={dialogRef}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            {post ? 'Edit Post' : 'New Post'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <h3 className="font-medium text-gray-900">Basic Info</h3>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                Slug *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => {
                    setAutoSlug(false);
                    setFormData(prev => ({ ...prev, slug: e.target.value }));
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                  title="Lowercase letters, numbers, and hyphens only"
                  required
                />
                {!autoSlug && (
                  <button
                    type="button"
                    onClick={() => {
                      setAutoSlug(true);
                      setFormData(prev => ({ ...prev, slug: generateSlug(prev.title) }));
                    }}
                    className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md"
                  >
                    Auto
                  </button>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
                Excerpt *
              </label>
              <textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows={2}
                maxLength={500}
                required
              />
              <p className="text-xs text-gray-500 mt-1">{formData.excerpt.length}/500</p>
            </div>
          </div>

          {/* Content Blocks */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <h3 className="font-medium text-gray-900">Content</h3>

            {formData.content.map((block, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <select
                    value={block.type}
                    onChange={(e) => {
                      const newType = e.target.value as 'paragraph' | 'image';
                      if (newType === 'paragraph') {
                        updateContentBlock(index, { type: 'paragraph', text: '', src: undefined, alt: undefined, caption: undefined });
                      } else {
                        updateContentBlock(index, { type: 'image', text: undefined, src: '', alt: '', caption: '' });
                      }
                    }}
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="paragraph">Paragraph</option>
                    <option value="image">Image</option>
                  </select>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveContentBlock(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      title="Move up"
                    >
                      &#x2191;
                    </button>
                    <button
                      type="button"
                      onClick={() => moveContentBlock(index, 'down')}
                      disabled={index === formData.content.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      title="Move down"
                    >
                      &#x2193;
                    </button>
                    <button
                      type="button"
                      onClick={() => removeContentBlock(index)}
                      disabled={formData.content.length <= 1}
                      className="p-1 text-red-400 hover:text-red-600 disabled:opacity-30"
                      title="Remove"
                    >
                      &#x2715;
                    </button>
                  </div>
                </div>

                {block.type === 'paragraph' ? (
                  <textarea
                    value={block.text || ''}
                    onChange={(e) => updateContentBlock(index, { text: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    rows={4}
                    placeholder="Enter paragraph text..."
                  />
                ) : (
                  <div className="space-y-2">
                    <input
                      type="url"
                      value={block.src || ''}
                      onChange={(e) => updateContentBlock(index, { src: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Image URL"
                    />
                    <input
                      type="text"
                      value={block.alt || ''}
                      onChange={(e) => updateContentBlock(index, { alt: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Alt text (for accessibility)"
                    />
                    <input
                      type="text"
                      value={block.caption || ''}
                      onChange={(e) => updateContentBlock(index, { caption: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Caption (optional)"
                    />
                  </div>
                )}
              </div>
            ))}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => addContentBlock('paragraph')}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
              >
                + Paragraph
              </button>
              <button
                type="button"
                onClick={() => addContentBlock('image')}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
              >
                + Image
              </button>
            </div>
          </div>

          {/* Media & Meta */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <h3 className="font-medium text-gray-900">Media & Metadata</h3>

            <div>
              <label htmlFor="featured_image_url" className="block text-sm font-medium text-gray-700 mb-1">
                Featured Image URL
              </label>
              <input
                type="url"
                id="featured_image_url"
                value={formData.featured_image_url || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, featured_image_url: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="https://..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="reading_time" className="block text-sm font-medium text-gray-700 mb-1">
                  Reading Time (min)
                </label>
                <input
                  type="number"
                  id="reading_time"
                  value={formData.reading_time || 5}
                  onChange={(e) => setFormData(prev => ({ ...prev, reading_time: parseInt(e.target.value) || 5 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  min={1}
                  max={60}
                />
              </div>
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  id="tags"
                  value={tagsInput}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="recipes, events, news"
                />
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <h3 className="font-medium text-gray-900">SEO</h3>

            <div>
              <label htmlFor="seo_title" className="block text-sm font-medium text-gray-700 mb-1">
                SEO Title
              </label>
              <input
                type="text"
                id="seo_title"
                value={formData.seo_title || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, seo_title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                maxLength={70}
              />
              <p className="text-xs text-gray-500 mt-1">{(formData.seo_title || '').length}/70</p>
            </div>

            <div>
              <label htmlFor="seo_description" className="block text-sm font-medium text-gray-700 mb-1">
                SEO Description
              </label>
              <textarea
                id="seo_description"
                value={formData.seo_description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, seo_description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows={2}
                maxLength={160}
              />
              <p className="text-xs text-gray-500 mt-1">{(formData.seo_description || '').length}/160</p>
            </div>
          </div>

          {/* Publishing */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={formData.is_published}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="is_published" className="ml-2 text-sm text-gray-700">
                  Publish immediately
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white rounded-lg font-medium transition-colors"
                >
                  {isSaving ? 'Saving...' : post ? 'Update Post' : 'Create Post'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
