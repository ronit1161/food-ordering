'use client';
import UserTabs from "@/components/layout/UserTabs";
import { UseProfile } from "@/components/UseProfile";

export default function EditUserPage() {
  const { loading, data } = UseProfile();

  if (loading) {
    return "Loading user info ...";
  }

  if (!data.admin) {
    return "Not an admin";
  }

  return (
    <section className="mt-8 mx-auto max-w-2xl">
      <UserTabs isAdmin={true} />

      <div className="mt-8">
        User info form
      </div>
    </section>
  );
}
