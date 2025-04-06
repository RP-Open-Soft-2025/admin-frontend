'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import store from '@/redux/store'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeft, FileText } from 'lucide-react'
import Link from 'next/link'

// Add custom styles for markdown content
const markdownStyles = `
.markdown-content {
  font-size: 1rem;
  line-height: 1.75;
}

.markdown-content h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.5rem;
}

.markdown-content h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.markdown-content h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1.25rem;
  margin-bottom: 0.75rem;
}

.markdown-content p {
  margin-bottom: 1rem;
}

.markdown-content a {
  color: #3b82f6;
  text-decoration: underline;
}

.markdown-content a:hover {
  color: #2563eb;
}

.markdown-content ul, .markdown-content ol {
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

.markdown-content ul {
  list-style-type: disc;
}

.markdown-content ol {
  list-style-type: decimal;
}

.markdown-content li {
  margin-bottom: 0.5rem;
}

.markdown-content blockquote {
  border-left: 4px solid #e2e8f0;
  padding-left: 1rem;
  font-style: italic;
  margin-bottom: 1rem;
  color: #64748b;
}

.markdown-content code {
  font-family: monospace;
  background-color: #f1f5f9;
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.markdown-content pre {
  background-color: #1e293b;
  color: #f8fafc;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.markdown-content pre code {
  background-color: transparent;
  padding: 0;
  font-size: 0.875rem;
  color: inherit;
}

.markdown-content table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.markdown-content th {
  background-color: #f1f5f9;
  font-weight: 600;
  text-align: left;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
}

.markdown-content td {
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
}

.markdown-content tr:nth-child(even) {
  background-color: #f8fafc;
}

.dark .markdown-content code {
  background-color: #334155;
  color: #f1f5f9;
}

.dark .markdown-content pre {
  background-color: #0f172a;
}

.dark .markdown-content th {
  background-color: #1e293b;
  border-color: #334155;
}

.dark .markdown-content td {
  border-color: #334155;
}

.dark .markdown-content tr:nth-child(even) {
  background-color: #1e293b;
}

.dark .markdown-content blockquote {
  border-color: #334155;
  color: #94a3b8;
}
`

const ReportPage = () => {
	const params = useParams()
	const id = params.id as string
	const [report, setReport] = useState<string>('')
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const { auth } = store.getState()

	useEffect(() => {
		const fetchReport = async () => {
			if (!id) return

			try {
				setLoading(true)

				const response = await fetch(
					`https://storage.googleapis.com/opensoft-reports/${id}.md`,
					{
						method: 'GET',
					}
				)

				if (!response.ok) {
					throw new Error(`Error: ${response.status}`)
				}

				const data = await response.text()

				// Set report with text content only
				setReport(data)
				setLoading(false)
			} catch (err) {
				console.error('Error fetching report:', err)
				setError('Failed to load report data')
				setLoading(false)
			}
		}

		fetchReport()
	}, [id, auth.user?.accessToken])

	if (loading) {
		return (
			<div className="container mx-auto py-8 px-4">
				<div className="mb-6">
					<Link
						href="/dashboard"
						className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-4"
					>
						<ChevronLeft className="h-4 w-4 mr-1" />
						Back to Dashboard
					</Link>
					<Skeleton className="h-10 w-3/4 mb-4" />
					<div className="flex flex-wrap gap-4 mb-6">
						<Skeleton className="h-6 w-40" />
						<Skeleton className="h-6 w-40" />
					</div>
				</div>
				<Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
					<CardHeader className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
						<Skeleton className="h-8 w-60" />
					</CardHeader>
					<CardContent className="p-6">
						<div className="space-y-4">
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-3/4" />
							<Skeleton className="h-4 w-5/6" />
							<Skeleton className="h-4 w-full" />
						</div>
					</CardContent>
				</Card>
			</div>
		)
	}

	if (error) {
		return (
			<div className="container mx-auto py-8 px-4">
				<div className="mb-6">
					<Link
						href="/"
						className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-4"
					>
						<ChevronLeft className="h-4 w-4 mr-1" />
						Back to Dashboard
					</Link>
				</div>
				<Card className="border border-red-200 dark:border-red-800 shadow-sm">
					<CardContent className="p-6">
						<div className="text-center text-red-500 dark:text-red-400 py-8">
							<div className="text-lg font-medium mb-2">
								Failed to load report
							</div>
							<p>{error}</p>
						</div>
					</CardContent>
				</Card>
			</div>
		)
	}

	if (!report) {
		return (
			<div className="container mx-auto py-8 px-4">
				<div className="mb-6">
					<Link
						href="/"
						className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-4"
					>
						<ChevronLeft className="h-4 w-4 mr-1" />
						Back to Dashboard
					</Link>
				</div>
				<Card className="border border-yellow-200 dark:border-yellow-800 shadow-sm">
					<CardContent className="p-6">
						<div className="text-center text-yellow-600 dark:text-yellow-400 py-8">
							<div className="text-lg font-medium mb-2">
								No report data available
							</div>
							<p>The report for this session could not be found.</p>
						</div>
					</CardContent>
				</Card>
			</div>
		)
	}

	return (
		<div className="container mx-auto py-8 px-4">
			<style jsx global>
				{markdownStyles}
			</style>
			<div className="mb-6">
				<Link
					href="/"
					className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-4"
				>
					<ChevronLeft className="h-4 w-4 mr-1" />
					Back to Dashboard
				</Link>
				<h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
					Session Report
				</h1>
				<div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600 dark:text-gray-400">
					<div className="flex items-center">
						<FileText className="h-4 w-4 mr-2" />
						<span>Session ID: {id}</span>
					</div>
				</div>
			</div>

			<Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
				<CardHeader className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
					<CardTitle className="text-lg font-medium text-gray-900 dark:text-white">
						Session Summary
					</CardTitle>
				</CardHeader>
				<CardContent className="p-6">
					<div className="prose prose-blue dark:prose-invert max-w-none">
						{report ? (
							<div className="markdown-content">
								<ReactMarkdown
									remarkPlugins={[remarkGfm]}
									rehypePlugins={[rehypeRaw, rehypeSanitize]}
								>
									{report}
								</ReactMarkdown>
							</div>
						) : (
							<p className="text-gray-600 dark:text-gray-400 italic">
								No content available for this report.
							</p>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

export default ReportPage
