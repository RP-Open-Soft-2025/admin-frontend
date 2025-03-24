'use client'
import React from 'react'
import { VibeMeter, EmotionZone } from '@/types/employee'

// Dummy data for development
const dummyVibeMeterData: VibeMeter[] = [
  {
    responseDate: '2023-01-05',
    vibeScore: 85,
    emotionZone: EmotionZone.HAPPY
  },
  {
    responseDate: '2023-01-12',
    vibeScore: 72,
    emotionZone: EmotionZone.LEANING_HAPPY
  },
  {
    responseDate: '2023-01-19',
    vibeScore: 67,
    emotionZone: EmotionZone.LEANING_HAPPY
  },
  {
    responseDate: '2023-01-26',
    vibeScore: 55,
    emotionZone: EmotionZone.NEUTRAL
  },
  {
    responseDate: '2023-02-02',
    vibeScore: 45,
    emotionZone: EmotionZone.NEUTRAL
  },
  {
    responseDate: '2023-02-09',
    vibeScore: 38,
    emotionZone: EmotionZone.LEANING_SAD
  },
  {
    responseDate: '2023-02-16',
    vibeScore: 60,
    emotionZone: EmotionZone.NEUTRAL
  },
  {
    responseDate: '2023-02-23',
    vibeScore: 78,
    emotionZone: EmotionZone.LEANING_HAPPY
  },
  {
    responseDate: '2023-03-02',
    vibeScore: 92,
    emotionZone: EmotionZone.EXCITED
  }
]

// Get most recent vibe data
const latestVibe = dummyVibeMeterData[dummyVibeMeterData.length - 1]

// Helper function to get emotion color
const getEmotionColor = (emotionZone: EmotionZone) => {
  switch(emotionZone) {
    case EmotionZone.EXCITED:
      return 'text-purple-600 dark:text-purple-400'
    case EmotionZone.HAPPY:
      return 'text-green-600 dark:text-green-400'
    case EmotionZone.LEANING_HAPPY:
      return 'text-teal-600 dark:text-teal-400'
    case EmotionZone.NEUTRAL:
      return 'text-blue-600 dark:text-blue-400'
    case EmotionZone.LEANING_SAD:
      return 'text-yellow-600 dark:text-yellow-400'
    case EmotionZone.SAD:
      return 'text-orange-600 dark:text-orange-400'
    case EmotionZone.FRUSTRATED:
      return 'text-red-600 dark:text-red-400'
    default:
      return 'text-gray-600 dark:text-gray-400'
  }
}

// Helper function to get background color
const getEmotionBgColor = (emotionZone: EmotionZone) => {
  switch(emotionZone) {
    case EmotionZone.EXCITED:
      return 'bg-purple-500'
    case EmotionZone.HAPPY:
      return 'bg-green-500'
    case EmotionZone.LEANING_HAPPY:
      return 'bg-teal-500'
    case EmotionZone.NEUTRAL:
      return 'bg-blue-500'
    case EmotionZone.LEANING_SAD:
      return 'bg-yellow-500'
    case EmotionZone.SAD:
      return 'bg-orange-500'
    case EmotionZone.FRUSTRATED:
      return 'bg-red-500'
    default:
      return 'bg-gray-500'
  }
}

export default function UserVibeMeterCard() {
  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Employee Mood & Wellbeing
          </h4>
          
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">Current Mood</p>
              <p className={`mt-1 text-xl font-semibold ${getEmotionColor(latestVibe.emotionZone)}`}>
                {latestVibe.emotionZone}
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Last updated: {new Date(latestVibe.responseDate).toLocaleDateString()}
              </p>
            </div>
            
            <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">Vibe Score</p>
              <div className="flex items-end">
                <p className="text-3xl font-bold text-gray-800 dark:text-white">{latestVibe.vibeScore}</p>
                <p className="ml-1 mb-1 text-sm text-gray-500 dark:text-gray-400">/100</p>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                <div 
                  className={`h-2 rounded-full ${getEmotionBgColor(latestVibe.emotionZone)}`}
                  style={{ width: `${latestVibe.vibeScore}%` }}
                ></div>
              </div>
            </div>
            
            <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">Mood Trend</p>
              <p className="mt-1 text-base font-medium text-gray-800 dark:text-white/90">
                {latestVibe.vibeScore > dummyVibeMeterData[dummyVibeMeterData.length - 2].vibeScore ? 'Improving' : 'Declining'}
              </p>
              <div className="mt-2 flex items-center">
                {latestVibe.vibeScore > dummyVibeMeterData[dummyVibeMeterData.length - 2].vibeScore ? (
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12 7a1 1 0 01-1 1H9a1 1 0 01-1-1V6a1 1 0 011-1h2a1 1 0 011 1v1zm-6 6a1 1 0 001 1h2a1 1 0 001-1v-1a1 1 0 00-1-1H7a1 1 0 00-1 1v1zm8 0a1 1 0 001 1h2a1 1 0 001-1v-1a1 1 0 00-1-1h-2a1 1 0 00-1 1v1zm-8-4a1 1 0 001 1h2a1 1 0 001-1v-1a1 1 0 00-1-1H7a1 1 0 00-1 1v1zm8 0a1 1 0 001 1h2a1 1 0 001-1v-1a1 1 0 00-1-1h-2a1 1 0 00-1 1v1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12 13a1 1 0 01-1 1H9a1 1 0 01-1-1v-1a1 1 0 011-1h2a1 1 0 011 1v1zm-6-6a1 1 0 001 1h2a1 1 0 001-1V6a1 1 0 00-1-1H7a1 1 0 00-1 1v1zm8 0a1 1 0 001 1h2a1 1 0 001-1V6a1 1 0 00-1-1h-2a1 1 0 00-1 1v1zm-8 4a1 1 0 001 1h2a1 1 0 001-1v-1a1 1 0 00-1-1H7a1 1 0 00-1 1v1zm8 0a1 1 0 001 1h2a1 1 0 001-1v-1a1 1 0 00-1-1h-2a1 1 0 00-1 1v1z" clipRule="evenodd" />
                  </svg>
                )}
                <span className={`ml-1 text-sm ${
                  latestVibe.vibeScore > dummyVibeMeterData[dummyVibeMeterData.length - 2].vibeScore 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {Math.abs(latestVibe.vibeScore - dummyVibeMeterData[dummyVibeMeterData.length - 2].vibeScore)}%
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h5 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              Mood History
            </h5>
            <div className="mt-4 flex h-40 items-end space-x-2">
              {dummyVibeMeterData.map((vibe, index) => (
                <div key={index} className="flex flex-1 flex-col items-center">
                  <div 
                    className={`w-full rounded-t-sm ${getEmotionBgColor(vibe.emotionZone)}`}
                    style={{ height: `${vibe.vibeScore * 0.35}px` }} // Scale to fit in container
                  ></div>
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {new Date(vibe.responseDate).getDate()}/{new Date(vibe.responseDate).getMonth() + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8">
            <h5 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              Emotion Zones Legend
            </h5>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
              {Object.values(EmotionZone).map((zone, index) => (
                <div key={index} className="flex items-center">
                  <div className={`h-3 w-3 rounded-full ${getEmotionBgColor(zone as EmotionZone)}`}></div>
                  <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">{zone}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 