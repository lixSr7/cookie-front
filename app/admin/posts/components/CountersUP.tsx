'use client'
import CountUp from "react-countup";

function CountersUP() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Counter />
      <Counter />
      <Counter />
    </div>
  );
}

function Counter() {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-violet-500 text-white p-16 rounded-md text-xl font-bold">
      + <CountUp start={0} end={1000} duration={3} separator="," />
      <span className="ml-2">posts</span>
    </div>
  );
}

export default CountersUP;
