export enum SessionStatus {
	PENDING = 'pending',
	ACTIVE = 'active',
	COMPLETED = 'completed',
	CANCELLED = 'cancelled',
  }
  
  export interface SessionType {
	session_id: string; // Unique identifier for the session
	employee_id: string; // Employee ID assigned to this session
	chat_id: string; // Chat ID associated with this session
	status: SessionStatus; // Current session status
	scheduled_at: string; // ISO string timestamp for the scheduled session
	created_at?: string; // ISO string timestamp for session creation (optional)
	updated_at?: string; // ISO string timestamp for last update (optional)
	completed_at?: string | null; // ISO string timestamp for completion (nullable)
	cancelled_at?: string | null; // ISO string timestamp for cancellation (nullable)
	cancelled_by?: string | null; // Employee ID of the canceller (nullable)
	notes?: string | null; // Additional session notes (nullable)
  }
  