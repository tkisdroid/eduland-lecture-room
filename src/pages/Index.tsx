import { useState, useEffect } from "react";
import { LectureSidebar } from "@/components/LectureSidebar";
import { VideoPlayer } from "@/components/VideoPlayer";
import { LectureHeader } from "@/components/LectureHeader";
import { LectureTabs } from "@/components/LectureTabs";
import { RecentCourses } from "@/components/RecentCourses";
import { InstructorInfo } from "@/components/InstructorInfo";
import { uiLabels } from "@/data/uiLabels";
import { useUserProgress } from "@/hooks/useUserProgress";
import { curriculumData } from "@/data/curriculum";
import { Menu, X } from "lucide-react";

const Index = () => {
  // TODO: 실제 환경에서는 인증된 사용자의 ID를 사용
  const mockMemberId = "user_001"; // 임시 사용자 ID
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentLecture, setCurrentLecture] = useState({
    id: "1",
    title: "소유권과 점유권의 기본 개념",
    subject: "민법 및 민사특별법",
    section: "핵심개념입문", 
    lectureNumber: 1,
    duration: "36:30",
    videoUrl: "https://www.youtube.com/embed/c0gFbdrBLX0",
    progress: 45,
    totalLectures: 3,
    totalDuration: "01:57:30"
  });

  const { getLastWatchedLectureId, getLectureProgress } = useUserProgress(mockMemberId);

  const [videoKey, setVideoKey] = useState(0); // Force video refresh

  // 마지막 시청 강의 로드
  const loadLastWatchedLecture = () => {
    const lastWatchedId = getLastWatchedLectureId();
    if (lastWatchedId) {
      // curriculumData에서 해당 강의 찾기
      for (const subject of curriculumData) {
        for (const section of subject.sections) {
          const foundLecture = section.lectures.find(lecture => lecture.id === lastWatchedId);
          if (foundLecture) {
            const savedProgress = getLectureProgress(lastWatchedId);
            setCurrentLecture({
              ...foundLecture,
              lectureNumber: foundLecture.number,
              subject: subject.name,
              section: section.name,
              progress: savedProgress?.progress || 0,
              totalLectures: section.lectures.length,
              totalDuration: "01:57:30" // TODO: 실제 총 시간 계산
            });
            console.log(`Loaded last watched lecture: ${foundLecture.title}`);
            return;
          }
        }
      }
    }
  };

  const handleLectureSelect = (lecture: any) => {
    setCurrentLecture(lecture);
    setVideoKey(prev => prev + 1); // Force video player to refresh
    // Scroll to top when selecting a new lecture
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 컴포넌트 마운트 시 마지막 시청 강의 로드
  useEffect(() => {
    loadLastWatchedLecture();
  }, [getLastWatchedLectureId, getLectureProgress]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Use hysteresis to prevent flickering
      if (scrollTop > 250 && !isScrolled) {
        setIsScrolled(true);
      } else if (scrollTop < 150 && isScrolled) {
        setIsScrolled(false);
      }
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [isScrolled]);

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
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          currentLecture={currentLecture}
          onLectureSelect={handleLectureSelect}
        />

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-[336px]'}`}>
          <div className="max-w-[1280px] mx-auto px-4 py-6">
            {/* Video Player Section */}
            <div className={`mb-8 ${
              isScrolled 
                ? 'fixed top-20 right-6 z-50 w-80 md:w-96 lg:w-[420px] xl:w-[480px] shadow-2xl rounded-lg' 
                : 'relative w-full'
            }`}>
              <VideoPlayer 
                key={videoKey}
                videoUrl={currentLecture.videoUrl}
                title={currentLecture.title}
                progress={currentLecture.progress}
                compact={isScrolled}
                memberId={mockMemberId}
                lectureId={currentLecture.id}
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

            {/* Placeholder to maintain layout when video is fixed */}
            {isScrolled && <div className="mb-8 h-96"></div>}

            {/* Tabs Section */}
            <LectureTabs currentLectureId={currentLecture.id} />

            {/* Instructor Info */}
            <InstructorInfo />

            {/* Recent Courses Grid */}
            <RecentCourses />

            {/* Footer Placeholder */}
            <footer id="footer-slot" className="mt-16 py-8 border-t border-border">
              <div className="text-center text-muted-foreground text-sm">
                {uiLabels.footer.placeholder}
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;