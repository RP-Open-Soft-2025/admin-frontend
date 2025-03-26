'use client'
import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { ChatResp, MessageResp, SenderType } from '@/types/chat'
import { API_URL } from '@/constants'
import store from '@/redux/store'

const MessageComp = ({ message }: { message: MessageResp }) => {
	const { sender, text, timestamp } = message

	// Dynamic styling based on sender
	const messageStyles = {
		[SenderType.EMPLOYEE]: {
			container: 'justify-start',
			bg: 'bg-blue-100 dark:bg-blue-900',
			textColor: 'text-gray-800 dark:text-blue-100',
		},
		[SenderType.BOT]: {
			container: 'justify-end',
			bg: 'bg-green-100 dark:bg-green-900',
			textColor: 'text-gray-800 dark:text-green-100',
		},
		[SenderType.HR]: {
			container: 'justify-end',
			bg: 'bg-indigo-100 dark:bg-indigo-900',
			textColor: 'text-gray-800 dark:text-indigo-100',
		},
	}

	const { container, bg, textColor } = messageStyles[sender]

	return (
		<div className={`flex ${container} w-full`}>
			<div
				className={`max-w-[70%] ${bg} p-3 rounded-xl shadow-sm ${textColor}`}
			>
				<div className="flex justify-between items-center mb-1">
					<span className="text-xs font-semibold opacity-70">
						{sender === SenderType.EMPLOYEE
							? 'Employee'
							: sender === SenderType.BOT
								? 'Bot'
								: 'HR'}
					</span>
					<span className="text-xs opacity-50 ml-2">
						{new Date(timestamp).toLocaleTimeString([], {
							hour: '2-digit',
							minute: '2-digit',
						})}
					</span>
				</div>
				<p className="text-sm font-medium">{text}</p>
			</div>
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

	// Scroll to latest message
	useEffect(() => {
		if (chatEndRef.current) {
			chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
		}
	}, [messages])

	// Fetch chat history
	useEffect(() => {
		setIsLoading(true)
		fetch(`${API_URL}/chat/history/${id}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${auth.user?.accessToken}`,
			},
		})
			.then(resp => {
				if (resp.ok) {
					resp.json().then((data: ChatResp) => {
						setMessages(data.messages)
						setIsLoading(false)
					})
				} else {
					setIsLoading(false)
				}
			})
			.catch(() => {
				setIsLoading(false)
			})
	}, [])

	// Handle message sending
	const sendMessage = () => {
		if (newMessage.trim() !== '') {
			const message: MessageResp = {
				sender: SenderType.HR,
				text: newMessage.trim(),
				timestamp: new Date().toISOString(),
			}
			setMessages(prevMessages => [...prevMessages, message])
			setNewMessage('')
		}
	}

	// Send message on Enter key press
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			sendMessage()
		}
	}

	return (
		<div className="flex flex-col h-[85vh] w-full">
			{/* Chat Header */}
			<div className="p-4 bg-gray-100 dark:bg-gray-800 border-b">
				<h2 className="text-xl font-bold text-center dark:text-white">
					Chat Window
				</h2>
			</div>

			{/* Chat Messages Container */}
			<div
				ref={messagesContainerRef}
				className="flex-grow overflow-hidden p-4 bg-white dark:bg-gray-900"
			>
				<div
					className="h-full overflow-y-auto flex flex-col space-y-3"
					style={{ display: 'flex', flexDirection: 'column' }}
				>
					{isLoading ? (
						<div className="flex justify-center items-center h-full">
							<div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-500"></div>
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
			<div className="p-4 bg-gray-100 dark:bg-gray-800 border-t">
				<div className="flex space-x-2">
					<input
						type="text"
						className="flex-grow p-2 rounded bg-white dark:bg-gray-700 
						border dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
						value={newMessage}
						onChange={e => setNewMessage(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder="Type your message..."
					/>
					<button
						className="px-4 py-2 bg-indigo-500 text-white rounded 
						hover:bg-indigo-600 transition-colors"
						onClick={sendMessage}
					>
						Send
					</button>
				</div>
			</div>
		</div>
	)
}

export default ChatPage
