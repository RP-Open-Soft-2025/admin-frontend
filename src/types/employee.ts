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

export enum EmotionZone {
	LEANING_SAD = 'Leaning to Sad Zone',
	NEUTRAL = 'Neutral Zone (OK)',
	LEANING_HAPPY = 'Leaning to Happy Zone',
	SAD = 'Sad Zone',
	HAPPY = 'Happy Zone',
	EXCITED = 'Excited Zone',
	FRUSTRATED = 'Frustrated Zone',
}

export enum Role {
	EMPLOYEE = 'employee',
	HR = 'hr',
	ADMIN = 'admin',
}

export interface Activity {
	date: string // ISO format date
	teamsMessagesSent: number
	emailsSent: number
	meetingsAttended: number
	workHours: number
}

export interface Leave {
	leaveType: LeaveType
	leaveDays: number
	leaveStartDate: string
	leaveEndDate: string
}

export interface Onboarding {
	joiningDate: string
	onboardingFeedback: OnboardingFeedback
	mentorAssigned: boolean
	initialTrainingCompleted: boolean
}

export interface Performance {
	reviewPeriod: string
	performanceRating: number
	managerFeedback: ManagerFeedback
	promotionConsideration: boolean
}

export interface Reward {
	awardType: AwardType
	awardDate: string
	rewardPoints: number
}

export interface VibeMeter {
	responseDate: string
	vibeScore: number
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

export interface Employee {
	userId: string
	name: string
	email: string
	password: string
	role: Role
	managerId?: string
	isBlocked: boolean
	blockedAt?: string // ISO format date
	blockedBy?: string
	blockedReason?: string
	companyData: CompanyData
	accountActivated: boolean
}

export interface LeaveRequest {
	id: string;
	type: string;
	startDate: string;
	endDate: string;
	status: 'Approved' | 'Pending' | 'Rejected';
	requestDate: string;
}
