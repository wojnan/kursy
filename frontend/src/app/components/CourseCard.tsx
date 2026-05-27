import { Link } from 'react-router';
import { Star, Users, Clock } from 'lucide-react';
import { Card, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import type { Course } from '../services/database'
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link to={`/course/${course.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
        <div className="aspect-video relative overflow-hidden">
          <ImageWithFallback
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          <Badge className="absolute top-3 left-3 bg-white text-gray-900 hover:bg-white">
            {course.level}
          </Badge>
        </div>
        
        <CardContent className="p-4">
          <div className="mb-2">
            <span className="text-sm" style={{ color: '#4F772D' }}>{course.category}</span>
          </div>
          <h3 className="font-semibold mb-2 line-clamp-2">{course.title}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {course.description}
          </p>
          <p className="text-sm text-gray-700 mb-3">By {course.instructor}</p>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{course.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{course.students.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{course.duration}</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          <span className="text-2xl font-bold">${course.price}</span>
        </CardFooter>
      </Card>
    </Link>
  );
}