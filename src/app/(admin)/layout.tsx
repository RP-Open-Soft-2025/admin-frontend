'use client'

import { useSidebar } from '@/components/context/SidebarContext'
import Backdrop from '@/components/layout/Backdrop'
import AppSidebar from '@/components/layout/AppSidebar'
import AppHeader from '@/components/layout/AppHeader'
import React from 'react'
import type { Metadata } from 'next'
import { EcommerceMetrics } from '@/components/ecommerce/EcommerceMetrics'
import MonthlyTarget from '@/components/ecommerce/MonthlyTarget'
import MonthlySalesChart from '@/components/ecommerce/MonthlySalesChart'
import StatisticsChart from '@/components/ecommerce/StatisticsChart'
import RecentOrders from '@/components/ecommerce/RecentOrders'
import DemographicCard from '@/components/ecommerce/DemographicCard'

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const { isExpanded, isHovered, isMobileOpen } = useSidebar()

	// Dynamic class for main content margin based on sidebar state
	const mainContentMargin = isMobileOpen
		? 'ml-0'
		: isExpanded || isHovered
			? 'lg:ml-[290px]'
			: 'lg:ml-[90px]'

	return (
		<div className="min-h-screen xl:flex">
			{/* Sidebar and Backdrop */}
			<AppSidebar />
			<Backdrop />
			{/* Main Content Area */}
			<div
				className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
			>
				{/* Header */}
				<AppHeader />
				{/* Page Content */}
				<div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
					{children}
				</div>
			</div>
		</div>
	)
}
