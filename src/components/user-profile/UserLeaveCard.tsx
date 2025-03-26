'use client'
import React from 'react'
import { LeaveRequest } from '@/types/employee'

// Props interface
interface UserLeaveCardProps {
  leaveData?: {
    usedLeave: number;
    totalLeave: number;
    requests: LeaveRequest[];
  };
}

// Dummy data for development
const dummyLeaveData = {
  usedLeave: 12,
  totalLeave: 30,
  requests: [
    {
      id: 'leave1',
      type: 'Vacation',
      startDate: '2023-06-10',
      endDate: '2023-06-15',
      status: 'Approved',
      requestDate: '2023-05-15'
    },
    {
      id: 'leave2',
      type: 'Sick Leave',
      startDate: '2023-03-22',
      endDate: '2023-03-23',
      status: 'Approved',
      requestDate: '2023-03-21'
    },
    {
      id: 'leave3',
      type: 'Personal',
      startDate: '2023-07-05',
      endDate: '2023-07-07',
      status: 'Pending',
      requestDate: '2023-06-20'
    }
  ]
}

// Helper function to format dates consistently
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB'); // Use consistent locale (DD/MM/YYYY)
}

export default function UserLeaveCard({ leaveData }: UserLeaveCardProps) {
  // Use provided data or fall back to dummy data
  const displayData = leaveData || dummyLeaveData;
  
  // Calculate leave percentages
  const usedPercentage = Math.round((displayData.usedLeave / displayData.totalLeave) * 100);
  const remainingPercentage = 100 - usedPercentage;

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-4">
            Leave Management
          </h4>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Leave Utilization
                </span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {displayData.usedLeave} / {displayData.totalLeave} days
                </span>
              </div>
              <div className="w-full h-2.5 bg-gray-200 rounded-full dark:bg-gray-700">
                <div 
                  className="h-2.5 bg-blue-600 rounded-full" 
                  style={{ width: `${usedPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">Used ({usedPercentage}%)</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Remaining ({remainingPercentage}%)</span>
              </div>
            </div>

            {displayData.requests.length > 0 && (
              <div>
                <h5 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Recent Leave Requests
                </h5>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                          Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                          Duration
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                      {displayData.requests.map((request) => (
                        <tr key={request.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white/90">
                            {request.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white/90">
                            {formatDate(request.startDate)} - {formatDate(request.endDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              request.status === 'Approved' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                                : request.status === 'Pending'
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                            }`}>
                              {request.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 