'use client';
import React from 'react';
import Link from 'next/link';
import { Calendar, Users, Settings, HelpCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-teal-600 text-white mt-16 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-4">DTFT</h3>
            <p className="text-teal-100 text-sm leading-relaxed">
              Empowering digital transformation in manufacturing through strategic planning, 
              business capabilities analysis, and comprehensive process modeling.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/strategic-goals" className="text-teal-100 hover:text-white transition-colors flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Strategic Goals
                </Link>
              </li>
              <li>
                <Link href="/" className="text-teal-100 hover:text-white transition-colors flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Departments
                </Link>
              </li>
              <li>
                <Link href="/settings" className="text-teal-100 hover:text-white transition-colors flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-teal-100 hover:text-white transition-colors flex items-center">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Help Center
                </Link>
              </li>
              <li>
                <span className="text-teal-100">Version 1.0.0</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-teal-500 mt-8 pt-6 text-center">
          <p className="text-teal-100 text-sm">
            © {new Date().getFullYear()} DTFT. Built for manufacturing excellence.
          </p>
        </div>
      </div>
    </footer>
  );
} 