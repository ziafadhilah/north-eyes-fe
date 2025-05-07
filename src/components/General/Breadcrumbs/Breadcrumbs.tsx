"use client";

import Link from "next/link";

interface BreadcrumbsProps {
  current: string;
}

export default function Breadcrumbs({ current }: BreadcrumbsProps) {
  return (
    <nav className="text-sm text-gray-500 mb-6" aria-label="breadcrumb">
      <ol className="list-none p-0 inline-flex space-x-2 items-center">
        <li>
          <Link href="/home" className="hover:underline">
            Home
          </Link>
        </li>
        <span className="material-symbols-outlined">chevron_right</span>
        <li className="text-gray-700 font-medium">{current}</li>
      </ol>
    </nav>
  );
}
