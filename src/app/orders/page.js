"use client";
import UserTabs from "@/components/layout/UserTabs";

const ordersPage = () => {
    return (
      <section className="mt-8 max-w-2xl mx-auto">
          <UserTabs isAdmin={true} />
      </section>
    )
  }

export default ordersPage;