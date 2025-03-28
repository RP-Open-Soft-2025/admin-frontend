export type Meeting = {
	meet_id: string
	user_id: string
	with_user_id: string
	duration: number
	status: 'SCHEDULED' | 'ONGOING' | 'COMPLETED' | 'CANCELED'
	scheduled_at: string // ISO 8601 datetime string
	meeting_link?: string // Optional, as not all meetings may have a link
	location?: string // Optional, as some meetings may be online only
	notes?: string // Optional, as notes may not always be present
}
