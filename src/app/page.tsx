'use client';

import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

type Book = {
  Title: string;
  Authors: string[];
  EditionNumber: string;
};

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEdition, setCurrentEdition] = useState<string | null>(null);
  const [subject, setSubject] = useState<string>('');
  const [searchTriggered, setSearchTriggered] = useState<boolean>(false);

  // Fetch books by subject
  const fetchBooks = async (subject: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/books?subject=${subject}`);
      if (!response.ok) throw new Error('Failed to fetch books');
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Trigger search when subject changes
  useEffect(() => {
    if (searchTriggered) {
      fetchBooks(subject);
      setSearchTriggered(false);
    }
  }, [searchTriggered, subject]);

  // Open modal to borrow book
  const handleBorrow = (editionNumber: string) => {
    setCurrentEdition(editionNumber);
    setIsModalOpen(true);
  };

  // Handle the schedule form submission
  const handleScheduleSubmit = async () => {
    if (!selectedDateTime) {
      alert('Please select a date and time for pickup!');
      return;
    }

    const scheduleDateTime = selectedDateTime.toISOString();

    try {
      const response = await fetch('http://localhost:8080/api/pickup-schedule/create', {
        method: 'POST',
        body: JSON.stringify({
          edition_number: currentEdition,
          datetime: scheduleDateTime,
        }),
      });

      if (!response.ok) throw new Error('Failed to schedule pickup');
      const data = await response.json();
      alert(data.Message);
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert('An error occurred while scheduling the pickup.');
    }
  };

  // Trigger search function
  const handleSearch = () => {
    setSearchTriggered(true);
  };

  // Handle key press for search
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Book List</h1>

      {/* Search bar */}
      <div className="mb-6 text-center">
        <input
          type="text"
          placeholder="Search by Subject"
          value={subject}
          onKeyDown={handleKeyDown}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full sm:w-1/2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Search button */}
      <div className="text-center">
        <button
          onClick={handleSearch}
          className="ml-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>

      {/* Book List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {books.length > 0 ? (
          books.map((book, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-lg font-semibold">{book.Title}</h2>
              <p className="text-sm text-gray-600">
                <strong>Authors:</strong>{' '}
                {book.Authors.length > 0 ? book.Authors.join(', ') : 'Unknown Author'}
              </p>
              {book.EditionNumber && (
                <p className="text-sm text-gray-600">
                  <strong>Edition Number:</strong> {book.EditionNumber}
                </p>
              )}
              <div className="mt-4 flex flex-col items-start space-y-4">
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  onClick={() => handleBorrow(book.EditionNumber)}
                >
                  Borrow
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex justify-center items-center">
            <p className="text-center text-lg">No books found for the selected subject.</p>
          </div>
        )}
      </div>


      {/* Modal for schedule pickup */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        contentLabel="Select Pickup DateTime"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-xl font-semibold mb-4">Select Pickup Date and Time</h2>
          <DatePicker
            selected={selectedDateTime}
            onChange={(date: Date | null) => setSelectedDateTime(date)} // Allow null as the date value
            showTimeSelect
            timeIntervals={15}
            dateFormat="Pp"
            className="w-full p-2 border rounded-lg mb-4"
          />

          {/* Action buttons */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleScheduleSubmit}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Submit Schedule
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
