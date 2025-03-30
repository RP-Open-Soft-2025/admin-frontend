'use client'
import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { ChatResp, MessageResp, SenderType } from '@/types/chat'
import { API_URL, WS_URL } from '@/constants'
import store from '@/redux/store'
import { Role } from '@/types/employee'

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

// Chat history item component
const ChatHistoryItem = ({ 
  chat, 
  isActive, 
  onClick 
}: { 
  chat: { id: string; name: string; lastMessage?: string; timestamp: string }; 
  isActive: boolean; 
  onClick: () => void 
}) => {
  return (
    <div 
      className={`p-2 cursor-pointer border-b border-gray-700 hover:bg-[#172040] ${
        isActive ? 'bg-[#172040]' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-white text-sm">{chat.name}</h3>
        <span className="text-xs text-gray-400">
          {new Date(chat.timestamp).toLocaleDateString()}
        </span>
      </div>
      {chat.lastMessage && (
        <p className="text-xs text-gray-400 truncate mt-1">
          {chat.lastMessage}
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
  const [chatHistory, setChatHistory] = useState<Array<{
    id: string;
    name: string;
    lastMessage?: string;
    timestamp: string;
  }>>([])
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
	}, [id])

  // Fetch all chat histories for sidebar
  useEffect(() => {
    if (auth.user?.userRole === Role.HR) {
      setHistoryLoading(true)
      fetch(`${API_URL}/chat/all-histories`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${auth.user?.accessToken}`,
        },
      })
        .then(resp => {
          if (resp.ok) {
            return resp.json()
          }
          return []
        })
        .then(data => {
          setChatHistory(data)
          setHistoryLoading(false)
        })
        .catch(() => {
          setHistoryLoading(false)
        })
    }
  }, [auth.user])

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
    window.location.href = `/chat/${chatId}`
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

	return (
    <div className="flex h-[80vh] w-full bg-[#0f172a]">
      {/* Left Sidebar - Always present but may be collapsed */}
      <div 
        className={`transition-all duration-300 ease-in-out border-r border-gray-700 ${
          sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
        }`}
      >
        {/* Sidebar Content */}
        <div className="h-full bg-[#0f172a] text-white flex flex-col">
          <div className="p-2 border-b border-gray-700 flex items-center">
            <h2 className="text-lg font-bold">Chat History</h2>
          </div>
          
          <div className="overflow-y-auto flex-grow">
            {historyLoading ? (
              <div className="flex justify-center items-center h-24">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-indigo-500"></div>
              </div>
            ) : (
              <>
                {chatHistory.length === 0 ? (
                  <p className="text-center p-2 text-gray-400 text-sm">No chat history found</p>
                ) : (
                  chatHistory.map(chat => (
                    <ChatHistoryItem
                      key={chat.id}
                      chat={chat}
                      isActive={chat.id === id}
                      onClick={() => navigateToChat(chat.id)}
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
        <div className="flex items-center p-2 bg-[#0f172a] border-b border-gray-700 text-white">
          <button
            className="mr-3 text-gray-300 hover:text-white focus:outline-none"
            onClick={toggleSidebar}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h2 className="text-lg font-bold text-center flex-grow">Chat Window</h2>
        </div>

        {/* Chat Messages Container */}
        <div
          ref={messagesContainerRef}
          className="flex-grow overflow-hidden bg-[#0f172a]"
        >
          <div
            className="h-full overflow-y-auto flex flex-col space-y-2 p-3"
          >
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
                className="flex-grow p-2 rounded bg-[#1e293b] 
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
          <div className="bg-[#162040] flex justify-center items-center py-2 border-t border-gray-700">
            <button
              className="px-4 py-2 bg-[#1e293b] text-white rounded-md shadow-md text-sm
              hover:bg-[#334155] transition-colors"
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