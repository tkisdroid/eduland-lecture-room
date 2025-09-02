
import { Play, Clock, CheckCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { curriculumData } from "@/data/curriculum";
import { getLectureMetadata, getDefaultLectureMetadata } from "@/data/lectureMetadata";

interface VideoRecommendationsProps {
  currentLecture: any;
  onLectureSelect: (lecture: any) => void;
}

export const VideoRecommendations = ({ currentLecture, onLectureSelect }: VideoRecommendationsProps) => {
  // 현재 강의와 같은 섹션의 모든 강의 찾기
  const findCurrentSectionLectures = () => {
    for (const subject of curriculumData) {
      for (const section of subject.sections) {
        const foundLecture = section.lectures.find(lecture => lecture.id === currentLecture.id);
        if (foundLecture) {
          return section.lectures;
        }
      }
    }
    return [];
  };

  const sectionLectures = findCurrentSectionLectures();
  const currentIndex = sectionLectures.findIndex(lecture => lecture.id === currentLecture.id);
  
  // 현재 강의를 기준으로 이전 2개, 다음 2개 강의 선택
  const recommendedLectures = [];
  for (let i = Math.max(0, currentIndex - 2); i <= Math.min(sectionLectures.length - 1, currentIndex + 2); i++) {
    if (i !== currentIndex) {
      recommendedLectures.push(sectionLectures[i]);
    }
  }

  const renderLecture = (lecture: any) => {
    const isCompleted = lecture.progress >= 90;
    const metadata = getLectureMetadata(lecture.id) || getDefaultLectureMetadata();
    
    return (
      <div 
        key={lecture.id}
        className="flex items-start gap-3 p-3 rounded-lg cursor-pointer hover:bg-accent/5 transition-colors border border-border/50"
        onClick={() => onLectureSelect({
          id: lecture.id,
          title: lecture.title,
          subject: metadata.subject,
          section: metadata.section,
          lectureNumber: lecture.number,
          duration: lecture.duration,
          videoUrl: lecture.videoUrl,
          progress: lecture.progress,
          totalLectures: metadata.totalLectures,
          totalDuration: metadata.totalDuration
        })}
      >
        {/* 썸네일 영역 */}
        <div className="flex-shrink-0 w-20 h-12 bg-muted rounded-md flex items-center justify-center relative overflow-hidden">
          <Play className="w-6 h-6 text-muted-foreground" />
          {isCompleted && (
            <div className="absolute top-1 right-1">
              <CheckCircle className="w-3 h-3 text-green-500" />
            </div>
          )}
        </div>

        {/* 강의 정보 */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium line-clamp-2 leading-relaxed mb-1">
            {lecture.number}. {lecture.title}
          </h4>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{lecture.duration}</span>
            <span>•</span>
            <span>{lecture.progress}% 완료</span>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-muted rounded-full h-1 mt-2">
            <div 
              className="h-full bg-accent transition-all duration-300 rounded-full"
              style={{ width: `${lecture.progress}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  if (recommendedLectures.length === 0) {
    return null;
  }

  return (
    <div className="w-80 bg-card border border-border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4 text-foreground">다음 강의</h3>
      <ScrollArea className="h-[500px]">
        <div className="space-y-3">
          {recommendedLectures.map(renderLecture)}
        </div>
      </ScrollArea>
    </div>
  );
};
