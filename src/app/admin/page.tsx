"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "@/lib/auth-client";
import AdminTabs, { type AdminTab } from "@/components/admin/AdminTabs";
import EnquiriesPanel from "@/components/admin/EnquiriesPanel";
import BookingsPanel from "@/components/admin/BookingsPanel";
import BlogPanel from "@/components/admin/BlogPanel";
import LocationsPanel from "@/components/admin/LocationsPanel";

export default function AdminPage() {
  const { data: session, isPending } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("enquiries");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoggingIn(true);

    try {
      const result = await signIn.email({
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message || "Login failed");
      }
    } catch {
      setError("An error occurred during login");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  // Loading state
  if (isPending) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated and has admin role
  // Cast user to include role field from Neon Auth
  const user = session?.user as { role?: string } | undefined;
  const isAdmin = user?.role === 'admin';

  // Not authenticated - show login form
  if (!session) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-orange-900 mb-6 text-center">
              Admin Login
            </h1>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                  disabled={isLoggingIn}
                />
              </div>
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
                  disabled={isLoggingIn}
                />
              </div>
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white py-2 rounded-lg font-medium transition-colors"
              >
                {isLoggingIn ? "Logging in..." : "Login"}
              </button>
            </form>
            <div className="mt-4 text-center">
              <Link href="/" className="text-orange-600 hover:text-orange-700 text-sm">
                Back to Website
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated but not admin - show access denied
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Access Denied
            </h1>
            <p className="text-gray-600 mb-6">
              You do not have admin privileges. Please contact the site administrator.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Logged in as: {session.user.email}
            </p>
            <div className="space-y-3">
              <button
                onClick={handleLogout}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg font-medium transition-colors"
              >
                Logout
              </button>
              <Link href="/" className="block text-orange-600 hover:text-orange-700 text-sm">
                Back to Website
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated admin - show admin panel
  return (
    <div className="min-h-screen bg-orange-50">
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-orange-900">
              Admin Panel
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Logged in as {session.user.email}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-orange-600 hover:text-orange-700">
              View Website
            </Link>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {activeTab === 'enquiries' && <EnquiriesPanel />}
          {activeTab === 'bookings' && <BookingsPanel />}
          {activeTab === 'blog' && <BlogPanel />}
          {activeTab === 'locations' && <LocationsPanel />}
        </div>
      </div>
    </div>
  );
}
