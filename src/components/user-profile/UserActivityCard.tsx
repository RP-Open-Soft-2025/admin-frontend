'use client'
import React from 'react'
import { Activity } from '@/types/employee'

// Dummy data for development
const dummyActivityData: Activity[] = [
  {
    date: '2023-01-15',
    teamsMessagesSent: 45,
    emailsSent: 23,
    meetingsAttended: 5,
    workHours: 8.5
  },
  {
    date: '2023-01-16',
    teamsMessagesSent: 32,
    emailsSent: 18,
    meetingsAttended: 3,
    workHours: 9
  },
  {
    date: '2023-01-17',
    teamsMessagesSent: 51,
    emailsSent: 27,
    meetingsAttended: 4,
    workHours: 8
  },
  {
    date: '2023-01-18',
    teamsMessagesSent: 38,
    emailsSent: 15,
    meetingsAttended: 6,
    workHours: 8.5
  },
  {
    date: '2023-01-19',
    teamsMessagesSent: 42,
    emailsSent: 22,
    meetingsAttended: 2,
    workHours: 7.5
  }
]

export default function UserActivityCard() {
  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Recent Activity
          </h4>
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    Teams Messages
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    Emails Sent
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    Meetings Attended
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    Work Hours
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                {dummyActivityData.map((activity, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white/90">
                      {new Date(activity.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white/90">
                      {activity.teamsMessagesSent}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white/90">
                      {activity.emailsSent}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white/90">
                      {activity.meetingsAttended}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white/90">
                      {activity.workHours}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6">
            <h5 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              Activity Overview
            </h5>
            <div className="flex h-10 items-end space-x-2">
              {dummyActivityData.map((activity, index) => (
                <div key={index} className="relative flex flex-col items-center">
                  <div 
                    className="w-8 bg-blue-500 dark:bg-blue-600 rounded-t-sm"
                    style={{ height: `${activity.teamsMessagesSent / 2}px` }}
                  ></div>
                  <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {new Date(activity.date).getDate()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 