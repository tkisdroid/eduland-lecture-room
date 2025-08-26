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
  const [isLgUp, setIsLgUp] = useState(false);

  const handleLectureSelect = (lecture: any) => {
    setCurrentLecture(lecture);
    setVideoKey(prev => prev + 1); // Force video player to refresh
    // Scroll to top when selecting a new lecture
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const ENTER = 260; // enter mini at this scroll
    const EXIT = 140;  // exit mini below this scroll
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled((prev) => (prev ? scrollTop > EXIT : scrollTop > ENTER));
    };

    window.addEventListener('scroll', handleScroll, { passive: true } as any);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll as any);
  }, []);

  useEffect(() => {
    const check = () => setIsLgUp(window.matchMedia('(min-width: 1024px)').matches);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
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
            {/* Sticky Lecture Info Bar */}
            {isScrolled && (
              <div className="sticky top-14 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border -mx-4 px-4 py-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <h2 className="text-sm sm:text-base font-semibold text-foreground truncate">{currentLecture.title}</h2>
                  <div className="flex flex-wrap gap-2">
                    <span className="chip-meta">총 강의시간 {currentLecture.totalDuration}</span>
                    <span className="chip-meta">강의 수 {currentLecture.totalLectures}강</span>
                  </div>
                </div>
              </div>
            )}
            {/* Video Player Section */}
            <div className={`mb-8 sticky-player ${isScrolled && isLgUp ? 'mini-player' : ''}`}>
              <VideoPlayer 
                key={videoKey} // Force complete re-render when lecture changes
                videoUrl={currentLecture.videoUrl}
                title={currentLecture.title}
                progress={currentLecture.progress}
                compact={isScrolled && isLgUp}
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