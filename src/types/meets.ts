export enum SessionStatus {
	SCHEDULED = "SCHEDULED"  ,
    IN_PROGRESS = "IN_PROGRESS" ,
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"  ,
    NO_SHOW = "NO_SHOW"  ,
}
  
export type SessionType = {
	meet_id: string;
	user_id: string;
	with_user_id: string;
	duration: number;
	status: string;
	scheduled_at: string;
	meeting_link: string;
	location: string;
	notes: string;
  }