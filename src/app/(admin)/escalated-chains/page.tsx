'use client'
import React, { useEffect, useState } from 'react'
import { fetchEscalatedChains } from '@/services/adminService'
import { EscalatedChain } from '@/types/chains'
import { ArrowRight, ArrowLeft, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'

export default function EscalatedChainsPage() {
  const [escalatedChains, setEscalatedChains] = useState<EscalatedChain[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const data = await fetchEscalatedChains()
        setEscalatedChains(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Error fetching escalated chains:', err)
        setError('Failed to fetch escalated chains')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[50vh]">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Escalated Chains</h1>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
          <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse delay-75"></div>
          <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse delay-150"></div>
        </div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Escalated Chains</h1>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md dark:bg-gray-800 dark:border-red-400">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
            <p className="text-red-600 dark:text-red-400 font-medium">Error: {error}</p>
          </div>
        </div>
      </div>
    )
  }

  return <EscalatedChainsList chains={escalatedChains} />
}

const EscalatedChainsList = ({ chains }: { chains: EscalatedChain[] }) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [expandedEmployees, setExpandedEmployees] = useState<Record<string, boolean>>({})
  const itemsPerPage = 10
  const totalPages = Math.ceil(chains.length / itemsPerPage)
  const currentData = chains.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  )

  // Group chains by employee_id
  const chainsByEmployee = currentData.reduce((acc, chain) => {
    if (!acc[chain.employee_id]) {
      acc[chain.employee_id] = []
    }
    acc[chain.employee_id].push(chain)
    return acc
  }, {} as Record<string, EscalatedChain[]>)

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const toggleEmployeeExpansion = (employeeId: string) => {
    setExpandedEmployees(prev => ({
      ...prev,
      [employeeId]: !prev[employeeId]
    }))
  }

  return (
    <div className="p-4 bg-gradient-to-b from-gray-50 to-white min-h-screen dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-800 dark:text-white flex items-center justify-center">
          <div className="bg-red-50 p-2 rounded-full mr-3 dark:bg-red-900/30">
            <AlertTriangle className="h-7 w-7 text-red-500 dark:text-red-400" />
          </div>
          <span>Escalated Chains</span>
        </h1>

        <div className="grid gap-5">
          {Object.keys(chainsByEmployee).length > 0 ? (
            Object.entries(chainsByEmployee).map(([employeeId, employeeChains]) => (
              <div 
                key={employeeId}
                className="bg-white rounded-lg shadow-md border border-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white overflow-hidden"
              >
                <div className="flex justify-between items-center py-4 px-5 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700">
                  <h2 className="text-xl font-bold text-blue-900 dark:text-blue-300">
                    Employee ID: <span className="ml-2 font-mono">{employeeId}</span>
                  </h2>
                </div>
                
                <div className="p-5">
                  {/* Display chain details with sessions dropdown inside */}
                  {employeeChains[0] && (
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300 text-sm">
                        <p className="flex flex-col">
                          <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Chain ID</span>
                          <span className="font-medium text-gray-900 dark:text-white font-mono">{employeeChains[0].chain_id}</span>
                        </p>
                        <p className="flex flex-col">
                          <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Escalation Reason</span>
                          <span className="font-medium text-red-600 dark:text-red-400">{employeeChains[0].escalation_reason}</span>
                        </p>
                        <p className="flex flex-col md:col-span-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Escalated At</span>
                          <span className="font-medium text-gray-900 dark:text-white">{formatDate(employeeChains[0].escalated_at)}</span>
                        </p>
                      </div>
                      
                      {/* Sessions dropdown inside chain card */}
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <h3 className="text-sm font-semibold mr-2 text-gray-800 dark:text-white">Sessions</h3>
                            <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 py-0.5 px-2 rounded-full font-medium">
                              {employeeChains.reduce((total, chain) => total + chain.session_ids.length, 0)}
                            </span>
                          </div>
                          <button 
                            onClick={() => toggleEmployeeExpansion(employeeId)}
                            className="flex items-center justify-center w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-gray-600 transition-colors duration-200"
                            aria-label={expandedEmployees[employeeId] ? "Collapse sessions" : "Expand sessions"}
                          >
                            {expandedEmployees[employeeId] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                        </div>
                        
                        <div className={`transition-all duration-300 ${expandedEmployees[employeeId] ? "opacity-100 max-h-72 overflow-y-auto" : "opacity-0 max-h-0 overflow-hidden"}`}>
                          {expandedEmployees[employeeId] && (
                            <div className="grid gap-3">
                              {employeeChains.map((chain) => (
                                <div 
                                  key={chain.chain_id}
                                  className="pl-3 border-l-2 border-red-300 dark:border-red-800/50 py-2"
                                >
                                  {chain.chain_id !== employeeChains[0].chain_id && (
                                    <p className="font-medium text-xs text-gray-500 dark:text-gray-400 mb-2">
                                      Chain: <span className="font-mono text-gray-700 dark:text-gray-300">{chain.chain_id}</span>
                                    </p>
                                  )}
                                  <div className="space-y-2">
                                    {chain.session_ids.map((sessionId) => (
                                      <div key={sessionId} className="group">
                                        <Link 
                                          href={`/sessions/${sessionId}`}
                                          className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 text-xs"
                                        >
                                          <span className="inline-block w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full mr-1.5 group-hover:animate-pulse"></span>
                                          <span className="font-mono group-hover:underline">{sessionId}</span>
                                        </Link>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-5 text-center">
              <div className="flex justify-center mb-3">
                <AlertTriangle className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-gray-500 text-base dark:text-gray-400 font-medium">
                No escalated chains found.
              </p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
              className={`flex items-center justify-center w-9 h-9 rounded-lg text-white transition-all duration-200 ${
                currentPage === 0
                  ? 'bg-gray-300 cursor-not-allowed dark:bg-gray-700'
                  : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600'
              }`}
            >
              <ArrowLeft size={16} />
            </button>
            <div className="px-4 py-1.5 mx-3 rounded-md bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Page {currentPage + 1} of {totalPages}
              </span>
            </div>
            <button
              onClick={() =>
                setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))
              }
              disabled={currentPage === totalPages - 1}
              className={`flex items-center justify-center w-9 h-9 rounded-lg text-white transition-all duration-200 ${
                currentPage === totalPages - 1
                  ? 'bg-gray-300 cursor-not-allowed dark:bg-gray-700'
                  : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600'
              }`}
            >
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 