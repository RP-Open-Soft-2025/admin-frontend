'use client'
import React from 'react'
import { Leave, LeaveType } from '@/types/employee'

// Dummy data for development
const dummyLeaveData: Leave[] = [
  {
    leaveType: LeaveType.ANNUAL,
    leaveDays: 5,
    leaveStartDate: '2023-05-10',
    leaveEndDate: '2023-05-15'
  },
  {
    leaveType: LeaveType.SICK,
    leaveDays: 2,
    leaveStartDate: '2023-07-20',
    leaveEndDate: '2023-07-22'
  },
  {
    leaveType: LeaveType.CASUAL,
    leaveDays: 1,
    leaveStartDate: '2023-09-05',
    leaveEndDate: '2023-09-06'
  },
  {
    leaveType: LeaveType.UNPAID,
    leaveDays: 3,
    leaveStartDate: '2023-11-15',
    leaveEndDate: '2023-11-18'
  }
]

// Calculate leave stats for the visualization
const calculateLeaveStats = () => {
  const stats = {
    annual: 0,
    sick: 0,
    casual: 0,
    unpaid: 0,
    total: 0
  }

  dummyLeaveData.forEach(leave => {
    switch (leave.leaveType) {
      case LeaveType.ANNUAL:
        stats.annual += leave.leaveDays
        break
      case LeaveType.SICK:
        stats.sick += leave.leaveDays
        break
      case LeaveType.CASUAL:
        stats.casual += leave.leaveDays
        break
      case LeaveType.UNPAID:
        stats.unpaid += leave.leaveDays
        break
    }
    stats.total += leave.leaveDays
  })

  return stats
}

const leaveStats = calculateLeaveStats()

export default function UserLeaveCard() {
  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Leave History
          </h4>
          
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">Annual Leave</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">{leaveStats.annual} days</p>
              <div className="mt-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                <div 
                  className="h-2 rounded-full bg-green-500"
                  style={{ width: `${(leaveStats.annual / leaveStats.total) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">Sick Leave</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">{leaveStats.sick} days</p>
              <div className="mt-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                <div 
                  className="h-2 rounded-full bg-red-500"
                  style={{ width: `${(leaveStats.sick / leaveStats.total) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">Casual Leave</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">{leaveStats.casual} days</p>
              <div className="mt-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                <div 
                  className="h-2 rounded-full bg-blue-500"
                  style={{ width: `${(leaveStats.casual / leaveStats.total) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">Unpaid Leave</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">{leaveStats.unpaid} days</p>
              <div className="mt-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                <div 
                  className="h-2 rounded-full bg-yellow-500"
                  style={{ width: `${(leaveStats.unpaid / leaveStats.total) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    Leave Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    Duration
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    Start Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    End Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                {dummyLeaveData.map((leave, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5
                        ${leave.leaveType === LeaveType.ANNUAL ? 'bg-green-100 text-green-800' :
                          leave.leaveType === LeaveType.SICK ? 'bg-red-100 text-red-800' :
                          leave.leaveType === LeaveType.CASUAL ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'}`}
                      >
                        {leave.leaveType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white/90">
                      {leave.leaveDays} {leave.leaveDays > 1 ? 'days' : 'day'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white/90">
                      {new Date(leave.leaveStartDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white/90">
                      {new Date(leave.leaveEndDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
} 