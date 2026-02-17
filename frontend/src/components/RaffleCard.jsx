import { Calendar, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';

const RaffleCard = ({ raffle }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{raffle.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{raffle.description}</p>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            <span>{new Date(raffle.drawDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Ticket size={16} />
            <span>{raffle.totalNumbers} números</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-2xl font-black text-blue-600">${raffle.price}</span>
          <Link 
            to={`/raffle/${raffle._id}`}
            className="bg-gray-900 text-white px-4 py-2 rounded-xl font-medium hover:bg-gray-800 transition"
          >
            Ver Boletos
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RaffleCard;