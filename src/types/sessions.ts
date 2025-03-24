enum SessionStatus {
	PENDING = 'pending',
	ACTIVE = 'active',
	COMPLETED = 'completed',
	CANCELLED = 'cancelled',
}

export interface SessionType {
	session_id: string // Unique identifier for the session
	user_id: string // Employee ID assigned to this session
	chat_id: string // Chat ID associated with this session
	status: SessionStatus // Current session status
	scheduled_at: Date // Scheduled session time
	created_at: Date // Session creation time
	updated_at: Date // Last update time
	completed_at?: Date // Completion timestamp
	cancelled_at?: Date // Cancellation timestamp
	cancelled_by?: string // Employee ID of the person who cancelled
	notes?: string // Additional session notes
}
