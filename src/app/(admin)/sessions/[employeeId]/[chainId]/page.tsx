'use client'
import { useState, useEffect, useRef, FormEvent } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { MessageResp, SenderType } from '@/types/chat'
import { API_URL, WS_URL } from '@/constants'
import store from '@/redux/store'
import { toast } from '@/components/ui/sonner'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui'

// Message component for rendering individual chat messages
const MessageComp = ({ message }: { message: MessageResp }) => {
  const { sender, text, timestamp } = message

  // Dynamic styling based on sender
  const messageStyles = {
    [SenderType.EMPLOYEE]: {
      container: 'justify-start',
      bg: 'bg-blue-100 dark:bg-blue-900/70',
      textColor: 'text-blue-900 dark:text-blue-100',
      border: 'border-blue-200 dark:border-blue-800',
      icon: '👤'
    },
    [SenderType.BOT]: {
      container: 'justify-end',
      bg: 'bg-green-100 dark:bg-green-900/70',
      textColor: 'text-green-900 dark:text-green-100',
      border: 'border-green-200 dark:border-green-800',
      icon: '🤖'
    },
    [SenderType.HR]: {
      container: 'justify-end',
      bg: 'bg-purple-100 dark:bg-purple-900/70',
      textColor: 'text-purple-900 dark:text-purple-100',
      border: 'border-purple-200 dark:border-purple-800',
      icon: '👨‍💼'
    },
    [SenderType.SYSTEM]: {
      container: 'justify-center',
      bg: 'bg-gray-200 dark:bg-gray-800/80',
      textColor: 'text-gray-700 dark:text-gray-300',
      border: 'border-gray-300 dark:border-gray-700',
      icon: '🔔'
    },
  }

  const { container, bg, textColor, border, icon } = messageStyles[sender]

  return (
    <div className={`flex ${container} w-full mb-4`}>
      <div
        className={`${
          sender === SenderType.SYSTEM
            ? 'max-w-max px-4 py-2 rounded-lg text-sm font-semibold border'
            : 'max-w-[75%] p-3 rounded-xl shadow-sm border'
        } ${bg} ${textColor} ${border} transition-all duration-200 hover:shadow-md`}
      >
        {sender !== SenderType.SYSTEM && (
          <div className="flex justify-between items-center mb-1 pb-1 border-b border-opacity-20 dark:border-opacity-20" style={{ borderColor: 'currentColor' }}>
            <span className="text-xs font-semibold opacity-80 flex items-center gap-1">
              {icon} {sender === SenderType.EMPLOYEE
                ? 'Employee'
                : sender === SenderType.BOT
                ? 'Bot'
                : sender === SenderType.HR
                ? 'HR'
                : ''}
            </span>
            <span className="text-xs opacity-70 ml-2">
              {new Date(timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        )}
        <p className="text-sm font-medium text-left whitespace-pre-wrap">{text}</p>
      </div>
    </div>
  )
}

// Main chat page component
export default function SessionChatPage() {
  const params = useParams()
  const employeeId = params.employeeId as string
  const chainId = params.chainId as string
  const [messages, setMessages] = useState<MessageResp[]>([])
  const chatEndRef = useRef<HTMLDivElement>(null)
  const { auth } = store.getState()
  const [isLoading, setIsLoading] = useState(true)
  const [chatId, setChatId] = useState<string>('')
  const [sessionDetails, setSessionDetails] = useState<any>(null)
  const [messageInput, setMessageInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const router = useRouter()

  // Scroll to latest message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // Fetch chat history and session details
  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        // First fetch session details by chain ID
        const sessionResponse = await fetch(`${API_URL}/admin/chains/${chainId}/details`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${auth.user?.accessToken}`,
            'Content-Type': 'application/json',
          },
        })

        if (!sessionResponse.ok) {
          throw new Error(`HTTP error! status: ${sessionResponse.status}`)
        }

        const sessionData = await sessionResponse.json()
        setSessionDetails(sessionData)
        
        // Check if we have a chat_id in the session data
        if (sessionData && sessionData.chat_id) {
          setChatId(sessionData.chat_id)
          await fetchChatHistory(sessionData.chat_id)
        } else {
          console.error('No chat ID found in session data')
          toast({
            type: 'error',
            description: 'Could not find chat associated with this session',
          })
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Error fetching session details:', error)
        toast({
          type: 'error',
          description: 'Failed to load session details. Please try again.',
        })
        setIsLoading(false)
      }
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
        console.log('Chat history data received')

        if (data && data.chatId && Array.isArray(data.messages)) {
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
        setIsLoading(false)
      }
    }

    if (chainId) {
      fetchSessionDetails()
    }
  }, [auth.user, chainId, employeeId])

  // Set up websocket connection for real-time messages
  useEffect(() => {
    if (!chatId) return
    
    const ws = new WebSocket(`${WS_URL}/llm/chat/ws/llm/${chatId}`)

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
  }, [chatId])

  // Function to send a message
  const sendMessage = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!messageInput.trim() || !chatId) return
    
    setIsSending(true)
    
    try {
      const response = await fetch(`${API_URL}/chat/message`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth.user?.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId: chatId,
          sender: SenderType.HR,
          message: messageInput.trim(),
        }),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      // Add optimistic message (will be updated from WebSocket if needed)
      setMessages(prev => [
        ...prev,
        {
          sender: SenderType.HR,
          text: messageInput.trim(),
          timestamp: new Date().toISOString(),
        },
      ])
      
      // Clear input
      setMessageInput('')
    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        type: 'error',
        description: 'Failed to send message. Please try again.',
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="flex flex-col h-[80vh] w-full dark:bg-[#0f172a] bg-white">
      {/* Header with session info */}
      <div className="mb-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>
                Session Chat - Employee {employeeId}
              </CardTitle>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/sessions'}
                className="text-sm"
              >
                Back to Sessions
              </Button>
            </div>
            <CardDescription className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">Chain ID:</span> {chainId}
              </div>
              {sessionDetails && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Status:</span> 
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      sessionDetails.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                        : sessionDetails.status === 'pending' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        : sessionDetails.status === 'completed'
                        ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      {sessionDetails.status?.toUpperCase()}
                    </span>
                  </div>
                  {sessionDetails.scheduled_at && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Scheduled:</span> 
                      {new Date(sessionDetails.scheduled_at).toLocaleString()}
                    </div>
                  )}
                  {sessionDetails.session_id && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Session ID:</span> 
                      {sessionDetails.session_id}
                    </div>
                  )}
                </>
              )}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Chat messages container */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 border rounded-md mb-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500 dark:text-gray-400">No messages found</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <MessageComp key={index} message={message} />
          ))
        )}
        <div ref={chatEndRef} />
      </div>
      
      {/* Message input */}
      {!isLoading && sessionDetails && sessionDetails.status === 'active' && (
        <div className="p-4 border-t dark:border-gray-700">
          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a message as HR..."
              className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              disabled={isSending}
            />
            <Button type="submit" disabled={isSending || !messageInput.trim()}>
              {isSending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
              ) : (
                'Send'
              )}
            </Button>
          </form>
        </div>
      )}

      {/* Back button */}
      <div className="p-4">
        <Button 
          onClick={() => window.history.back()}
          variant="outline"
        >
          Back to Sessions
        </Button>
      </div>
    </div>
  )
} 