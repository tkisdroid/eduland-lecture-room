import { useState } from "react";
import { LectureSidebar } from "@/components/LectureSidebar";
import { VideoPlayer } from "@/components/VideoPlayer";
import { LectureHeader } from "@/components/LectureHeader";
import { LectureTabs } from "@/components/LectureTabs";
import { RecentCourses } from "@/components/RecentCourses";
import { InstructorInfo } from "@/components/InstructorInfo";
import { Menu, X } from "lucide-react";

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentLecture, setCurrentLecture] = useState({
    id: "1",
    title: "소유권과 점유권의 기본 개념",
    subject: "민법 및 민사특별법",
    section: "핵심개념입문과정", 
    duration: "36:30",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    progress: 45,
    totalLectures: 3,
    totalDuration: "01:57:30"
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sticky header */}
      <LectureHeader 
        title={currentLecture.title}
        subject={currentLecture.subject}
        totalLectures={currentLecture.totalLectures}
        totalDuration={currentLecture.totalDuration}
        onMenuClick={() => setSidebarOpen(true)}
      />

      <div className="flex">
        {/* Left Sidebar */}
        <LectureSidebar 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          currentLecture={currentLecture}
          onLectureSelect={setCurrentLecture}
        />

        {/* Main Content */}
        <main className="flex-1 lg:ml-[336px]">
          <div className="max-w-[1280px] mx-auto px-4 py-6">
            {/* Video Player Section */}
            <div className="mb-8">
              <VideoPlayer 
                videoUrl={currentLecture.videoUrl}
                title={currentLecture.title}
                progress={currentLecture.progress}
              />
              
              {/* Video Meta Info */}
              <div className="mt-4">
                <h1 className="text-2xl font-bold text-foreground mb-3">
                  {currentLecture.title}
                </h1>
                <div className="flex flex-wrap gap-2">
                  <span className="chip-meta">
                    총 강의시간 {currentLecture.totalDuration}
                  </span>
                  <span className="chip-meta">
                    강의 수 {currentLecture.totalLectures}강
                  </span>
                  <span className="chip-meta">
                    업데이트 2025-01-15
                  </span>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <LectureTabs />

            {/* Instructor Info */}
            <InstructorInfo />

            {/* Recent Courses Grid */}
            <RecentCourses />

            {/* Footer Placeholder */}
            <footer id="footer-slot" className="mt-16 py-8 border-t border-border">
              <div className="text-center text-muted-foreground text-sm">
                Eduland 공인중개사 강의실 - Footer will be inserted here
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;