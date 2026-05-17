'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function AdminPage() {
  const { data: session } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{type: 'success' | 'error', msg: string} | null>(null);

  // @ts-ignore
  if (!session || (session.user as any).role !== 'BACK_OFFICE' && (session.user as any).role !== 'STAFF') {
      return (
          <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
              <div className="bg-white p-8 rounded-xl shadow text-center">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h2 className="text-xl font-bold">Access Denied</h2>
                  <p className="text-gray-500 mt-2">You do not have permission to access the admin area.</p>
                  <Link href="/" className="mt-4 inline-block text-blue-600">Return to Dashboard</Link>
              </div>
          </div>
      );
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setStatus(null);

    const formData = new FormData();
    formData.append('dbFile', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (res.ok) {
        setStatus({ type: 'success', msg: data.message });
      } else {
        setStatus({ type: 'error', msg: data.error || 'Upload failed' });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: 'Network error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/" className="p-2 hover:bg-gray-200 rounded-full transition"><ArrowLeft className="w-6 h-6" /></Link>
          <h1 className="text-3xl font-bold text-gray-900">Administration</h1>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Database Synchronization</h2>
          <p className="text-gray-600 mb-6">
            Upload the latest <code className="bg-gray-100 px-1 rounded">studentsBE.mdb</code> file from the legacy system. The server will automatically extract and migrate the new records into the web application.
          </p>

          <form onSubmit={handleUpload} className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition cursor-pointer relative">
               <input 
                 type="file" 
                 accept=".mdb"
                 onChange={(e) => setFile(e.target.files?.[0] || null)}
                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
               />
               <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
               <p className="text-sm text-gray-600">
                 {file ? <span className="font-semibold text-blue-600">{file.name}</span> : 'Click or drag studentsBE.mdb here'}
               </p>
            </div>

            {status && (
                <div className={`p-4 rounded-md flex items-center ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {status.type === 'success' ? <CheckCircle className="w-5 h-5 mr-2" /> : <AlertCircle className="w-5 h-5 mr-2" />}
                    {status.msg}
                </div>
            )}

            <button 
              type="submit" 
              disabled={!file || loading}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Processing Migration...' : 'Upload and Sync Database'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}