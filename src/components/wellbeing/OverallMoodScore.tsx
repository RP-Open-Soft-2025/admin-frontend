'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { ApexOptions } from 'apexcharts'
import { calculateOverallMetrics } from '@/data/wellbeingData'
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/solid'

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

const OverallMoodScore: React.FC = () => {
  const metrics = calculateOverallMetrics()
  const [prevScore, setPrevScore] = useState(metrics.avgMoodScore - 2) // For demo purposes

  // Gauge chart options
  const options: ApexOptions = {
    chart: {
      fontFamily: 'Outfit, sans-serif',
      height: 350,
      type: 'radialBar',
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        hollow: {
          margin: 0,
          size: '70%',
          background: 'transparent',
        },
        track: {
          background: '#e7e7e7',
          strokeWidth: '97%',
          margin: 5,
          dropShadow: {
            enabled: false,
          }
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            offsetY: -2,
            fontSize: '22px',
            fontWeight: 600,
            formatter: function (val) {
              return val + '/100';
            }
          }
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: ['#ABE5A1'],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    },
    stroke: {
      dashArray: 4
    },
    colors: ['#FF5B5B'],
  };

  // Determine the color based on the score
  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    if (score >= 25) return 'text-orange-500';
    return 'text-red-500';
  };

  // Series data
  const series = [metrics.avgMoodScore];

  // Calculate trend percentage
  const trendPercentage = Math.round(((metrics.avgMoodScore - prevScore) / prevScore) * 100);
  const isPositiveTrend = trendPercentage >= 0;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">Overall Mood Score</h3>
          <p className="mt-1 text-gray-500 text-sm dark:text-gray-400">
            Average employee wellbeing based on Vibemeter data
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-lg font-medium ${isPositiveTrend ? 'text-green-500' : 'text-red-500'}`}>
            {isPositiveTrend ? '+' : ''}{trendPercentage}%
          </span>
          {isPositiveTrend ? (
            <ArrowUpIcon className="h-5 w-5 text-green-500" />
          ) : (
            <ArrowDownIcon className="h-5 w-5 text-red-500" />
          )}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center">
        <div className="h-64 w-full">
          {typeof window !== 'undefined' && (
            <ReactApexChart
              options={options}
              series={series}
              type="radialBar"
              height={350}
            />
          )}
        </div>
      </div>

      <div className="mt-4 flex justify-between">
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Critical Risk</p>
          <p className="mt-1 text-xl font-medium text-red-500">{metrics.criticalRiskCount}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">High Risk</p>
          <p className="mt-1 text-xl font-medium text-orange-500">{metrics.highRiskCount}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">At Risk</p>
          <p className="mt-1 text-xl font-medium text-yellow-500">{metrics.atRiskPercentage}%</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
          <p className="mt-1 text-xl font-medium text-blue-500">{metrics.totalEmployees}</p>
        </div>
      </div>
    </div>
  )
}

export default OverallMoodScore 