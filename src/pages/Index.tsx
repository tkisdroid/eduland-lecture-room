import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { LectureSidebar } from "@/components/LectureSidebar";
import { VideoPlayer } from "@/components/VideoPlayer";
import { LectureHeader } from "@/components/LectureHeader";
import { LectureTabs } from "@/components/LectureTabs";
import { RecentCourses } from "@/components/RecentCourses";
import { InstructorInfo } from "@/components/InstructorInfo";
import { curriculumData } from "@/data/curriculum";
import { Menu, X } from "lucide-react";

// Helper function to find lecture by ID
const findLectureById = (lectureId: string) => {
  for (const subject of curriculumData) {
    for (const section of subject.sections) {
      const lecture = section.lectures.find(l => l.id === lectureId);
      if (lecture) {
        return {
          lecture,
          subject: subject.name,
          section: section.name,
          totalLectures: section.lectures.length,
          totalDuration: calculateTotalDuration(section.lectures)
        };
      }
    }
    // Check special sections
    if (subject.specialSections) {
      for (const section of subject.specialSections) {
        const lecture = section.lectures.find(l => l.id === lectureId);
        if (lecture) {
          return {
            lecture,
            subject: subject.name,
            section: section.name,
            totalLectures: section.lectures.length,
            totalDuration: calculateTotalDuration(section.lectures)
          };
        }
      }
    }
  }
  return null;
};

// Helper function to get first available lecture
const getFirstAvailableLecture = () => {
  for (const subject of curriculumData) {
    for (const section of subject.sections) {
      if (section.lectures.length > 0) {
        const lecture = section.lectures[0];
        return {
          lecture,
          subject: subject.name,
          section: section.name,
          totalLectures: section.lectures.length,
          totalDuration: calculateTotalDuration(section.lectures)
        };
      }
    }
  }
  return null;
};

// Helper function to calculate total duration
const calculateTotalDuration = (lectures: any[]) => {
  if (lectures.length === 0) return "00:00";
  
  let totalMinutes = 0;
  lectures.forEach(lecture => {
    const [minutes, seconds] = lecture.duration.split(':').map(Number);
    totalMinutes += minutes + (seconds / 60);
  });
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes % 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
};

const Index = () => {
  const [searchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentLecture, setCurrentLecture] = useState<any>(null);
  const [videoKey, setVideoKey] = useState(0); // Force video refresh

  // Initialize lecture on component mount
  useEffect(() => {
    const lectureId = searchParams.get('lectureId');
    let lectureData = null;

    if (lectureId) {
      // Try to find lecture by query parameter
      lectureData = findLectureById(lectureId);
    }

    if (!lectureData) {
      // Fallback to first available lecture
      lectureData = getFirstAvailableLecture();
    }

    if (lectureData) {
      const { lecture, subject, section, totalLectures, totalDuration } = lectureData;
      setCurrentLecture({
        id: lecture.id,
        title: lecture.title,
        subject: subject,
        section: section,
        lectureNumber: lecture.number,
        duration: lecture.duration,
        videoUrl: lecture.videoUrl,
        progress: lecture.progress,
        totalLectures: totalLectures,
        totalDuration: totalDuration
      });
    }
  }, [searchParams]);

  const handleLectureSelect = (lecture: any) => {
    setCurrentLecture(lecture);
    setVideoKey(prev => prev + 1); // Force video player to refresh
    // Scroll to top when selecting a new lecture
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  // Show loading if currentLecture is not yet initialized
  if (!currentLecture) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">강의를 불러오는 중...</p>
        </div>
      </div>
    );
  }

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
            <div className={`mb-8 ${
              isScrolled 
                ? 'fixed top-20 right-6 z-50 w-80 md:w-96 lg:w-[420px] xl:w-[480px] shadow-2xl rounded-lg' 
                : 'relative w-full'
            }`}>
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

            {/* Placeholder to maintain layout when video is fixed */}
            {isScrolled && <div className="mb-8 h-96"></div>}

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