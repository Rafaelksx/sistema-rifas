// frontend/src/components/raffles/NumberGrid.jsx
import React from 'react';

const NumberGrid = ({ total, occupied, onSelect, selectedNumber }) => {
  const numbers = Array.from({ length: total }, (_, i) => 
    i.toString().padStart(2, '0') // Convierte 1 en "01", 2 en "02", etc.
  );

  return (
    <div className="grid grid-cols-5 md:grid-cols-10 gap-2 p-4 bg-gray-100 rounded-lg">
      {numbers.map((num) => {
        const isOccupied = occupied.includes(num);
        const isSelected = selectedNumber === num;

        return (
          <button
            key={num}
            disabled={isOccupied}
            onClick={() => onSelect(num)}
            className={`
              h-12 w-full rounded-md font-bold text-sm transition-all
              ${isOccupied ? 'bg-red-500 text-white cursor-not-allowed opacity-50' : 
                isSelected ? 'bg-yellow-500 text-black scale-110 border-2 border-black' : 
                'bg-white text-blue-900 hover:bg-blue-100 border border-blue-200'}
            `}
          >
            {num}
          </button>
        );
      })}
    </div>
  );
};

export default NumberGrid;