import React from 'react'
import OverallMoodScore from '@/components/wellbeing/OverallMoodScore'
import EngagementRate from '@/components/wellbeing/EngagementRate'
import RiskAssessment from '@/components/wellbeing/RiskAssessment'
import PriorityEmployees from '@/components/wellbeing/PriorityEmployees'
import DepartmentHeatmap from '@/components/wellbeing/DepartmentHeatmap'
import EmployeeMeetings from '@/components/wellbeing/EmployeeMeetings'
import WellbeingTrends from '@/components/wellbeing/WellbeingTrends'

function EmployeeWellbeing() {
	return (
		<div className="grid grid-cols-12 gap-4 md:gap-6">
			<div className="col-span-12 space-y-6 xl:col-span-8">
				<OverallMoodScore />
				<WellbeingTrends />
			</div>

			<div className="col-span-12 xl:col-span-4">
				<EngagementRate />
				<div className="mt-6">
					<RiskAssessment />
				</div>
			</div>

			<div className="col-span-12 xl:col-span-6">
				<PriorityEmployees />
			</div>

			<div className="col-span-12 xl:col-span-6">
				<DepartmentHeatmap />
			</div>

			<div className="col-span-12">
				<EmployeeMeetings />
			</div>
		</div>
	)
}

export default EmployeeWellbeing
