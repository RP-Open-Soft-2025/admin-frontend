'use client'
import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { ChatResp, MessageResp, SenderType } from '@/types/chat'
import { API_URL, WS_URL } from '@/constants'
import store from '@/redux/store'
import { Role } from '@/types/employee'

type SessionHist = {
	chat_id: string
	last_message: string
	last_message_time: string // ISO timestamp
	unread_count: number
	total_messages: number
	chat_mode: 'BOT' | 'HUMAN' // Assuming only these two modes
	is_escalated: boolean
	created_at: string // ISO timestamp
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
					{chat.chat_id}
				</h3>
				<span className="text-xs dark:text-gray-400 text-gray-600">
					{new Date(chat.last_message_time).toLocaleDateString()}
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
	const [newMessage, setNewMessage] = useState('')
	const chatEndRef = useRef<HTMLDivElement>(null)
	const messagesContainerRef = useRef<HTMLDivElement>(null)
	const { auth } = store.getState()
	const [isLoading, setIsLoading] = useState(true)
	const [takeOver, setTakeOver] = useState<boolean>(false)
	const [sidebarOpen, setSidebarOpen] = useState(true) // Default to open to match UI
	const [sessions, setSessions] = useState<SessionHist[]>([])
	const [historyLoading, setHistoryLoading] = useState(false)

	// Scroll to latest message
	useEffect(() => {
		if (chatEndRef.current) {
			chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
		}
	}, [messages])

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

		const fetchChatHistory = async (chatId: string, timestamp: string) => {
			setIsLoading(true)
			try {
				const resp = await fetch(`${API_URL}/chat/history/${chatId}`, {
					method: 'GET',
					headers: { Authorization: `Bearer ${auth.user?.accessToken}` },
				})
				if (resp.ok) {
					const data: ChatResp = await resp.json()
					setMessages(prev => [
						...prev,
						{ timestamp: timestamp, text: chatId, sender: SenderType.SYSTEM },
						...data.messages,
					])
				}
			} catch (error) {
				console.error('Error fetching chat history:', error)
			} finally {
				setIsLoading(false)
			}
		}

		const fetchSessionHistory = async () => {
			try {
				const resp = await fetch(`${API_URL}/llm/chat/history/${id}`, {
					method: 'GET',
					headers: { Authorization: `Bearer ${auth.user?.accessToken}` },
				})
				if (resp.ok) {
					const data: SessionHist[] = await resp.json()
					data.sort(
						(a: SessionHist, b: SessionHist) =>
							new Date(a.last_message_time).getTime() -
							new Date(b.last_message_time).getTime()
					)
					setSessions(data)
					await Promise.all(
						data.map(session =>
							fetchChatHistory(session.chat_id, session.created_at)
						)
					)
				}
			} catch (error) {
				console.error('Error fetching session history:', error)
			} finally {
				setHistoryLoading(false)
			}
		}

		fetchSessionHistory()
	}, [auth.user, id])

	useEffect(() => {
		const ws = new WebSocket(WS_URL + '/llm/chat/ws/llm/' + id)

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
	}, [id])

	// Handle message sending
	const sendMessage = () => {
		if (newMessage.trim() !== '') {
			console.log(API_URL)
			fetch(`${API_URL}/chat/message-to-employee`, {
				method: 'POST',
				headers: {
					'Content-type': 'Application/json',
					Authorization: `Bearer ${auth.user?.accessToken}`,
				},
				body: JSON.stringify({
					chatId: id,
					message: newMessage.trim(),
				}),
			}).then(resp => {
				if (resp.ok) {
					const message: MessageResp = {
						sender: SenderType.HR,
						text: newMessage.trim(),
						timestamp: new Date().toISOString(),
					}
					setMessages(prevMessages => [...prevMessages, message])
					setNewMessage('')
				}
			})
		}
	}

	// Send message on Enter key press
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			sendMessage()
		}
	}

	const initTakeOver = () => {
		console.log('Chat Taken Over')
		setTakeOver(true)
	}

	const navigateToChat = (chatId: string) => {
		// Here you would typically use a router to navigate
		window.location.href = `/chat-page/${chatId}`
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
								{messages.map((message, index) => (
									<MessageComp key={index} message={message} />
								))}
								<div ref={chatEndRef} className="h-1" />
							</>
						)}
					</div>
				</div>

				{/* Chat Input */}
				{auth.user?.userRole == Role.HR && takeOver ? (
					<div className="p-2 bg-[#162040] border-t border-gray-700">
						<div className="flex space-x-2">
							<input
								type="text"
								className="flex-grow p-2 rounded dark:bg-[#1e293b] bg-white
                border border-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white text-sm"
								value={newMessage}
								onChange={e => setNewMessage(e.target.value)}
								onKeyDown={handleKeyDown}
								placeholder="Type your message..."
							/>
							<button
								className="px-3 py-2 bg-indigo-500 text-white rounded text-sm
                hover:bg-indigo-600 transition-colors"
								onClick={sendMessage}
							>
								Send
							</button>
						</div>
					</div>
				) : (
					<div className="dark:bg-[#162040] flex justify-center items-center py-2 border-t border-gray-700 bg-white">
						<button
							className="px-4 py-2 dark:bg-[#1e293b] dark:text-white rounded-md shadow-md text-sm bg-blue-200 text-black
              dark:hover:bg-[#334155] transition-colors hover:bg-blue-light-500"
							onClick={() => initTakeOver()}
						>
							TakeOver
						</button>
					</div>
				)}
			</div>
		</div>
	)
}

export default ChatPage
