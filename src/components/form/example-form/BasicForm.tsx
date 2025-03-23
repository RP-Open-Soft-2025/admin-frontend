'use client'
import React from 'react'
import ComponentCard from '../../common/ComponentCard'
import Form from '../Form'
import Input from '../input/InputField'
import Button from '../../ui/button/Button'
import Select from '../Select'
import { useState } from 'react'

interface Option {
	value: string
	label: string
}

export default function BasicForm() {

	const [formData, setFormData] = useState({
		name: '',
		email: '',
		employee_id: '',
		password: '',
		manager_id: '',
		role: 'employee',
	  });


	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const response = await fetch('https://optimal-disk-453109-c9.el.r.appspot.com/admin/create-user', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			if (!response.ok) {
				throw new Error('Failed to create user');
			}

			console.log('User created successfully');
		} catch (error) {
			console.error('Error:', error);
		}
		console.log("req made");
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const opts: Option[] = [
		{ label: 'HR', value: 'hr' },
		{ label: 'Employee', value: 'employee' },
	]

	const handleSelChange = (value: string) => {
		console.log(value)
	}
	return (
		<ComponentCard title="Add New User">
			<Form onSubmit={handleSubmit}>
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
					<div>
						<Input type="text" placeholder="Name" onChange={handleChange} />
					</div>
					<div>
						<Input type="text" placeholder="Email address" onChange={handleChange} />
					</div>
					<div className="col-span-full">
						<Input type="text" placeholder="Employee Id" onChange={handleChange} />
					</div>					
					<div className="col-span-full">
						<Input type="text" placeholder="manager id" onChange={handleChange} />
					</div>
					<div className="col-span-full">
						<Input type="text" placeholder="Password" onChange={handleChange} />
					</div>
					
					<div className="col-span-full">
						<Select
							options={opts}
							placeholder="Select an option"
							onChange={handleSelChange}
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
