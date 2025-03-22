'use client'
import React from 'react'
import ComponentCard from '../../common/ComponentCard'
import Form from '../Form'
import Input from '../input/InputField'
import Button from '../../ui/button/Button'
import Select from '../Select'

interface Option {
	value: string
	label: string
}

export default function BasicForm() {
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		console.log('Form submitted:')
	}

	const opts: Option[] = [
		{ label: 'HR', value: 'hr' },
		{ label: 'Employee', value: 'employee' },
	]

	const handleSelChange = (e: any) => {
		console.log(e)
	}
	return (
		<ComponentCard title="Add New User">
			<Form onSubmit={handleSubmit}>
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
					<div>
						<Input type="text" placeholder="Name" />
					</div>
					<div>
						<Input type="text" placeholder="Email address" />
					</div>
					<div className="col-span-full">
						<Input type="text" placeholder="Password" />
					</div>
					<div className="col-span-full">
						<Input type="text" placeholder="Confirm Password" />
					</div>
					<div className="col-span-full">
						<Select
							options={opts}
							placeholder="Select an option"
							onChange={val => handleSelChange}
							defaultValue="employee"
						/>
					</div>
					<div className="col-span-full">
						<Button className="w-full" size="sm">
							Submit
						</Button>
					</div>
				</div>
			</Form>
		</ComponentCard>
	)
}
