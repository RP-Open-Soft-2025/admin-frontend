'use client'
import React, { useState } from 'react'
import { moodScoreHistory, engagementHistory } from '@/data/wellbeingData'
import dynamic from 'next/dynamic'
import { ApexOptions } from 'apexcharts'

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

const WellbeingTrends: React.FC = () => {
  const [chartType, setChartType] = useState<'mood' | 'engagement' | 'combined'>('combined')
  
  // Combined chart options
  const options: ApexOptions = {
    chart: {
      fontFamily: 'Outfit, sans-serif',
      height: 350,
      type: 'line',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      dropShadow: {
        enabled: true,
        top: 5,
        left: 0,
        blur: 4,
        opacity: 0.1,
      }
    },
    stroke: {
      width: [3, 3],
      curve: 'smooth',
      dashArray: [0, 0]
    },
    legend: {
      show: true, 
      position: 'top',
      horizontalAlign: 'left',
      fontSize: '14px',
      fontWeight: 500,
      offsetY: 10,
      itemMargin: {
        horizontal: 10,
        vertical: 0
      },
      markers: {
        width: 12,
        height: 12,
        radius: 12,
        offsetX: -3,
      },
    },
    markers: {
      size: 4,
      colors: ['#4F46E5', '#10B981'],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 7,
      }
    },
    colors: ['#4F46E5', '#10B981'],
    grid: {
      borderColor: '#e0e0e0',
      row: {
        colors: ['transparent', 'transparent'],
        opacity: 0.5
      },
    },
    xaxis: {
      categories: moodScoreHistory.map(item => item.month),
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '12px',
          fontWeight: 400,
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 5,
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '12px',
          fontWeight: 400,
        },
        formatter: function(val) {
          return val.toFixed(0);
        }
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function(y) {
          if (typeof y !== "undefined") {
            return y.toFixed(0) + "%";
          }
          return y;
        }
      }
    },
    fill: {
      type: ['gradient', 'gradient'],
      gradient: {
        shade: 'light',
        type: "vertical",
        shadeIntensity: 0.25,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 0.85,
        opacityTo: 0.35,
        stops: [0, 100]
      }
    },
  };

  // Define series based on selected chart type
  const getSeries = () => {
    if (chartType === 'mood') {
      return [
        {
          name: 'Mood Score',
          data: moodScoreHistory.map(item => item.score)
        }
      ]
    } else if (chartType === 'engagement') {
      return [
        {
          name: 'Engagement Rate',
          data: engagementHistory.map(item => item.rate)
        }
      ]
    } else {
      return [
        {
          name: 'Mood Score',
          data: moodScoreHistory.map(item => item.score)
        },
        {
          name: 'Engagement Rate',
          data: engagementHistory.map(item => item.rate)
        }
      ]
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">Wellbeing Trends</h3>
          <p className="mt-1 text-gray-500 text-sm dark:text-gray-400">
            12-month mood and engagement trends
          </p>
        </div>
        
        <div className="inline-flex rounded-md shadow-sm">
          <button
            type="button"
            onClick={() => setChartType('mood')}
            className={`relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-medium ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10 dark:ring-gray-700 ${
              chartType === 'mood' 
                ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400' 
                : 'bg-white text-gray-700 dark:bg-white/[0.03] dark:text-gray-300'
            }`}
          >
            Mood
          </button>
          <button
            type="button"
            onClick={() => setChartType('engagement')}
            className={`relative -ml-px inline-flex items-center px-3 py-2 text-sm font-medium ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10 dark:ring-gray-700 ${
              chartType === 'engagement' 
                ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400' 
                : 'bg-white text-gray-700 dark:bg-white/[0.03] dark:text-gray-300'
            }`}
          >
            Engagement
          </button>
          <button
            type="button"
            onClick={() => setChartType('combined')}
            className={`relative -ml-px inline-flex items-center rounded-r-md px-3 py-2 text-sm font-medium ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10 dark:ring-gray-700 ${
              chartType === 'combined' 
                ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400' 
                : 'bg-white text-gray-700 dark:bg-white/[0.03] dark:text-gray-300'
            }`}
          >
            Combined
          </button>
        </div>
      </div>

      <div className="h-80">
        {typeof window !== 'undefined' && (
          <ReactApexChart
            options={options}
            series={getSeries()}
            type="line"
            height={350}
          />
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
        <div className="rounded-lg bg-indigo-50 p-4 dark:bg-indigo-900/20">
          <p className="text-sm font-medium text-indigo-800 dark:text-indigo-300">Current Mood Score</p>
          <p className="mt-2 text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
            {moodScoreHistory[moodScoreHistory.length - 1].score}%
          </p>
          <p className="mt-1 text-xs text-indigo-500 dark:text-indigo-300">
            {moodScoreHistory[moodScoreHistory.length - 1].score > moodScoreHistory[moodScoreHistory.length - 2].score
              ? `↑ ${moodScoreHistory[moodScoreHistory.length - 1].score - moodScoreHistory[moodScoreHistory.length - 2].score}% from last month`
              : `↓ ${moodScoreHistory[moodScoreHistory.length - 2].score - moodScoreHistory[moodScoreHistory.length - 1].score}% from last month`
            }
          </p>
        </div>
        <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
          <p className="text-sm font-medium text-green-800 dark:text-green-300">Current Engagement</p>
          <p className="mt-2 text-2xl font-semibold text-green-600 dark:text-green-400">
            {engagementHistory[engagementHistory.length - 1].rate}%
          </p>
          <p className="mt-1 text-xs text-green-500 dark:text-green-300">
            {engagementHistory[engagementHistory.length - 1].rate > engagementHistory[engagementHistory.length - 2].rate
              ? `↑ ${engagementHistory[engagementHistory.length - 1].rate - engagementHistory[engagementHistory.length - 2].rate}% from last month`
              : `↓ ${engagementHistory[engagementHistory.length - 2].rate - engagementHistory[engagementHistory.length - 1].rate}% from last month`
            }
          </p>
        </div>
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/30">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Highest Mood Score</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
            {Math.max(...moodScoreHistory.map(item => item.score))}%
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {moodScoreHistory.find(item => item.score === Math.max(...moodScoreHistory.map(i => i.score)))?.month}
          </p>
        </div>
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/30">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Lowest Mood Score</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
            {Math.min(...moodScoreHistory.map(item => item.score))}%
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {moodScoreHistory.find(item => item.score === Math.min(...moodScoreHistory.map(i => i.score)))?.month}
          </p>
        </div>
      </div>
    </div>
  )
}

export default WellbeingTrends 