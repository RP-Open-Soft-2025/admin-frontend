// Types
export type Department =
	| 'Engineering'
	| 'Marketing'
	| 'Sales'
	| 'HR'
	| 'Finance'
	| 'Operations'
	| 'Product'
	| 'Design'
export type Role =
	| 'Manager'
	| 'Director'
	| 'Team Lead'
	| 'Junior'
	| 'Senior'
	| 'Intern'
	| 'VP'
	| 'C-Level'

export interface Employee {
	id: number
	name: string
	department: Department
	role: Role
	vibemeterScore: number // 1-100
	engagementRate: number // 0-100%
	recentTrend: 'up' | 'down' | 'stable'
	riskLevel: 'Low' | 'Medium' | 'High' | 'Critical'
	joinDate: string
	lastActive: string
}

export interface MeetingData {
	id: number
	title: string
	host: string
	attendees: string[]
	dateTime: string
	purpose: string
	priority: 'Low' | 'Medium' | 'High'
}

// Generate risk level based on vibemeter score
export const getRiskLevel = (
	score: number
): 'Low' | 'Medium' | 'High' | 'Critical' => {
	if (score >= 75) return 'Low'
	if (score >= 50) return 'Medium'
	if (score >= 25) return 'High'
	return 'Critical'
}

// Dummy Data
export const employeeData: Employee[] = [
	{
		id: 1,
		name: 'Emma Johnson',
		department: 'Engineering',
		role: 'Team Lead',
		vibemeterScore: 85,
		engagementRate: 92,
		recentTrend: 'up',
		riskLevel: 'Low',
		joinDate: '2021-02-15',
		lastActive: '2023-03-29T09:15:00',
	},
	{
		id: 2,
		name: 'Michael Chen',
		department: 'Marketing',
		role: 'Senior',
		vibemeterScore: 72,
		engagementRate: 78,
		recentTrend: 'stable',
		riskLevel: 'Medium',
		joinDate: '2021-07-03',
		lastActive: '2023-03-28T16:45:00',
	},
	{
		id: 3,
		name: 'Sophia Rodriguez',
		department: 'HR',
		role: 'Director',
		vibemeterScore: 93,
		engagementRate: 95,
		recentTrend: 'up',
		riskLevel: 'Low',
		joinDate: '2019-11-20',
		lastActive: '2023-03-29T11:30:00',
	},
	{
		id: 4,
		name: 'James Wilson',
		department: 'Sales',
		role: 'Junior',
		vibemeterScore: 45,
		engagementRate: 62,
		recentTrend: 'down',
		riskLevel: 'High',
		joinDate: '2022-03-10',
		lastActive: '2023-03-27T14:20:00',
	},
	{
		id: 5,
		name: 'Olivia Thompson',
		department: 'Engineering',
		role: 'Senior',
		vibemeterScore: 79,
		engagementRate: 85,
		recentTrend: 'stable',
		riskLevel: 'Low',
		joinDate: '2020-06-15',
		lastActive: '2023-03-29T10:05:00',
	},
	{
		id: 6,
		name: 'Ethan Davis',
		department: 'Finance',
		role: 'Manager',
		vibemeterScore: 68,
		engagementRate: 75,
		recentTrend: 'down',
		riskLevel: 'Medium',
		joinDate: '2020-10-08',
		lastActive: '2023-03-28T09:50:00',
	},
	{
		id: 7,
		name: 'Ava Martinez',
		department: 'Design',
		role: 'Team Lead',
		vibemeterScore: 88,
		engagementRate: 90,
		recentTrend: 'up',
		riskLevel: 'Low',
		joinDate: '2021-01-12',
		lastActive: '2023-03-29T13:15:00',
	},
	{
		id: 8,
		name: 'Noah Brown',
		department: 'Operations',
		role: 'Junior',
		vibemeterScore: 51,
		engagementRate: 65,
		recentTrend: 'down',
		riskLevel: 'Medium',
		joinDate: '2022-01-25',
		lastActive: '2023-03-28T11:40:00',
	},
	{
		id: 9,
		name: 'Isabella Lee',
		department: 'Product',
		role: 'Director',
		vibemeterScore: 76,
		engagementRate: 82,
		recentTrend: 'stable',
		riskLevel: 'Low',
		joinDate: '2020-04-18',
		lastActive: '2023-03-29T08:30:00',
	},
	{
		id: 10,
		name: 'Lucas White',
		department: 'Engineering',
		role: 'Intern',
		vibemeterScore: 62,
		engagementRate: 70,
		recentTrend: 'up',
		riskLevel: 'Medium',
		joinDate: '2022-06-07',
		lastActive: '2023-03-28T15:20:00',
	},
	{
		id: 11,
		name: 'Mia Clark',
		department: 'HR',
		role: 'Junior',
		vibemeterScore: 35,
		engagementRate: 45,
		recentTrend: 'down',
		riskLevel: 'High',
		joinDate: '2022-02-14',
		lastActive: '2023-03-27T10:10:00',
	},
	{
		id: 12,
		name: 'Alexander Hall',
		department: 'Sales',
		role: 'VP',
		vibemeterScore: 90,
		engagementRate: 93,
		recentTrend: 'stable',
		riskLevel: 'Low',
		joinDate: '2019-08-30',
		lastActive: '2023-03-29T14:45:00',
	},
	{
		id: 13,
		name: 'Charlotte Garcia',
		department: 'Finance',
		role: 'Senior',
		vibemeterScore: 81,
		engagementRate: 87,
		recentTrend: 'up',
		riskLevel: 'Low',
		joinDate: '2020-12-02',
		lastActive: '2023-03-29T12:25:00',
	},
	{
		id: 14,
		name: 'Benjamin Lopez',
		department: 'Marketing',
		role: 'Junior',
		vibemeterScore: 22,
		engagementRate: 30,
		recentTrend: 'down',
		riskLevel: 'Critical',
		joinDate: '2022-05-19',
		lastActive: '2023-03-25T09:30:00',
	},
	{
		id: 15,
		name: 'Abigail King',
		department: 'Product',
		role: 'Team Lead',
		vibemeterScore: 18,
		engagementRate: 25,
		recentTrend: 'down',
		riskLevel: 'Critical',
		joinDate: '2021-09-14',
		lastActive: '2023-03-26T13:50:00',
	},
]

export const meetingsData: MeetingData[] = [
	{
		id: 1,
		title: 'Team Wellness Check-in',
		host: 'Sophia Rodriguez',
		attendees: ['James Wilson', 'Benjamin Lopez', 'Mia Clark'],
		dateTime: '2023-04-01T09:00:00',
		purpose: 'Addressing declining wellbeing scores',
		priority: 'High',
	},
	{
		id: 2,
		title: 'One-on-One Coaching',
		host: 'Sophia Rodriguez',
		attendees: ['Benjamin Lopez'],
		dateTime: '2023-04-02T14:30:00',
		purpose: 'Personalized wellbeing support',
		priority: 'High',
	},
	{
		id: 3,
		title: 'Department Engagement Workshop',
		host: 'Emma Johnson',
		attendees: ['Olivia Thompson', 'Lucas White', 'Noah Brown'],
		dateTime: '2023-04-03T10:00:00',
		purpose: 'Improving team dynamics',
		priority: 'Medium',
	},
	{
		id: 4,
		title: 'Mental Health Awareness Training',
		host: 'Sophia Rodriguez',
		attendees: ['All Staff'],
		dateTime: '2023-04-05T13:00:00',
		purpose: 'Educational session',
		priority: 'Medium',
	},
	{
		id: 5,
		title: 'Crisis Intervention Meeting',
		host: 'Sophia Rodriguez',
		attendees: ['Abigail King', 'Emma Johnson'],
		dateTime: '2023-04-01T11:00:00',
		purpose: 'Emergency support for at-risk employee',
		priority: 'High',
	},
]

// Historical data for charts
export const moodScoreHistory = [
	{ month: 'Apr', score: 68 },
	{ month: 'May', score: 72 },
	{ month: 'Jun', score: 75 },
	{ month: 'Jul', score: 76 },
	{ month: 'Aug', score: 73 },
	{ month: 'Sep', score: 70 },
	{ month: 'Oct', score: 74 },
	{ month: 'Nov', score: 78 },
	{ month: 'Dec', score: 80 },
	{ month: 'Jan', score: 76 },
	{ month: 'Feb', score: 73 },
	{ month: 'Mar', score: 75 },
]

export const engagementHistory = [
	{ month: 'Apr', rate: 72 },
	{ month: 'May', rate: 75 },
	{ month: 'Jun', rate: 78 },
	{ month: 'Jul', rate: 80 },
	{ month: 'Aug', rate: 76 },
	{ month: 'Sep', rate: 74 },
	{ month: 'Oct', rate: 77 },
	{ month: 'Nov', rate: 81 },
	{ month: 'Dec', rate: 83 },
	{ month: 'Jan', rate: 79 },
	{ month: 'Feb', rate: 75 },
	{ month: 'Mar', rate: 78 },
]

// Department averages for heatmap
export const departmentAverages = [
	{ department: 'Engineering', averageScore: 75, employeeCount: 25 },
	{ department: 'Marketing', averageScore: 68, employeeCount: 15 },
	{ department: 'Sales', averageScore: 82, employeeCount: 20 },
	{ department: 'HR', averageScore: 79, employeeCount: 10 },
	{ department: 'Finance', averageScore: 71, employeeCount: 12 },
	{ department: 'Operations', averageScore: 65, employeeCount: 18 },
	{ department: 'Product', averageScore: 62, employeeCount: 22 },
	{ department: 'Design', averageScore: 85, employeeCount: 14 },
]

// Calculate overall metrics
export const calculateOverallMetrics = () => {
	const totalEmployees = employeeData.length
	const avgMoodScore =
		employeeData.reduce((sum, emp) => sum + emp.vibemeterScore, 0) /
		totalEmployees
	const avgEngagementRate =
		employeeData.reduce((sum, emp) => sum + emp.engagementRate, 0) /
		totalEmployees

	const criticalRiskCount = employeeData.filter(
		emp => emp.riskLevel === 'Critical'
	).length
	const highRiskCount = employeeData.filter(
		emp => emp.riskLevel === 'High'
	).length

	return {
		totalEmployees,
		avgMoodScore: Math.round(avgMoodScore),
		avgEngagementRate: Math.round(avgEngagementRate),
		criticalRiskCount,
		highRiskCount,
		atRiskPercentage: Math.round(
			((criticalRiskCount + highRiskCount) / totalEmployees) * 100
		),
	}
}

// Get priority employees (those with critical or high risk)
export const getPriorityEmployees = () => {
	return employeeData
		.filter(emp => emp.riskLevel === 'Critical' || emp.riskLevel === 'High')
		.sort((a, b) => a.vibemeterScore - b.vibemeterScore)
}
