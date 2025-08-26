import { useState, useEffect } from "react";
import { LectureSidebar } from "@/components/LectureSidebar";
import { VideoPlayer } from "@/components/VideoPlayer";
import { LectureHeader } from "@/components/LectureHeader";
import { LectureTabs } from "@/components/LectureTabs";
import { RecentCourses } from "@/components/RecentCourses";
import { InstructorInfo } from "@/components/InstructorInfo";
import { Menu, X } from "lucide-react";

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentLecture, setCurrentLecture] = useState({
    id: "1",
    title: "소유권과 점유권의 기본 개념",
    subject: "민법 및 민사특별법",
    section: "핵심개념입문", 
    lectureNumber: 1,
    duration: "36:30",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    progress: 45,
    totalLectures: 3,
    totalDuration: "01:57:30"
  });

  const [videoKey, setVideoKey] = useState(0); // Force video refresh

  const handleLectureSelect = (lecture: any) => {
    setCurrentLecture(lecture);
    setVideoKey(prev => prev + 1); // Force video player to refresh
    // Scroll to top when selecting a new lecture
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        section={currentLecture.section}
        lectureNumber={currentLecture.lectureNumber}
        totalLectures={currentLecture.totalLectures}
        onMenuClick={() => setSidebarOpen(true)}
      />

      <div className="flex">
        {/* Left Sidebar */}
        <LectureSidebar 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          currentLecture={currentLecture}
          onLectureSelect={handleLectureSelect}
        />

        {/* Main Content */}
        <main className="flex-1 lg:ml-[336px]">
          <div className="max-w-[1280px] mx-auto px-4 py-6">
            {/* Video Player Section */}
            <div className="mb-8">
              <div className={isScrolled ? "flex justify-end" : ""}>
                <div className={`sticky top-20 z-45 transition-all duration-300 origin-top-right ${isScrolled ? 'max-w-[280px] sm:max-w-[360px] md:max-w-[400px] lg:max-w-[420px] xl:max-w-[480px] w-full' : 'w-full'}`}>
                  <VideoPlayer 
                    key={videoKey} // Force complete re-render when lecture changes
                    videoUrl={currentLecture.videoUrl}
                    title={currentLecture.title}
                    progress={currentLecture.progress}
                    compact={isScrolled}
                  />
                  {/* Video Meta Info - Hide when scrolled */}
                  {!isScrolled && (
                    <div className="mt-4 animate-fade-in">
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
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs Section - Fixed when scrolled */}
            <div className={isScrolled ? 'sticky top-[300px] sm:top-[260px] md:top-[230px] lg:top-[210px] xl:top-[200px] z-40 bg-background pb-4 pt-2' : ''}>
              <LectureTabs />
            </div>

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