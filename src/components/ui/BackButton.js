'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

/**
 * A reusable back button component that navigates back to the main Process Model page
 * 
 * @param {Object} props
 * @param {string} props.label - The button label text (default: "Back to Dashboard")
 * @param {string} props.href - The target URL (default: "/")
 * @param {string} props.className - Additional CSS classes for customization
 */
export default function BackButton({ 
  label = "Back to Dashboard", 
  href = "/",
  className = ""
}) {
  return (
    <Link 
      href={href}
      className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#009374] border border-[#009374] rounded-lg hover:bg-[#007a60] hover:border-[#007a60] transition-all duration-200 shadow-sm hover:shadow-md ${className}`}
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      <span>{label}</span>
    </Link>
  );
} 