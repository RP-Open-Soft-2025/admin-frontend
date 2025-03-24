export enum SenderType {
	BOT = 'bot',
	EMPLOYEE = 'emp',
	HR = 'hr',
}

export enum ChatMode {
	BOT = 'bot',
	HR = 'hr',
	ADMIN = 'admin',
	SYSTEM = 'system',
}

export interface Message {
	timestamp: string // ISO string timestamp
	sender_type: SenderType
	text: string
}

export interface Chat {
	chat_id: string // Unique identifier for the chat
	user_id: string // Employee ID associated with this chat
	messages: Message[] // List of messages in the chat
	mood_score: number // Mood score (-1 unassigned, 1-6 actual score)
	chat_mode: ChatMode // Current mode of the chat
	is_escalated: boolean // Whether the chat is escalated to HR
	escalation_reason?: string | null // Reason for escalation
	created_at: string // ISO string timestamp for creation
	updated_at: string // ISO string timestamp for last update
}
