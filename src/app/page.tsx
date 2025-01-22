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

  useEffect(() => {
    Modal.setAppElement('#root'); // Set app root for accessibility
    if (searchTriggered) {
      fetchBooks(subject);
      setSearchTriggered(false);
    }
  }, [searchTriggered, subject]);

  const handleBorrow = (editionNumber: string) => {
    setCurrentEdition(editionNumber);
    setIsModalOpen(true);
  };

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

  const handleSearch = () => {
    setSearchTriggered(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="container mx-auto p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Book List</h1>

      <div className="mb-6 text-center">
        <input
          type="text"
          placeholder="Search by Subject"
          value={subject}
          onKeyDown={handleKeyDown}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full sm:w-80 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="text-center">
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Search
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {books.filter(book => book.EditionNumber).length > 0 ? (
          books.filter(book => book.EditionNumber).map((book, index) => (
            <div
              key={index}
              className="p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{book.Title}</h2>
              <p className="text-sm text-gray-600">
                <strong>Authors:</strong> {book.Authors.length > 0 ? book.Authors.join(', ') : 'Unknown Author'}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Edition Number:</strong> {book.EditionNumber}
              </p>
              <div className="mt-6">
                <button
                  className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition duration-200"
                  onClick={() => handleBorrow(book.EditionNumber)}
                >
                  Borrow
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex justify-center items-center">
            <p className="text-center text-lg text-gray-600">No books with the subject found.</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="fixed inset-0 flex justify-center items-center z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        contentLabel="Select Pickup DateTime"
      >
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Select Pickup Date and Time</h2>
          <DatePicker
            selected={selectedDateTime}
            onChange={(date: Date | null) => setSelectedDateTime(date)}
            showTimeSelect
            timeIntervals={15}
            dateFormat="Pp"
            className="w-full p-3 border border-gray-300 rounded-lg mb-6"
          />

          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-5 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleScheduleSubmit}
              className="px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
            >
              Submit Schedule
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
