'use client'
import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, addDays } from 'date-fns';

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);

    const header = () => {
        const dateFormat = 'MMMM yyyy';
        return (
            <div className='flex justify-center items-center mb-4'>
                <h2 className='text-lg font-semibold'>{format(currentDate, dateFormat)}</h2>
            </div>
        );
    };

    const dates = () => {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(monthStart);
        const daysInMonth = [];
        let day = monthStart;

        while (day <= monthEnd) {
            daysInMonth.push(
                <div 
                    key={day.toISOString()} 
                    className='p-4 text-center border cursor-pointer hover:bg-gray-200' 
                    onClick={() => setSelectedDate(day)}
                >
                    {format(day, 'd')}
                </div>
            );
            day = addDays(day, 1);
        }

        return <div className='grid grid-cols-7 gap-2 w-full h-full'>{daysInMonth}</div>;
    };

    const sessionBox = () => (
        <div className='mt-4 p-4 bg-gray-100 border rounded-lg w-full'>
            {selectedDate ? (
                <div>
                    <h3 className='text-md font-semibold mb-2'>Sessions on {format(selectedDate, 'MMMM d, yyyy')}:</h3>
                    <ul className='list-disc ml-4'>
                        <li>Candidate 1</li>
                        <li>Candidate 2</li>
                        <li>Candidate 3</li>
                    </ul>
                </div>
            ) : (
                <p>Select a date to view scheduled sessions.</p>
            )}
        </div>
    );

    return (
        <div className='w-full h-full flex justify-center items-center p-4 bg-white shadow-lg rounded-lg'>
            <div className='w-full h-full max-w-3xl'>
                {header()}
                {dates()}
                {sessionBox()}
            </div>
        </div>
    );
};

export default Calendar;
