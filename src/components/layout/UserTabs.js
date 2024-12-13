"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const UserTabs = ({ isAdmin }) => {
  const path = usePathname();

  return (
    <div className="flex mx-auto gap-2 tabs justify-center">
      <Link  
          href={"/profile"}
          className={path === '/profile' ? 'active' : ''}
        >
        Profile
      </Link>
      {isAdmin && (
        <>
          <Link 
            href={"/categories"}
            className={path === '/categories' ? 'active' : ''}
          >
            Categories
          </Link>

          <Link 
            href={"/menu-items"}
            className={path.includes('menu-items') ? 'active' : ''}
          >
            Menu items
          </Link>

          <Link 
            href={"/users"}
            className={path.includes('/users') ? 'active' : ''}
          >
            Users
          </Link>

          <Link 
            href={"/orders"}
            className={path === '/orders' ? 'active' : ''}
          >
            Orders
          </Link>
        </>
      )}
    </div>
  );
};

export default UserTabs;