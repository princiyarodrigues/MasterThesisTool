'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

/**
 * A reusable back button component that navigates back to the main Process Model page
 * 
 * @param {Object} props
 * @param {string} props.label - The button label text (default: "Back to Department")
 * @param {string} props.href - The target URL (default: "/")
 * @param {string} props.className - Additional CSS classes for customization
 */
export default function BackButton({ 
  label = "Back to Department", 
  href = "/",
  className = ""
}) {
  return (
    <Link 
      href={href}
      className={`inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors ${className}`}
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      <span>{label}</span>
    </Link>
  );
} 