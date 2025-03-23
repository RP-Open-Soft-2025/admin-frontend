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
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('Authentication token not found');
            }

            const response = await fetch('http://backend-deployment-792.as.r.appspot.com/admin/create-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
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
        console.log('Request made');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const opts: Option[] = [
        { label: 'HR', value: 'hr' },
        { label: 'Employee', value: 'employee' }
    ];

    const handleSelChange = (value: string) => {
        setFormData((prev) => ({ ...prev, role: value }));
    };

    return (
        <ComponentCard title='Add New User'>
            <Form onSubmit={handleSubmit}>
                <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                    <Input type='text' placeholder='Name' name='name' onChange={handleChange} />
                    <Input type='text' placeholder='Email address' name='email' onChange={handleChange} />
                    <Input type='text' placeholder='Employee Id' name='employee_id' onChange={handleChange} />
                    <Input type='text' placeholder='Manager Id' name='manager_id' onChange={handleChange} />
                    <Input type='password' placeholder='Password' name='password' onChange={handleChange} />
                    <Select options={opts} placeholder='Select an option' onChange={handleSelChange} defaultValue='employee' />
                    <Button className='w-full' size='sm'>Submit</Button>
                </div>
            </Form>
        </ComponentCard>
    );
}
