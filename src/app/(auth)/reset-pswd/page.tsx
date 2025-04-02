'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from '@/components/ui/sonner'

const page: React.FC = () => {
	const router = useRouter()

	useEffect(() => {
		toast({
			type: 'error',
			description: 'Your empty reset password token.',
		})
		router.push('/login')
	}, [router])

	return null
}

export default page
