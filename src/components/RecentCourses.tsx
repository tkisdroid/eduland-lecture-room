import { Clock, Users, Star } from "lucide-react";
import { recentCoursesData } from "@/data/recentCourses";

export const RecentCourses = () => {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">최근 업로드 된 강의</h2>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {recentCoursesData.slice(0, 4).map(course => (
          <div key={course.id} className="edu-card">
            {/* Thumbnail */}
            <div className="aspect-video bg-muted relative overflow-hidden">
              <img 
                src={course.thumbnail} 
                alt={course.title}
                className="w-full h-full object-cover"
              />
              
              {/* Badges */}
              <div className="absolute top-2 left-2 flex gap-1">
                {course.isNew && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    신규
                  </span>
                )}
                {course.isPopular && (
                  <span className="bg-accent text-white text-xs px-2 py-1 rounded-full font-medium">
                    인기
                  </span>
                )}
              </div>

              {/* Duration overlay */}
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {course.totalDuration}
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-foreground mb-2 line-clamp-2 leading-tight">
                {course.title}
              </h3>
              
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm text-muted-foreground">{course.instructor}</span>
                {course.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-xs text-muted-foreground">{course.rating}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>총 {course.totalDuration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{course.studentCount}명</span>
                </div>
              </div>

              {/* Progress bar for enrolled courses */}
              {course.progress !== undefined && (
                <div className="mt-3">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground mt-1 block">
                    진도율 {course.progress}%
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};