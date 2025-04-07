'use client'
import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { MessageResp, SenderType } from '@/types/chat'
import { API_URL, WS_URL } from '@/constants'
import store from '@/redux/store'
import { toast } from '@/components/ui/sonner'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

// Define session history type
type SessionHist = {
	chat_id: string
	last_message: string
	last_message_time: string | null // ISO timestamp
	unread_count: number
	total_messages: number
	chat_mode: 'BOT' | 'HUMAN' // Assuming only these two modes
	is_escalated: boolean
	created_at: string // ISO timestamp
}

// Define a Session interface to properly type the session data
interface Session {
	session_id: string
	employee_id: string
	chat_id: string
	status: string
	scheduled_at: string
}

const MessageComp = ({ message }: { message: MessageResp }) => {
	const { sender, text, timestamp } = message

	// Dynamic styling based on sender
	const messageStyles = {
		[SenderType.EMPLOYEE]: {
			container: 'justify-start',
			bg: 'bg-blue-200 dark:bg-blue-800',
			textColor: 'text-gray-900 dark:text-blue-100',
		},
		[SenderType.BOT]: {
			container: 'justify-end',
			bg: 'bg-green-200 dark:bg-green-800',
			textColor: 'text-gray-900 dark:text-green-100',
		},
		[SenderType.HR]: {
			container: 'justify-end',
			bg: 'bg-purple-200 dark:bg-purple-800',
			textColor: 'text-gray-900 dark:text-purple-100',
		},
		[SenderType.SYSTEM]: {
			container: 'justify-center',
			bg: 'bg-gray-300 dark:bg-gray-700', // Improved contrast
			textColor: 'text-gray-900 dark:text-gray-100',
		},
	}

	const { container, bg, textColor } = messageStyles[sender]

	return (
		<div className={`flex ${container} w-full`}>
			<div
				className={`${
					sender === SenderType.SYSTEM
						? 'max-w-max px-4 py-2 rounded-lg text-sm font-semibold'
						: 'max-w-[70%] p-3 rounded-xl shadow-sm'
				} ${bg} ${textColor}`}
			>
				{sender !== SenderType.SYSTEM && (
					<div className="flex justify-between items-center mb-1">
						<span className="text-xs font-semibold opacity-70">
							{sender === SenderType.EMPLOYEE
								? 'Employee'
								: sender === SenderType.BOT
									? 'Bot'
									: sender === SenderType.HR
										? 'HR'
										: ''}
						</span>
						<span className="text-xs opacity-50 ml-2">
							{new Date(timestamp).toLocaleTimeString([], {
								hour: '2-digit',
								minute: '2-digit',
							})}
						</span>
					</div>
				)}
				<p className="text-sm font-medium text-left">
					{sender == SenderType.SYSTEM ? `Chat ID: ${text}` : text}
				</p>
			</div>
		</div>
	)
}

// Chat history item component
const ChatHistoryItem = ({
	chat,
	isActive,
	onClick,
}: {
	chat: SessionHist
	isActive: boolean
	onClick: () => void
}) => {
	return (
		<div
			className={`p-2 cursor-pointer border-b dark:border-gray-700 border-gray-300 
				${isActive ? 'dark:bg-[#1E293B] bg-gray-200' : 'dark:hover:bg-[#1E293B] hover:bg-gray-100'}`}
			onClick={onClick}
		>
			<div className="flex justify-between items-center">
				<h3 className="font-medium dark:text-white text-gray-900 text-sm">
					{new Date(chat.created_at).toLocaleDateString('en-GB', {
						day: 'numeric',
						month: 'long',
						year: '2-digit',
					})}
				</h3>
				<span className="text-xs dark:text-gray-400 text-gray-600">
					{chat.last_message_time
						? new Date(chat.last_message_time).toLocaleTimeString()
						: new Date(chat.created_at).toLocaleTimeString()}
				</span>
			</div>
			{chat.last_message && (
				<p className="text-xs dark:text-gray-400 text-gray-600 truncate mt-1">
					{chat.last_message}
				</p>
			)}
		</div>
	)
}

const ChatPage = () => {
	const params = useParams()
	const id = params.id as string
	const [messages, setMessages] = useState<MessageResp[]>([])
	const chatEndRef = useRef<HTMLDivElement>(null)
	const messagesContainerRef = useRef<HTMLDivElement>(null)
	const { auth } = store.getState()
	const [isLoading, setIsLoading] = useState(true)
	const [sidebarOpen, setSidebarOpen] = useState(true)
	const [sessions, setSessions] = useState<SessionHist[]>([])
	const [historyLoading, setHistoryLoading] = useState(false)
	const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
	const [chatid, setChatId] = useState<string>('')
	const [isEndSessionModalOpen, setIsEndSessionModalOpen] = useState(false)
	const [endSessionNotes, setEndSessionNotes] = useState('')
	const [isEndingSession, setIsEndingSession] = useState(false)
	const [sessionAction, setSessionAction] = useState<string>('escalate')

	// Scroll to latest message
	useEffect(() => {
		if (chatEndRef.current) {
			chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
		}
	}, [messages])

	// Scroll to selected chat's system message
	useEffect(() => {
		if (selectedChatId && messagesContainerRef.current) {
			const systemMessage = messages.find(
				msg => msg.sender === SenderType.SYSTEM && msg.text === selectedChatId
			)
			if (systemMessage) {
				const messageElement = document.querySelector(
					`[data-chat-id="${selectedChatId}"]`
				)
				if (messageElement) {
					messageElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
				}
			}
		}
	}, [selectedChatId, messages])

	// Get sidebar state from localStorage on component mount
	useEffect(() => {
		const savedSidebarState = localStorage.getItem('chatSidebarOpen')
		if (savedSidebarState !== null) {
			setSidebarOpen(savedSidebarState === 'true')
		}
	}, [])

	// Save sidebar state to localStorage when it changes
	useEffect(() => {
		localStorage.setItem('chatSidebarOpen', sidebarOpen.toString())
	}, [sidebarOpen])

	// Fetch all chat histories for sidebar
	useEffect(() => {
		setHistoryLoading(true)

		const fetchSessionHistory = async () => {
			if (!auth.user?.accessToken) {
				toast({
					type: 'error',
					description: 'Authentication token is missing. Please log in again.',
				})
				setHistoryLoading(false)
				setIsLoading(false)
				return
			}

			// Step 1: Check if ID is already a chat ID first
			if (id.startsWith('CHAT')) {
				console.log('ID appears to be a chat ID, using it directly:', id)
				// Skip to fetching chat history using the ID directly
				await fetchChatHistory(id)
				return
			}

			// Step 2: If not a chat ID, try to find it in the sessions
			const endpoint = 'admin'
			console.log(
				`Using endpoint: ${endpoint}/sessions for user role: ${auth.user.userRole}`
			)

			try {
				// Try with the regular sessions endpoint first
				let matchingSession = null
				let sessionsData = []

				// Try regular sessions first
				console.log(`Fetching from ${API_URL}/${endpoint}/sessions`)
				const sessionsResponse = await fetch(
					`${API_URL}/${endpoint}/sessions`,
					{
						method: 'GET',
						headers: {
							Authorization: `Bearer ${auth.user.accessToken}`,
							'Content-Type': 'application/json',
						},
					}
				)

				if (sessionsResponse.ok) {
					sessionsData = await sessionsResponse.json()
					console.log(`Received ${sessionsData.length} active/pending sessions`)

					// Try to find the session
					matchingSession = sessionsData.find(
						(session: Session) => session.session_id === id
					)
				} else {
					console.error(
						`Failed to fetch regular sessions: ${sessionsResponse.status}`
					)
				}

				// If not found, try the completed sessions endpoint
				if (!matchingSession) {
					console.log(
						`Session not found in active sessions, trying completed sessions endpoint`
					)
					console.log(`Fetching from ${API_URL}/${endpoint}/sessions/completed`)

					const completedSessionsResponse = await fetch(
						`${API_URL}/${endpoint}/sessions/completed`,
						{
							method: 'GET',
							headers: {
								Authorization: `Bearer ${auth.user.accessToken}`,
								'Content-Type': 'application/json',
							},
						}
					)

					if (completedSessionsResponse.ok) {
						const completedSessionsData = await completedSessionsResponse.json()
						console.log(
							`Received ${completedSessionsData.length} completed sessions`
						)

						// Try to find the session in completed sessions
						matchingSession = completedSessionsData.find(
							(session: Session) => session.session_id === id
						)

						if (matchingSession) {
							console.log(`Found session ${id} in completed sessions`)
						}
					} else {
						console.error(
							`Failed to fetch completed sessions: ${completedSessionsResponse.status}`
						)
					}
				}

				// If we still don't have a matching session after checking both endpoints
				if (!matchingSession) {
					console.error(`Session ID "${id}" not found in any sessions list`)
					toast({
						type: 'error',
						description: `Session ${id} not found in active or completed sessions. Please check the session ID.`,
					})
					setHistoryLoading(false)
					setIsLoading(false)
					return
				}

				// Step 3: Extract the chat ID
				const chatId = matchingSession.chat_id
				console.log('Found chat ID:', chatId, 'for session ID:', id)

				// Step 4: Fetch chat history
				await fetchChatHistory(chatId)
			} catch (error) {
				console.error('Error fetching sessions:', error)
				toast({
					type: 'error',
					description: 'Failed to load sessions. Please try again.',
				})
				setHistoryLoading(false)
				setIsLoading(false)
			}

			// Function to fetch chat history once we have the chat ID
			async function fetchChatHistory(chatId: string) {
				try {
					console.log('Fetching chat history for chat ID:', chatId)

					const response = await fetch(`${API_URL}/chat/history/${chatId}`, {
						method: 'GET',
						headers: {
							Authorization: `Bearer ${auth.user?.accessToken}`,
							'Content-Type': 'application/json',
						},
					})

					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`)
					}

					const data = await response.json()
					console.log('Chat history data received for chat ID:', chatId)

					// Handle the data as before
					if (data && data.chatId && Array.isArray(data.messages)) {
						const session: SessionHist = {
							chat_id: data.chatId,
							last_message: data.messages[data.messages.length - 1]?.text || '',
							last_message_time:
								data.messages[data.messages.length - 1]?.timestamp || null,
							unread_count: 0,
							total_messages: data.messages.length,
							chat_mode: 'BOT',
							is_escalated: false,
							created_at:
								data.messages[0]?.timestamp || new Date().toISOString(),
						}

						setSessions([session])
						if (chatid == '') setChatId(session.chat_id)
						setMessages(data.messages)
					} else {
						console.error('Invalid data format received:', data)
						toast({
							type: 'error',
							description: 'Invalid data format received from server',
						})
					}
				} catch (error) {
					console.error('Error fetching chat history:', error)
					toast({
						type: 'error',
						description: 'Failed to load chat history. Please try again.',
					})
				} finally {
					setHistoryLoading(false)
					setIsLoading(false)
				}
			}
		}

		fetchSessionHistory()
	}, [auth.user, id])

	useEffect(() => {
		const ws = new WebSocket(WS_URL + '/llm/chat/ws/llm/' + chatid)

		ws.onmessage = event => {
			const data = JSON.parse(event.data)
			console.log('New message received:', data)

			if (data.type === 'new_message') {
				setMessages(prev => [
					...prev,
					{
						sender: data.sender,
						text: data.message,
						timestamp: data.timestamp,
					},
				])
			}
		}

		return () => {
			ws.close()
		}
	}, [chatid])

	const endSession = async () => {
		setIsEndingSession(true)
		try {
			const endpoint = `/admin/chains/${id}/${sessionAction}`

			const response = await fetch(`${API_URL}${endpoint}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${auth.user?.accessToken}`,
				},
				body: JSON.stringify({
					notes: endSessionNotes,
				}),
			})

			if (!response.ok) {
				throw new Error(`Error: ${response.status}`)
			}

			// Show success message with appropriate action
			const actionText =
				sessionAction === 'complete'
					? 'completed'
					: sessionAction === 'escalate'
						? 'escalated'
						: 'cancelled'

			toast({
				description: `Session ${actionText} successfully`,
				type: 'success',
			})

			// Close modal and reset state
			setIsEndSessionModalOpen(false)
			setEndSessionNotes('')
			setSessionAction('complete')
		} catch (error) {
			console.error(`Error ${sessionAction}ing session:`, error)
			toast({
				description: `Failed to ${sessionAction} session`,
				type: 'error',
			})
		} finally {
			setIsEndingSession(false)
		}
	}

	const navigateToChat = (chatId: string) => {
		setSelectedChatId(chatId)
		// window.location.href = `/chat-page/${chatId}`
	}

	const toggleSidebar = () => {
		setSidebarOpen(!sidebarOpen)
	}

	return (
		<div className="flex h-[80vh] w-full dark:bg-[#0f172a] bg-white">
			{/* Left Sidebar - Always present but may be collapsed */}
			<div
				className={`transition-all duration-300 ease-in-out border-r border-gray-700 ${
					sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
				}`}
			>
				{/* Sidebar Content */}
				<div className="h-full dark:bg-[#0f172a] text-white flex flex-col bg-white">
					<div className="p-2 border-b border-gray-700 flex items-center">
						<h2 className="text-lg font-bold dark:text-white text-gray-900 items-center flex justify-center">
							Chat History
						</h2>
					</div>

					<div className="overflow-y-auto flex-grow">
						{historyLoading ? (
							<div className="flex justify-center items-center h-24">
								<div className="animate-spin rounded-full h-6 w-6 border-t-2 border-indigo-500"></div>
							</div>
						) : (
							<>
								{sessions.length === 0 ? (
									<p className="text-center p-2 dark:text-gray-400 text-sm text-gray-700">
										No chat history found
									</p>
								) : (
									sessions.map(session => (
										<ChatHistoryItem
											key={session.chat_id}
											chat={session}
											isActive={session.chat_id === id}
											onClick={() => navigateToChat(session.chat_id)}
										/>
									))
								)}
							</>
						)}
					</div>
				</div>
			</div>

			{/* Main Chat Area */}
			<div className="flex flex-col flex-grow overflow-hidden">
				{/* Chat Header with Toggle Button */}
				<div className="flex items-center p-2 dark:bg-[#0f172a] border-b border-gray-700 dark:text-white bg-white text-gray-dark">
					<button
						className="mr-3 dark:text-gray-300 hover:text-white focus:outline-none text-gray-900"
						onClick={toggleSidebar}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					</button>
					<h2 className="text-lg font-bold text-center flex-grow">
						Chat Window
					</h2>
				</div>

				{/* Chat Messages Container */}
				<div
					ref={messagesContainerRef}
					className="flex-grow overflow-hidden dark:bg-[#0f172a] bg-white"
				>
					<div className="h-full overflow-y-auto flex flex-col space-y-2 p-3">
						{isLoading ? (
							<div className="flex justify-center items-center h-full">
								<div className="animate-spin rounded-full h-10 w-10 border-t-3 border-indigo-500"></div>
							</div>
						) : (
							<>
								{messages.length > 0 ? (
									messages.map((message, index) => (
										<div key={index} data-chat-id={message.text}>
											<MessageComp message={message} />
										</div>
									))
								) : (
									<p className="text-center p-2 dark:text-gray-400 text-sm text-gray-700">
										No chat history messages found
									</p>
								)}
								<div ref={chatEndRef} className="h-1" />
							</>
						)}
					</div>
				</div>

				{/* Chat Input */}

				<div className="dark:bg-[#162040] flex justify-center items-center py-2 border-t border-gray-700 bg-white">
					<button
						className="px-4 py-2 dark:bg-[#1e293b] dark:text-white rounded-md shadow-md text-sm bg-blue-200 text-black
              dark:hover:bg-[#334155] transition-colors hover:bg-blue-light-500"
						onClick={() => setIsEndSessionModalOpen(true)}
					>
						End Session
					</button>
				</div>

				{/* End Session Modal */}
				<Dialog
					open={isEndSessionModalOpen}
					onOpenChange={setIsEndSessionModalOpen}
				>
					<DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900 dark:border-gray-700">
						<DialogHeader>
							<DialogTitle className="dark:text-white">
								Escalate Session
							</DialogTitle>
						</DialogHeader>
						<form
							onSubmit={e => {
								e.preventDefault()
								endSession()
							}}
							className="space-y-4"
						>
							{/* <div className="grid w-full items-center gap-2">
								<label
									htmlFor="session_action"
									className="text-sm font-medium text-gray-700 dark:text-gray-300"
								>
									Action
								</label>
								<div className="relative">
									<Select
										options={[
											{ value: 'escalate', label: 'Escalate' },
										]}
										placeholder="Select action"
										onChange={value => setSessionAction(value)}
										defaultValue={sessionAction}
									/>
									<span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
										<svg
											className="size-5"
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path d="m6 9 6 6 6-6" />
										</svg>
									</span>
								</div>
							</div> */}

							<div className="grid w-full items-center gap-2">
								<label
									htmlFor="end_session_notes"
									className="text-sm font-medium text-gray-700 dark:text-gray-300"
								>
									Notes
								</label>
								<Textarea
									id="end_session_notes"
									value={endSessionNotes}
									onChange={e => setEndSessionNotes(e.target.value)}
									placeholder="Enter any notes about this action..."
									className="resize-none min-h-[100px] dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:placeholder-gray-500"
								/>
							</div>

							<DialogFooter className="gap-2 sm:gap-0">
								<Button
									type="button"
									variant="outline"
									onClick={() => setIsEndSessionModalOpen(false)}
									className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
								>
									Cancel
								</Button>
								<Button
									type="submit"
									disabled={isEndingSession}
									className={`relative ${
										sessionAction === 'complete'
											? 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800'
											: sessionAction === 'escalate'
												? 'bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800'
												: 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800'
									}`}
								>
									{isEndingSession && (
										<div className="absolute inset-0 flex items-center justify-center">
											<div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white dark:border-gray-300"></div>
										</div>
									)}
									<span className={isEndingSession ? 'opacity-0' : ''}>
										{sessionAction === 'complete'
											? 'Complete'
											: sessionAction === 'escalate'
												? 'Escalate'
												: 'Cancel'}{' '}
										Session
									</span>
								</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	)
}

export default ChatPage
