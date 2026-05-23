import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm animate-pulse min-w-[280px]">
      <div className="bg-gray-200 aspect-square rounded-xl mb-4" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
      <div className="flex justify-between items-center">
        <div className="h-6 bg-gray-200 rounded w-1/4" />
        <div className="h-10 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  );
};

export default SkeletonCard;
