// Admin API client with typed functions for all admin endpoints

import { getSessionToken } from './auth-client';

// Types
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  enquiry_type: 'general' | 'private-hire' | 'event' | 'feedback';
  message: string;
  status: 'new' | 'read' | 'archived';
  created_at: string;
}

export interface Booking {
  id: string;
  name: string;
  email: string;
  event_type: 'wedding' | 'corporate' | 'party' | 'other';
  event_date: string;
  location: string;
  guest_count: string;
  notes?: string;
  status: 'new' | 'replied' | 'booked' | 'declined';
  created_at: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: PostContent[];
  featured_image_url?: string;
  reading_time: number;
  tags: string[];
  is_published: boolean;
  published_at?: string;
  seo_title?: string;
  seo_description?: string;
  created_at: string;
  updated_at: string;
}

export interface PostContent {
  type: 'paragraph' | 'image';
  text?: string;
  src?: string;
  alt?: string;
  caption?: string;
}

export interface Location {
  id: string;
  name: string;
  description?: string;
  date: string;
  start_time: string;
  end_time: string;
  latitude: number;
  longitude: number;
  what3words?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// API Error class
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  // Get session token for Authorization header
  const token = await getSessionToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  // Add Authorization header if we have a token
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...options,
    credentials: 'include',
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new ApiError(error.error || 'Request failed', res.status);
  }

  return res.json();
}

// Enquiries
export async function getEnquiries(params?: { page?: number; status?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.status) searchParams.set('status', params.status);

  return fetchApi<{ enquiries: Enquiry[]; pagination: Pagination }>(
    `/api/admin/enquiries?${searchParams}`
  );
}

export async function updateEnquiryStatus(id: string, status: Enquiry['status']) {
  return fetchApi<{ success: boolean; enquiry: { id: string; status: string } }>(
    `/api/admin/enquiries/${id}`,
    { method: 'PATCH', body: JSON.stringify({ status }) }
  );
}

// Bookings
export async function getBookings(params?: { page?: number; status?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.status) searchParams.set('status', params.status);

  return fetchApi<{ bookings: Booking[]; pagination: Pagination }>(
    `/api/admin/bookings?${searchParams}`
  );
}

export async function updateBookingStatus(id: string, status: Booking['status']) {
  return fetchApi<{ success: boolean; booking: { id: string; status: string } }>(
    `/api/admin/bookings/${id}`,
    { method: 'PATCH', body: JSON.stringify({ status }) }
  );
}

// Blog Posts
export async function getBlogPosts(params?: { page?: number }) {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', String(params.page));

  return fetchApi<{ posts: BlogPost[]; pagination: Pagination }>(
    `/api/admin/blog?${searchParams}`
  );
}

export async function getBlogPost(id: string) {
  return fetchApi<{ post: BlogPost }>(`/api/admin/blog/${id}`);
}

export interface CreateBlogPostInput {
  slug: string;
  title: string;
  excerpt: string;
  content: PostContent[];
  featured_image_url?: string;
  reading_time?: number;
  tags?: string[];
  is_published?: boolean;
  published_at?: string;
  seo_title?: string;
  seo_description?: string;
}

export async function createBlogPost(data: CreateBlogPostInput) {
  return fetchApi<{ success: boolean; post: { id: string; slug: string; created_at: string } }>(
    '/api/admin/blog',
    { method: 'POST', body: JSON.stringify(data) }
  );
}

export async function updateBlogPost(id: string, data: CreateBlogPostInput) {
  return fetchApi<{ success: boolean; post: { id: string; slug: string; updated_at: string } }>(
    `/api/admin/blog/${id}`,
    { method: 'PUT', body: JSON.stringify(data) }
  );
}

export async function deleteBlogPost(id: string) {
  return fetchApi<{ success: boolean; deleted: string }>(
    `/api/admin/blog/${id}`,
    { method: 'DELETE' }
  );
}

// Locations
export async function getLocations(params?: { page?: number; from?: string; to?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.from) searchParams.set('from', params.from);
  if (params?.to) searchParams.set('to', params.to);

  return fetchApi<{ locations: Location[]; pagination: Pagination }>(
    `/api/admin/locations?${searchParams}`
  );
}

export async function getLocation(id: string) {
  return fetchApi<{ location: Location }>(`/api/admin/locations/${id}`);
}

export interface CreateLocationInput {
  name: string;
  description?: string;
  date: string;
  start_time: string;
  end_time: string;
  latitude: number;
  longitude: number;
  what3words?: string;
  is_active?: boolean;
}

export async function createLocation(data: CreateLocationInput) {
  return fetchApi<{ success: boolean; location: { id: string; name: string; date: string; created_at: string } }>(
    '/api/admin/locations',
    { method: 'POST', body: JSON.stringify(data) }
  );
}

export async function updateLocation(id: string, data: CreateLocationInput) {
  return fetchApi<{ success: boolean; location: { id: string; name: string; date: string; updated_at: string } }>(
    `/api/admin/locations/${id}`,
    { method: 'PUT', body: JSON.stringify(data) }
  );
}

export async function deleteLocation(id: string) {
  return fetchApi<{ success: boolean; deleted: string }>(
    `/api/admin/locations/${id}`,
    { method: 'DELETE' }
  );
}
