'use client';

export type AdminTab = 'enquiries' | 'bookings' | 'blog' | 'locations';

interface AdminTabsProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  counts?: {
    enquiries?: number;
    bookings?: number;
  };
}

const tabs: { id: AdminTab; label: string }[] = [
  { id: 'enquiries', label: 'Enquiries' },
  { id: 'bookings', label: 'Bookings' },
  { id: 'blog', label: 'Blog' },
  { id: 'locations', label: 'Locations' },
];

export default function AdminTabs({ activeTab, onTabChange, counts }: AdminTabsProps) {
  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8" aria-label="Admin sections">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const count = tab.id === 'enquiries' ? counts?.enquiries : tab.id === 'bookings' ? counts?.bookings : undefined;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                relative py-4 px-1 font-medium text-sm transition-colors
                ${isActive
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
                }
              `}
              aria-current={isActive ? 'page' : undefined}
            >
              {tab.label}
              {count !== undefined && count > 0 && (
                <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
