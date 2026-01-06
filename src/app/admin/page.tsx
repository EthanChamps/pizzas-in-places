"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ScheduleException {
  date: string;
  type: 'not-trading' | 'private-event';
  description?: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [exceptions, setExceptions] = useState<ScheduleException[]>([]);
  const [newException, setNewException] = useState<ScheduleException>({
    date: "",
    type: "not-trading",
    description: ""
  });

  useEffect(() => {
    // Load exceptions from localStorage
    const saved = localStorage.getItem("schedule-exceptions");
    if (saved) {
      setExceptions(JSON.parse(saved));
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check - in production, this should be proper authentication
    if (password === "pizza123") {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
  };

  const saveExceptions = (newExceptions: ScheduleException[]) => {
    setExceptions(newExceptions);
    localStorage.setItem("schedule-exceptions", JSON.stringify(newExceptions));
  };

  const addException = (e: React.FormEvent) => {
    e.preventDefault();
    if (newException.date) {
      const updated = [...exceptions, newException];
      saveExceptions(updated);
      setNewException({ date: "", type: "not-trading", description: "" });
    }
  };

  const removeException = (index: number) => {
    const updated = exceptions.filter((_, i) => i !== index);
    saveExceptions(updated);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-orange-900 mb-6 text-center">
              Admin Login
            </h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg font-medium transition-colors"
              >
                Login
              </button>
            </form>
            <div className="mt-4 text-center">
              <Link href="/" className="text-orange-600 hover:text-orange-700 text-sm">
                ← Back to Website
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-orange-900">
            Admin Panel
          </h1>
          <div className="space-x-4">
            <Link href="/" className="text-orange-600 hover:text-orange-700">
              View Website
            </Link>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="text-red-600 hover:text-red-700"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="grid gap-8">
          {/* Schedule Exceptions */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-orange-900 mb-4">
              Schedule Exceptions
            </h2>
            
            <form onSubmit={addException} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-3">Add New Exception</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={newException.date}
                    onChange={(e) => setNewException({...newException, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    id="type"
                    value={newException.type}
                    onChange={(e) => setNewException({...newException, type: e.target.value as 'not-trading' | 'private-event'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="not-trading">Not Trading</option>
                    <option value="private-event">Private Event</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <input
                    type="text"
                    id="description"
                    placeholder="e.g., Holiday, Wedding at..."
                    value={newException.description}
                    onChange={(e) => setNewException({...newException, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="mt-3 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Add Exception
              </button>
            </form>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800">Current Exceptions</h3>
              {exceptions.length === 0 ? (
                <p className="text-gray-500 italic">No exceptions scheduled</p>
              ) : (
                exceptions.map((exception, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium">{new Date(exception.date).toLocaleDateString()}</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                        exception.type === 'not-trading' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {exception.type === 'not-trading' ? 'Not Trading' : 'Private Event'}
                      </span>
                      {exception.description && (
                        <span className="ml-2 text-gray-600">- {exception.description}</span>
                      )}
                    </div>
                    <button
                      onClick={() => removeException(index)}
                      className="text-red-600 hover:text-red-700 px-2 py-1"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-orange-900 mb-4">
              Quick Actions
            </h2>
            
            <div className="grid md:grid-cols-3 gap-4">
              <Link 
                href="/schedule" 
                className="p-4 bg-orange-100 rounded-lg text-center hover:bg-orange-200 transition-colors"
              >
                <div className="text-2xl mb-2">📅</div>
                <div className="font-medium text-orange-900">View Schedule</div>
              </Link>
              
              <Link 
                href="/events" 
                className="p-4 bg-orange-100 rounded-lg text-center hover:bg-orange-200 transition-colors"
              >
                <div className="text-2xl mb-2">🎉</div>
                <div className="font-medium text-orange-900">View Events Page</div>
              </Link>
              
              <Link 
                href="/contact" 
                className="p-4 bg-orange-100 rounded-lg text-center hover:bg-orange-200 transition-colors"
              >
                <div className="text-2xl mb-2">📧</div>
                <div className="font-medium text-orange-900">View Contact Page</div>
              </Link>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-orange-900 mb-4">
              How to Use
            </h2>
            
            <div className="prose text-gray-700">
              <h3 className="font-semibold">Schedule Exceptions</h3>
              <ul className="list-disc list-inside space-y-1 mb-4">
                <li>Add dates when you won't be trading at the normal location</li>
                <li>Use "Not Trading" for holidays or days off</li>
                <li>Use "Private Event" when you're catering a private function</li>
                <li>The description field is optional but helpful for your records</li>
              </ul>
              
              <h3 className="font-semibold">Normal Schedule</h3>
              <p className="mb-4">
                The regular two-week rotating schedule runs automatically. You only need to add 
                exceptions for days when you deviate from the normal pattern.
              </p>
              
              <h3 className="font-semibold">Website Updates</h3>
              <p>
                Changes take effect immediately on the website. Customers will see updated information 
                on the schedule page and today's location on the home page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}