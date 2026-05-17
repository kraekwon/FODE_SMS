'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { StudentReport } from '@/components/ReportTemplate';

export default function ReportsPage() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  useEffect(() => {
    fetch('/api/students?take=10')
      .then(res => res.json())
      .then(data => setStudents(data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/" className="p-2 hover:bg-gray-200 rounded-full transition"><ArrowLeft className="w-6 h-6" /></Link>
          <h1 className="text-3xl font-bold text-gray-900">Report Designer</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Select Student for Report</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {students.map((s: any) => (
                <button key={s.stdID} onClick={() => setSelectedStudent(s)} className={`w-full text-left px-4 py-3 rounded-lg border ${selectedStudent?.stdID === s.stdID ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50 border-transparent'}`}>
                  <div className="font-medium text-gray-900">{s.Fname} {s.Lname}</div>
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center min-h-[400px]">
             {selectedStudent ? (
                <div className="text-center space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Ready to Generate</h3>
                    <p className="text-gray-500 mt-1">Report for {selectedStudent.Fname}</p>
                  </div>
                  {typeof window !== 'undefined' && (
                    <PDFDownloadLink document={<StudentReport student={selectedStudent} />} fileName={`Student_${selectedStudent.stdID}.pdf`} className="inline-flex px-6 py-3 border text-white bg-blue-600 rounded-md">
                      {({ loading }: any) => loading ? 'Generating PDF...' : 'Download PDF Report'}
                    </PDFDownloadLink>
                  )}
                </div>
             ) : (<p className="text-gray-400">Select a student</p>)}
          </div>
        </div>
      </div>
    </div>
  );
}