import React from 'react';
import Sidebar from '../components/Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="srt-admin-root">
      <Sidebar />
      <main className="srt-admin-main">{children}</main>
    </div>
  );
}
