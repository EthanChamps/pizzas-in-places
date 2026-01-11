'use client';

interface StatusBadgeProps {
  status: string;
  variant: 'enquiry' | 'booking' | 'blog';
}

const statusColors: Record<string, Record<string, string>> = {
  enquiry: {
    new: 'bg-orange-100 text-orange-800',
    read: 'bg-blue-100 text-blue-800',
    archived: 'bg-gray-100 text-gray-800',
  },
  booking: {
    new: 'bg-orange-100 text-orange-800',
    replied: 'bg-blue-100 text-blue-800',
    booked: 'bg-green-100 text-green-800',
    declined: 'bg-red-100 text-red-800',
  },
  blog: {
    published: 'bg-green-100 text-green-800',
    draft: 'bg-gray-100 text-gray-800',
  },
};

const statusLabels: Record<string, Record<string, string>> = {
  enquiry: {
    new: 'New',
    read: 'Read',
    archived: 'Archived',
  },
  booking: {
    new: 'New',
    replied: 'Replied',
    booked: 'Booked',
    declined: 'Declined',
  },
  blog: {
    published: 'Published',
    draft: 'Draft',
  },
};

export default function StatusBadge({ status, variant }: StatusBadgeProps) {
  const colorClass = statusColors[variant]?.[status] || 'bg-gray-100 text-gray-800';
  const label = statusLabels[variant]?.[status] || status;

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${colorClass}`}>
      {label}
    </span>
  );
}
