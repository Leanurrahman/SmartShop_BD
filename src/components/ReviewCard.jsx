import React from 'react';
import { Star, User } from 'lucide-react';

const ReviewCard = ({ review }) => {
  return (
    <div className="bg-white dark:bg-accent border dark:border-gray-800 rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <User className="text-gray-400 w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm">{review.userName || 'Verified Buyer'}</h4>
            <p className="text-xs text-gray-400">{new Date(review.createdAt?.seconds * 1000).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-orange-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : ''}`} />
          ))}
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm italic">"{review.comment}"</p>
    </div>
  );
};

export default ReviewCard;
