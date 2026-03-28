import React from 'react';
import { 
  Ticket, 
  UserPlus, 
  Handshake, 
  Headset, 
  IndianRupee,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

const RecentActivity = ({ activities }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'payment':
        return { icon: IndianRupee, color: 'bg-blue-600', rotate: '' };
      case 'issue_closed':
        return { icon: Ticket, color: 'bg-green-500', rotate: '-rotate-45' };
      case 'issue_opened':
        return { icon: Ticket, color: 'bg-red-500', rotate: '-rotate-45' };
      case 'plan_change':
        return { icon: Headset, color: 'bg-orange-500', rotate: '' };
      case 'user_added':
        return { icon: Handshake, color: 'bg-gray-800', rotate: '' };
      default:
        return { icon: Ticket, color: 'bg-gray-400', rotate: '' };
    }
  };

  const formatDescription = (text) => {
    // Regex to find and highlight dynamic parts (starting with #, @, or all-caps plan names)
    const parts = text.split(/(\#[0-9]+|\@[a-zA-Z0-9_]+|[A-Z]{2,}_[A-Z0-9_]+)/g);
    return parts.map((part, i) => {
      if (part.startsWith('#') || part.startsWith('@') || /^[A-Z]{2,}_[A-Z0-9_]+$/.test(part)) {
        return <span key={i} className="text-sky-500 font-medium">{part}</span>;
      }
      return part;
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
      <div className="p-6 flex justify-between items-center border-b border-gray-50">
        <h2 className="text-xl font-black text-gray-800 tracking-tight">Recent Activity</h2>
        <Link 
          href="/admin/activity" 
          className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1"
        >
          View All
          <ChevronRight size={14} />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activities?.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {activities.map((activity, index) => {
              const { icon: Icon, color, rotate } = getIcon(activity.type);
              return (
                <div 
                  key={activity.id || index} 
                  className="p-5 flex gap-5 hover:bg-gray-50/50 transition-all cursor-pointer group"
                >
                  <div className={`shrink-0 w-12 h-12 ${color} rounded-full flex items-center justify-center shadow-lg shadow-${color.split('-')[1]}-200/50 group-hover:scale-110 transition-transform`}>
                    <Icon size={22} className={`text-white ${rotate}`} />
                  </div>
                  
                  <div className="flex flex-col justify-center gap-1">
                    <p className="text-[15px] font-semibold text-gray-600 leading-tight">
                      {formatDescription(activity.description)}
                    </p>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-10 text-center text-gray-400 flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
              <Ticket size={24} className="text-gray-200" />
            </div>
            <p className="font-medium">No recent activity found</p>
          </div>
        )}
      </div>
      
      {/* Footer / Decorative element */}
      <div className="h-2 bg-gradient-to-r from-blue-500 via-emerald-500 to-indigo-500 opacity-20" />
    </div>
  );
};

export default RecentActivity;
