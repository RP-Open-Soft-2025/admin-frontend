export enum LeaveType {
	CASUAL = 'Casual Leave',
	UNPAID = 'Unpaid Leave',
	ANNUAL = 'Annual Leave',
	SICK = 'Sick Leave',
}

export enum OnboardingFeedback {
	POOR = 'Poor',
	AVERAGE = 'Average',
	GOOD = 'Good',
	EXCELLENT = 'Excellent',
}

export enum ManagerFeedback {
	NEEDS_IMPROVEMENT = 'Needs Improvement',
	MEETS_EXPECTATIONS = 'Meets Expectations',
	EXCEEDS_EXPECTATIONS = 'Exceeds Expectations',
}

export enum AwardType {
	STAR_PERFORMER = 'Star Performer',
	BEST_TEAM_PLAYER = 'Best Team Player',
	INNOVATION = 'Innovation Award',
	LEADERSHIP = 'Leadership Excellence',
}

export enum Role {
	EMPLOYEE = 'employee',
	HR = 'hr',
	ADMIN = 'admin',
}

export enum EmotionZone {
	LEANING_SAD = 'Leaning to Sad Zone',
	NEUTRAL = 'Neutral Zone (OK)',
	LEANING_HAPPY = 'Leaning to Happy Zone',
	SAD = 'Sad Zone',
	HAPPY = 'Happy Zone',
	EXCITED = 'Excited Zone',
	FRUSTRATED = 'Frustrated Zone',
}

export interface Activity {
	Date: string // ISO format date
	Teams_Messages_Sent: number
	Emails_Sent: number
	Meetings_Attended: number
	Work_Hours: number
}

export interface Leave {
	Leave_Type: LeaveType
	Leave_Days: number
	Leave_Start_Date: string
	Leave_End_Date: string
}

export interface Onboarding {
	Joining_Date: string
	Onboarding_Feedback: OnboardingFeedback
	Mentor_Assigned: boolean
	Initial_Training_Completed: boolean
}

export interface Performance {
	Review_Period: string
	Performance_Rating: number
	Manager_Feedback: ManagerFeedback
	Promotion_Consideration: boolean
}

export interface Reward {
	Award_Type: AwardType
	Award_Date: string
	Reward_Points: number
}

export interface VibeMeter {
	Response_Date: string
	Vibe_Score: number
    emotionZone: EmotionZone
}

export interface CompanyData {
	activity: Activity[]
	leave: Leave[]
	onboarding: Onboarding[]
	performance: Performance[]
	rewards: Reward[]
	vibemeter: VibeMeter[]
}

export interface EmployeeAPI {
	employee_id: string
	name: string
	email: string
	password: string
	role: Role
	manager_id?: string
	is_blocked: boolean
	blocked_at?: string // ISO format date
	blocked_by?: string
	blocked_reason?: string
	company_data: CompanyData
	account_activated: boolean
	last_ping: string
}

export interface LeaveRequest {
	id: string
	type: string
	startDate: string
	endDate: string
	status: 'Approved' | 'Pending' | 'Rejected'
	requestDate: string
}
