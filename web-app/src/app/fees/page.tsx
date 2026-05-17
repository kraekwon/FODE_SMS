import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function FeesPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/" className="p-2 hover:bg-gray-200 rounded-full transition"><ArrowLeft className="w-6 h-6" /></Link>
          <h1 className="text-3xl font-bold text-gray-900">Fee Registration</h1>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
           <p className="text-gray-500">Search for a student to view and register subject fees.</p>
        </div>
      </div>
    </div>
  );
}