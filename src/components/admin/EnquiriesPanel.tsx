'use client';

import { useState, useEffect, useCallback } from 'react';
import { getEnquiries, updateEnquiryStatus, type Enquiry } from '@/lib/admin-api';
import StatusBadge from './StatusBadge';

const STATUS_OPTIONS: Enquiry['status'][] = ['new', 'read', 'archived'];

export default function EnquiriesPanel() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params: { page?: number; status?: string } = { page: pagination.page };
      if (statusFilter) params.status = statusFilter;

      const data = await getEnquiries(params);
      setEnquiries(data.enquiries);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load enquiries');
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusChange = async (id: string, newStatus: Enquiry['status']) => {
    try {
      await updateEnquiryStatus(id, newStatus);
      setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const enquiryTypeLabels: Record<string, string> = {
    'general': 'General',
    'private-hire': 'Private Hire',
    'event': 'Event',
    'feedback': 'Feedback',
  };

  if (isLoading && enquiries.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Filter */}
      <div className="mb-4 flex items-center gap-4">
        <label htmlFor="status-filter" className="text-sm font-medium text-gray-700">
          Filter by status:
        </label>
        <select
          id="status-filter"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPagination(prev => ({ ...prev, page: 1 }));
          }}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">All</option>
          {STATUS_OPTIONS.map(status => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          {error}
        </div>
      )}

      {enquiries.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No enquiries found
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {enquiries.map((enquiry) => (
                  <>
                    <tr
                      key={enquiry.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => setExpandedId(expandedId === enquiry.id ? null : enquiry.id)}
                    >
                      <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                        {formatDate(enquiry.created_at)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {enquiry.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <a href={`mailto:${enquiry.email}`} className="hover:text-orange-600" onClick={e => e.stopPropagation()}>
                          {enquiry.email}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {enquiryTypeLabels[enquiry.enquiry_type] || enquiry.enquiry_type}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <StatusBadge status={enquiry.status} variant="enquiry" />
                      </td>
                      <td className="px-4 py-3 text-sm" onClick={e => e.stopPropagation()}>
                        <select
                          value={enquiry.status}
                          onChange={(e) => handleStatusChange(enquiry.id, e.target.value as Enquiry['status'])}
                          className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          {STATUS_OPTIONS.map(status => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                    {expandedId === enquiry.id && (
                      <tr key={`${enquiry.id}-expanded`}>
                        <td colSpan={6} className="px-4 py-4 bg-gray-50">
                          <div className="text-sm">
                            <p className="font-medium text-gray-700 mb-2">Message:</p>
                            <p className="text-gray-600 whitespace-pre-wrap">{enquiry.message}</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
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
    </div>
  );
}
