'use client';

import { useState, useEffect, useCallback } from 'react';
import { getLocations, createLocation, updateLocation, deleteLocation, type Location, type CreateLocationInput } from '@/lib/admin-api';
import LocationEditor from './LocationEditor';
import ConfirmDialog from './ConfirmDialog';

type FilterType = 'upcoming' | 'past' | 'all';

export default function LocationsPanel() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [filter, setFilter] = useState<FilterType>('upcoming');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Location | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const today = new Date().toISOString().split('T')[0];
      const params: { page?: number; from?: string; to?: string } = { page: pagination.page };

      if (filter === 'upcoming') {
        params.from = today;
      } else if (filter === 'past') {
        params.to = today;
      }

      const data = await getLocations(params);
      setLocations(data.locations);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load locations');
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, filter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = async (data: CreateLocationInput) => {
    await createLocation(data);
    setIsCreating(false);
    fetchData();
  };

  const handleUpdate = async (data: CreateLocationInput) => {
    if (!editingLocation) return;
    await updateLocation(editingLocation.id, data);
    setEditingLocation(null);
    fetchData();
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteLocation(deleteConfirm.id);
      setDeleteConfirm(null);
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete location');
      setDeleteConfirm(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  if (isLoading && locations.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <label htmlFor="location-filter" className="text-sm font-medium text-gray-700">
            Show:
          </label>
          <select
            id="location-filter"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value as FilterType);
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
            <option value="all">All</option>
          </select>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors text-sm"
        >
          Add Location
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          {error}
        </div>
      )}

      {locations.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No locations found
        </div>
      ) : (
        <>
          {/* List */}
          <div className="space-y-3">
            {locations.map((location) => (
              <div
                key={location.id}
                className={`p-4 bg-white border rounded-lg ${!location.is_active ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{location.name}</h3>
                      {!location.is_active && (
                        <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatDate(location.date)} &middot; {formatTime(location.start_time)} - {formatTime(location.end_time)}
                    </p>
                    {location.description && (
                      <p className="text-sm text-gray-500 mt-1">{location.description}</p>
                    )}
                    {location.what3words && (
                      <p className="text-xs text-gray-400 mt-1">{location.what3words}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => setEditingLocation(location)}
                      className="px-3 py-1 text-sm text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(location)}
                      className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
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

      {/* Editor Modal */}
      {(isCreating || editingLocation) && (
        <LocationEditor
          location={editingLocation}
          onSave={editingLocation ? handleUpdate : handleCreate}
          onCancel={() => {
            setIsCreating(false);
            setEditingLocation(null);
          }}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        title="Delete Location"
        message={`Are you sure you want to delete "${deleteConfirm?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
