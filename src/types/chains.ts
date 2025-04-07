export enum ChainStatus {
	ACTIVE = 'active',
	COMPLETED = 'completed',
	ESCALATED = 'escalated',
	CANCELLED = 'cancelled',
}

export interface ChainType {
	chain_id: string
	employee_id: string
	session_ids: string[]
	status: ChainStatus
	context?: string | null
	created_at: string
	updated_at: string
	completed_at?: string | null
	escalated_at?: string | null
	cancelled_at?: string | null
	notes?: string | null
	isExpanded?: boolean // UI state for dropdown
}

export interface EscalatedChain {
	chain_id: string
	session_ids: string[]
	employee_id: string
	escalation_reason: string
	escalated_at: string
}
