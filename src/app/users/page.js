"use client";
import UserTabs from "@/components/layout/UserTabs";
import SectionHeaders from "@/components/layout/SectionHeaders";
import { UseProfile } from "@/components/UseProfile";
import Link from "next/link";
import { useEffect, useState } from "react";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const { loading: profileLoading, data: profileData } = UseProfile();

  useEffect(() => {
    fetch("/api/users").then((response) => {
      response.json().then((userData) => {
        if (Array.isArray(userData)) {
          setUsers(userData);
        }
        setLoadingUsers(false);
      });
    }).catch(() => setLoadingUsers(false));
  }, []);

  if (profileLoading) {
    return (
      <div className="py-24 text-center text-gray-500">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p>Loading users...</p>
      </div>
    );
  }

  if (!profileData?.admin) {
    return (
      <div className="py-24 text-center text-gray-500">
        <p className="text-xl font-bold text-gray-900">Access Denied</p>
        <p className="text-sm mt-1">You must be an administrator to view this directory.</p>
      </div>
    );
  }

  return (
    <section className="py-6 max-w-4xl mx-auto">
      <UserTabs isAdmin={true} />

      <div className="mt-8">
        <SectionHeaders subHeader="Administration" mainHeader="Registered Users" />

        {loadingUsers ? (
          <div className="space-y-3 mt-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-4 border border-orange-100 shadow-card animate-pulse h-16" />
            ))}
          </div>
        ) : (
          <div className="space-y-3 mt-8">
            {users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user._id || user.email}
                  className="bg-white rounded-2xl p-4 px-6 border border-orange-100 shadow-xs flex items-center justify-between gap-4 hover:border-orange-200 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-4 grow min-w-0">
                    <span className="w-10 h-10 rounded-full bg-orange-100 text-primary flex items-center justify-center font-bold text-sm">
                      {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                    <div className="min-w-0 grow">
                      <div className="font-bold text-gray-900 font-display flex items-center gap-2">
                        <span className="truncate">{user.name || "No name"}</span>
                        {user.admin && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>

                  <div>
                    <Link
                      href={"/users/" + user._id}
                      className="px-4 py-2 rounded-xl border border-gray-200 hover:border-primary hover:text-primary text-xs font-semibold transition-colors inline-block"
                    >
                      Edit ➔
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-12 text-gray-400 text-sm">No registered users found.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default UsersPage;
