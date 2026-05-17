'use client';
import Link from 'next/link';
import { Users, GraduationCap, DollarSign, FileText, LogOut } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
           <h1 className="text-4xl font-bold text-gray-900">FODE Student Management System</h1>
           <div className="flex flex-col items-end">
              {session?.user && (
                 <>
                   <span className="text-sm font-medium text-gray-600 mb-2">Logged in as: {session.user.name}</span>
                   <button 
                     onClick={() => signOut()} 
                     className="flex items-center text-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-gray-700 transition"
                   >
                     <LogOut className="w-4 h-4 mr-2" />
                     Sign Out
                   </button>
                 </>
              )}
           </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <Link href="/students" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col items-center justify-center space-y-4">
            <div className="bg-blue-100 p-4 rounded-full">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Student Directory</h2>
            <p className="text-gray-500 text-center">View, add, and manage student records</p>
          </Link>

          <Link href="/marks" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col items-center justify-center space-y-4">
            <div className="bg-green-100 p-4 rounded-full">
              <GraduationCap className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Marks Registration</h2>
            <p className="text-gray-500 text-center">Record and update student subject marks</p>
          </Link>

          <Link href="/fees" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col items-center justify-center space-y-4">
            <div className="bg-yellow-100 p-4 rounded-full">
              <DollarSign className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Fee Registration</h2>
            <p className="text-gray-500 text-center">Manage student subject fees and payments</p>
          </Link>

          <Link href="/reports" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col items-center justify-center space-y-4">
            <div className="bg-purple-100 p-4 rounded-full">
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Reports</h2>
            <p className="text-gray-500 text-center">Generate and design custom student reports</p>
          </Link>
        </div>

        {session?.user && ((session.user as any).role === 'BACK_OFFICE' || (session.user as any).role === 'STAFF') && (
          <div className="mt-8 text-center">
            <Link href="/admin" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
              Database Administration Panel →
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}