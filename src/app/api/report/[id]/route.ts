import { NextRequest, NextResponse } from 'next/server'

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	const id = params.id

	try {
		// Fetch from Google Cloud Storage
		const response = await fetch(
			`https://storage.googleapis.com/opensoft-reports/${id}.md`,
			{
				method: 'GET',
				headers: {
					Accept: 'text/markdown, text/plain, */*',
				},
			}
		)

		if (!response.ok) {
			return NextResponse.json(
				{ error: `Failed to fetch report: ${response.status}` },
				{ status: response.status }
			)
		}

		const text = await response.text()

		// Return the markdown content
		return new NextResponse(text, {
			headers: {
				'Content-Type': 'text/markdown',
				'Cache-Control': 'public, max-age=3600',
			},
		})
	} catch (error) {
		console.error('Error fetching report:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch report' },
			{ status: 500 }
		)
	}
}
