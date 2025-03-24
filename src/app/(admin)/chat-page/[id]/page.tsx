'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

const ChatPage = () => {
	const params = useParams()
	const id = params.id as string
	const [messages, setMessages] = useState([]) // eslint-disable-line @typescript-eslint/no-unused-vars
	const [newMessage, setNewMessage] = useState('') 
	const [socket, setSocket] = useState(null) // eslint-disable-line @typescript-eslint/no-unused-vars

	useEffect(() => {}, [id])

	const sendMessage = () => {
		if (newMessage.trim() !== '') {
			setNewMessage('')
		}
	}

	return (
		<div className="flex h-full">
			<div className="w-1/4 bg-gray-200 p-4">
				<h2 className="text-xl font-bold mb-4">Chat History</h2>
				{/* Chat session history sidebar */}
				{/* Add your chat session history logic here */}
			</div>
			<div className="w-3/4 flex flex-col">
				<div className="flex-1 p-4 overflow-y-auto">
					<h2 className="text-xl font-bold mb-4">Chat Window</h2>
					<div className="space-y-4">
						{messages.map((message, index) => (
							<div key={index} className="p-2 bg-gray-100 rounded">
								{message}
							</div>
						))}
					</div>
				</div>
				<div className="p-4 bg-gray-300">
					<input
						type="text"
						className="w-full p-2 rounded"
						value={newMessage}
						onChange={e => setNewMessage(e.target.value)}
						placeholder="Type your message..."
					/>
					<button
						className="mt-2 p-2 bg-blue-500 text-white rounded"
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
