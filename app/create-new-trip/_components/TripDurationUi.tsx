"use client";

import { useState } from "react";

function TripDuration({ onSelectedOption }: { onSelectedOption: (value: string) => void }) {
  const [days, setDays] = useState(3);

  const increment = () => setDays(days + 1);
  const decrement = () => setDays(days > 1 ? days - 1 : 1);

  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-2xl shadow-lg bg-white w-80">
      <h2 className="text-lg font-semibold mb-4 text-center">
        How many days do you want to travel?
      </h2>

      <div className="flex items-center space-x-6 mb-4">
        <button
          onClick={decrement}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-200 transition"
        >
          –
        </button>

        <span className="text-xl font-bold">{days} Days</span>

        <button
          onClick={increment}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-200 transition"
        >
          +
        </button>
      </div>

      <button
        onClick={() => onSelectedOption(days + " Days")}
        className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition"
      >
        Confirm
      </button>
    </div>
  );
}

export default TripDuration;
