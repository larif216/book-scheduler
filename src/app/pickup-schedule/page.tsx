'use client';

import { useEffect, useState } from 'react';

type Schedule = {
  ID: number;
  Book: {
    Title: string;
    Authors: string[];
    EditionNumber: string;
    IsAvailable: boolean;
  };
  DateTime: string;
};

export default function PickupSchedule() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPickupSchedules = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/pickup-schedule');
      if (!response.ok) throw new Error('Failed to fetch pickup schedules');
      const data = await response.json();
      setSchedules(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPickupSchedules();
  }, []);

  return (
    <div className="container mx-auto p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
        Book Pickup Schedules
      </h1>

      {loading ? (
        <div className="flex justify-center items-center">
          <div className="w-16 h-16 border-4 border-t-4 border-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : schedules.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {schedules.map((schedule) => (
            <div
              key={schedule.ID}
              className="p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {schedule.Book.Title}
              </h2>
              <p className="text-sm text-gray-600">
                <strong>Authors:</strong>{' '}
                {schedule.Book.Authors.length > 0
                  ? schedule.Book.Authors.join(', ')
                  : 'Unknown Author'}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Edition Number:</strong> {schedule.Book.EditionNumber}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Pickup Date & Time:</strong>{' '}
                {new Date(schedule.DateTime).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <p className="text-lg text-gray-600">No pickup schedules found.</p>
        </div>
      )}
    </div>
  );
}
