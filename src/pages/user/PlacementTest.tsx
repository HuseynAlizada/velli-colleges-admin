import { RequestedExams } from '../../types';
import { Clock, Calendar, GraduationCap, Target, PlayCircle } from "lucide-react";
import { format } from "date-fns";
import { Link } from 'react-router-dom';

const PlacementTest = ({ exam }: { exam: RequestedExams }) => {
  return (
    <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-1">
          <span className="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
            Placement Exam
          </span>
          <h3 className="text-lg font-semibold text-gray-800">{exam.title}</h3>
        </div>
        <GraduationCap className="w-6 h-6 text-gray-500" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-gray-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Duration</span>
          </div>
          <p className="font-medium text-gray-900">{exam.duration} hr</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-gray-600">
            <Target className="w-4 h-4" />
            <span className="text-sm">Pass Score</span>
          </div>
          <p className="font-medium text-gray-900">{exam.pass_score}%</p>
        </div>
      </div>

      {/* Start Exam Button */}
      <Link to={`${exam.id}`}>
        <button
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <PlayCircle className="w-5 h-5" />
          Start Exam
        </button>
      </Link>

      {/* Created At */}
      <div className="mt-4 flex items-center gap-1.5 text-sm text-gray-500">
        <Calendar className="w-4 h-4" />
        <span>Created {format(exam.created_at, "MMM d, yyyy")}</span>
      </div>
    </div>
  );
};

export default PlacementTest;