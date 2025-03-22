import { type Order } from '@/components/tables/EmployeeTable'

export const orders: Order[] = [
	{
		id: 1,
		name: 'Alice Johnson',
		email: 'alice.johnson@example.com',
		emp_id: 'EMP1001',
		role: 'Admin',
		is_blocked: false,
	},
	{
		id: 2,
		name: 'Bob Smith',
		email: 'bob.smith@example.com',
		emp_id: 'EMP1002',
		role: 'Employee',
		is_blocked: false,
	},
	{
		id: 3,
		name: 'Charlie Brown',
		email: 'charlie.brown@example.com',
		emp_id: 'EMP1003',
		role: 'HR',
		is_blocked: true,
	},
	{
		id: 4,
		name: 'David Williams',
		email: 'david.williams@example.com',
		emp_id: 'EMP1004',
		role: 'Employee',
		is_blocked: false,
	},
	{
		id: 5,
		name: 'Eve Adams',
		email: 'eve.adams@example.com',
		emp_id: 'EMP1005',
		role: 'Employee',
		is_blocked: true,
	},
] 