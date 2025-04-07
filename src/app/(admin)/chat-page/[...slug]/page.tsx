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
import { ChevronDown, ChevronUp } from 'lucide-react'

// Define session history type
// eslint-disable-next-line
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

// Define Chain type based on the API response
type Chain = {
	chain_id: string
	employee_id: string
	session_ids: string[]
	sessions: Session[]
	status: string
	context: string
	created_at: string
	updated_at: string
	completed_at: string | null
	escalated_at: string | null
	cancelled_at: string | null
	notes: string
}

// Define an extended message response type that includes session_id
// eslint-disable-next-line
type ExtendedMessageResp = MessageResp & {
	session_id?: string
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

// Chain item component with dropdown for sessions
const ChainItem = ({
	chain,
	isExpanded,
	onToggle,
	onSelectSession,
	selectedSessionId,
}: {
	chain: Chain
	isExpanded: boolean
	onToggle: () => void
	onSelectSession: (chain: Chain, session: Session) => void
	selectedSessionId: string | null
}) => {
	return (
		<div className="border-b dark:border-gray-700 border-gray-300">
			{/* Chain header - clickable to expand/collapse */}
			<div
				className="p-3 cursor-pointer flex justify-between items-center dark:hover:bg-[#1E293B] hover:bg-gray-100"
				onClick={onToggle}
			>
				<div>
					<h3 className="font-medium dark:text-white text-gray-900 text-sm">
						{new Date(chain.created_at).toDateString()}
					</h3>
					<p className="text-xs dark:text-gray-400 text-gray-600">
						Status: {chain.status}
					</p>
				</div>
				<div className="flex items-center">
					<span className="text-xs mr-2 dark:text-gray-400 text-gray-600">
						{chain.sessions.length}{' '}
						{chain.sessions.length === 1 ? 'session' : 'sessions'}
					</span>
					{isExpanded ? (
						<ChevronUp className="h-4 w-4 dark:text-gray-400 text-gray-600" />
					) : (
						<ChevronDown className="h-4 w-4 dark:text-gray-400 text-gray-600" />
					)}
				</div>
			</div>

			{/* Sessions dropdown */}
			{isExpanded && chain.sessions.length > 0 && (
				<div className="pl-4 pr-2 pb-2">
					{chain.sessions.map(session => (
						<div
							key={session.session_id}
							className={`p-2 cursor-pointer rounded-md my-1 text-sm
								${
									selectedSessionId === session.session_id
										? 'dark:bg-[#1E293B] bg-gray-200'
										: 'dark:hover:bg-[#1E293B] hover:bg-gray-100'
								}`}
							onClick={() => onSelectSession(chain, session)}
						>
							<div className="flex flex-col">
								<div className="flex justify-between">
									<span className="font-medium dark:text-white text-gray-900">
										{new Date(session.scheduled_at).toLocaleTimeString()}
									</span>
									<span
										className={`text-xs px-1.5 py-0.5 rounded-full ${
											session.status === 'active'
												? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
												: session.status === 'completed'
													? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
													: session.status === 'escalated'
														? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
														: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
										}`}
									>
										{session.status}
									</span>
								</div>
								<span className="text-xs dark:text-gray-400 text-gray-600 mt-1">
									{new Date(session.scheduled_at).toLocaleString()}
								</span>
								<span className="text-xs dark:text-gray-400 text-gray-600 mt-1">
									Chat ID: {session.chat_id}
								</span>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Empty state for sessions */}
			{isExpanded && chain.sessions.length === 0 && (
				<div className="pl-4 pr-2 pb-2">
					<p className="text-xs dark:text-gray-400 text-gray-600 italic p-2">
						No sessions available
					</p>
				</div>
			)}
		</div>
	)
}

// ChatMessages component to handle fetching and displaying messages for a specific chat
const ChatMessages = ({
	chatId,
	accessToken,
}: {
	chatId: string
	accessToken: string
}) => {
	const [messages, setMessages] = useState<MessageResp[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const messagesEndRef = useRef<HTMLDivElement>(null)

	// Scroll to bottom when messages change
	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
		}
	}, [messages])

	// Fetch messages when chatId changes
	useEffect(() => {
		if (!chatId) {
			setMessages([])
			setIsLoading(false)
			return
		}

		const fetchMessages = async () => {
			try {
				setIsLoading(true)
				setError(null)

				// Get messages for this specific chat
				const messagesUrl = `${API_URL}/chat/history/${chatId}`
				console.log('Fetching messages from:', messagesUrl)

				const messagesResponse = await fetch(messagesUrl, {
					method: 'GET',
					headers: {
						Authorization: `Bearer ${accessToken}`,
						'Content-Type': 'application/json',
					},
				})

				if (!messagesResponse.ok) {
					throw new Error(`HTTP error! status: ${messagesResponse.status}`)
				}

				const responseData = await messagesResponse.json()
				console.log(`Received response for chat ${chatId}:`, responseData)

				// Extract messages from the response - the API returns { chatId, messages: [...] }
				const chatMessages = responseData.messages || []

				// Map API response format to our MessageResp format
				const formattedMessages = chatMessages.map(
					(msg: { sender: string; text: string; timestamp: string }) => ({
						sender:
							msg.sender === 'emp'
								? SenderType.EMPLOYEE
								: msg.sender === 'bot'
									? SenderType.BOT
									: msg.sender === 'hr'
										? SenderType.HR
										: SenderType.SYSTEM,
						text: msg.text,
						timestamp: msg.timestamp,
					})
				)

				// Add system message at the beginning showing chat ID and current datetime
				const systemMessage: MessageResp = {
					sender: SenderType.SYSTEM,
					text: `${chatId}`,
					timestamp: new Date().toISOString(),
				}

				console.log(
					`Processed ${formattedMessages.length} messages for display`
				)
				setMessages([systemMessage, ...formattedMessages])
			} catch (err) {
				console.error(`Error fetching messages for chat ${chatId}:`, err)
				setError(
					`Failed to load messages: ${err instanceof Error ? err.message : 'Unknown error'}`
				)
				setMessages([])
			} finally {
				setIsLoading(false)
			}
		}

		fetchMessages()
	}, [chatId, accessToken])

	// Set up WebSocket for real-time messages
	useEffect(() => {
		if (!chatId) return

		const ws = new WebSocket(WS_URL + '/llm/chat/ws/llm/' + chatId)

		ws.onmessage = event => {
			const data = JSON.parse(event.data)
			console.log('New message received:', data)

			if (data.type === 'new_message') {
				setMessages(prev => [
					...prev,
					{
						sender:
							data.sender === 'emp'
								? SenderType.EMPLOYEE
								: data.sender === 'bot'
									? SenderType.BOT
									: data.sender === 'hr'
										? SenderType.HR
										: SenderType.SYSTEM,
						text: data.message,
						timestamp: data.timestamp,
					},
				])
			}
		}

		return () => {
			ws.close()
		}
	}, [chatId])

	return (
		<div className="h-full overflow-y-auto flex flex-col space-y-2 p-3">
			{isLoading ? (
				<div className="flex justify-center items-center h-full">
					<div className="animate-spin rounded-full h-10 w-10 border-t-3 border-indigo-500"></div>
				</div>
			) : error ? (
				<div className="text-center p-4">
					<p className="text-red-500 dark:text-red-400">{error}</p>
					<button
						onClick={() => {
							// Re-fetch by triggering a state update
							setIsLoading(true)
						}}
						className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
					>
						Retry
					</button>
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
							No messages found for this chat
						</p>
					)}
					<div ref={messagesEndRef} className="h-1" />
				</>
			)}
		</div>
	)
}

const ChatPage = () => {
	const params = useParams()
	const paramsArray: string[] = params.slug as string[]

	// Extract employee ID and chain ID from the URL
	const employeeId = paramsArray[0] // First part is employee ID (e.g., EMP2001)
	const chainId = paramsArray[1] // Second part is chain ID (e.g., CHAIN18925A)

	const messagesContainerRef = useRef<HTMLDivElement>(null)
	const { auth } = store.getState()
	const [sidebarOpen, setSidebarOpen] = useState(true)
	// eslint-disable-next-line
	const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
	// eslint-disable-next-line
	const [chatid, setChatId] = useState<string>('')
	const [isEndSessionModalOpen, setIsEndSessionModalOpen] = useState(false)
	const [endSessionNotes, setEndSessionNotes] = useState('')
	const [isEndingSession, setIsEndingSession] = useState(false)
	const [sessionAction, setSessionAction] = useState<string>('escalate')

	// State for chains and expanded chains
	const [chains, setChains] = useState<Chain[]>([])
	const [expandedChainIds, setExpandedChainIds] = useState<Set<string>>(
		new Set()
	)
	const [selectedChain, setSelectedChain] = useState<Chain | null>(null)
	const [selectedSession, setSelectedSession] = useState<Session | null>(null)
	const [chainsLoading, setChainsLoading] = useState(false)

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

	// Fetch chains data when component mounts
	useEffect(() => {
		if (employeeId && auth.user?.accessToken) {
			fetchChains()
		}
	}, [employeeId, auth.user?.accessToken])

	// Fetch chains for the employee
	const fetchChains = async () => {
		try {
			setChainsLoading(true)
			const response = await fetch(
				`${API_URL}/admin/chains/employee/${employeeId}`,
				{
					method: 'GET',
					headers: {
						Authorization: `Bearer ${auth.user?.accessToken}`,
						'Content-Type': 'application/json',
					},
				}
			)

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const data = await response.json()
			setChains(data)

			// Auto-expand the current chain
			if (chainId) {
				const currentChain = data.find(
					(chain: Chain) => chain.chain_id === chainId
				)
				if (currentChain) {
					setExpandedChainIds(new Set([chainId]))
					setSelectedChain(currentChain)

					// Find the first session of this chain
					if (currentChain.sessions && currentChain.sessions.length > 0) {
						const firstSession = currentChain.sessions[0]
						setSelectedSession(firstSession)

						// Set chatId to first session's chat_id for WebSocket connection
						if (firstSession.chat_id) {
							setChatId(firstSession.chat_id)
							setSelectedChatId(firstSession.chat_id)
						}
					}
				}
			}
		} catch (error) {
			console.error('Error fetching chains:', error)
			toast({
				type: 'error',
				description: 'Failed to load chains',
			})
		} finally {
			setChainsLoading(false)
		}
	}

	// Toggle chain expansion
	const toggleChainExpansion = (chainId: string) => {
		setExpandedChainIds(prev => {
			const newSet = new Set(prev)
			if (newSet.has(chainId)) {
				newSet.delete(chainId)
			} else {
				newSet.add(chainId)
			}
			return newSet
		})
	}

	// Handle session selection
	const handleSessionSelect = (chain: Chain, session: Session) => {
		setSelectedChain(chain)
		setSelectedSession(session)

		// Set chatId to the session's chat_id for WebSocket connection
		if (session.chat_id) {
			setChatId(session.chat_id)
			setSelectedChatId(session.chat_id)
		}
	}

	const endSession = async () => {
		if (!selectedSession) {
			toast({
				type: 'error',
				description: 'No session selected',
			})
			return
		}

		setIsEndingSession(true)
		try {
			const endpoint = `/admin/sessions/${selectedSession.session_id}/${sessionAction}`

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

			// Refresh chains data
			fetchChains()
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
						{chainsLoading ? (
							<div className="flex justify-center items-center h-24">
								<div className="animate-spin rounded-full h-6 w-6 border-t-2 border-indigo-500"></div>
							</div>
						) : (
							<>
								{chains.length === 0 ? (
									<p className="text-center p-2 dark:text-gray-400 text-sm text-gray-700">
										No chains found
									</p>
								) : (
									chains.map(chain => (
										<ChainItem
											key={chain.chain_id}
											chain={chain}
											isExpanded={expandedChainIds.has(chain.chain_id)}
											onToggle={() => toggleChainExpansion(chain.chain_id)}
											onSelectSession={handleSessionSelect}
											selectedSessionId={selectedSession?.session_id || null}
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
						{selectedChain ? `Chain: ${selectedChain.chain_id}` : 'Chat Window'}
						{selectedSession && ` - Session: ${selectedSession.session_id}`}
					</h2>
				</div>

				{/* Chat Messages Container */}
				<div
					ref={messagesContainerRef}
					className="flex-grow overflow-hidden dark:bg-[#0f172a] bg-white"
				>
					{selectedSession?.chat_id ? (
						<ChatMessages
							chatId={selectedSession.chat_id}
							accessToken={auth.user?.accessToken || ''}
						/>
					) : (
						<div className="flex justify-center items-center h-full">
							<p className="text-center p-2 dark:text-gray-400 text-sm text-gray-700">
								Select a session to view messages
							</p>
						</div>
					)}
				</div>

				{/* Chat Input */}
				{selectedSession && (
					<div className="dark:bg-[#162040] flex justify-center items-center py-2 border-t border-gray-700 bg-white">
						<button
							className="px-4 py-2 dark:bg-[#1e293b] dark:text-white rounded-md shadow-md text-sm bg-blue-200 text-black
							dark:hover:bg-[#334155] transition-colors hover:bg-blue-light-500"
							onClick={() => setIsEndSessionModalOpen(true)}
						>
							Escalate Session
						</button>
					</div>
				)}

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
