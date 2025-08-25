import { useState } from "react";
import { X, Play, ChevronDown, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { curriculumData } from "@/data/curriculum";

interface LectureSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentLecture: any;
  onLectureSelect: (lecture: any) => void;
}

export const LectureSidebar = ({ 
  isOpen, 
  onClose, 
  currentLecture, 
  onLectureSelect 
}: LectureSidebarProps) => {
  const [expandedSubjects, setExpandedSubjects] = useState<string[]>(["민법 및 민사특별법"]);
  const [expandedSections, setExpandedSections] = useState<string[]>(["핵심개념입문과정"]);

  const toggleSubject = (subjectId: string) => {
    setExpandedSubjects(prev => 
      prev.includes(subjectId) 
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId) 
        : [...prev, sectionId]
    );
  };

  const renderLecture = (lecture: any) => {
    const isCurrentLecture = currentLecture.id === lecture.id;
    const isCompleted = lecture.progress >= 90;
    
    return (
      <div 
        key={lecture.id}
        className={cn(
          "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
          isCurrentLecture && "bg-accent-weak border border-accent/20",
          isCompleted && "lecture-completed",
          !isCurrentLecture && !isCompleted && "hover:bg-muted/50"
        )}
        onClick={() => onLectureSelect({
          id: lecture.id,
          title: lecture.title,
          subject: "민법 및 민사특별법",
          section: "핵심개념입문",
          lectureNumber: lecture.number,
          duration: lecture.duration,
          videoUrl: lecture.videoUrl,
          progress: lecture.progress,
          totalLectures: 3,
          totalDuration: "01:57:30"
        })}
      >
        {/* Lecture number */}
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
          {isCompleted ? (
            <Check className="w-3 h-3 text-accent" />
          ) : (
            lecture.number
          )}
        </div>

        {/* Lecture info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium truncate">{lecture.title}</h4>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-muted-foreground">{lecture.duration}</span>
            <span className="text-xs text-muted-foreground">{lecture.progress}%</span>
          </div>
          
          {/* Progress bar */}
          <div className="progress-bar mt-2">
            <div 
              className="progress-fill" 
              style={{ width: `${lecture.progress}%` }}
            />
          </div>
        </div>

        {/* Play button */}
        <button 
          className="btn-lecture"
          onClick={(e) => {
            e.stopPropagation();
            onLectureSelect({
              id: lecture.id,
              title: lecture.title,
              subject: "민법 및 민사특별법",
              section: "핵심개념입문",
              lectureNumber: lecture.number,
              duration: lecture.duration,
              videoUrl: lecture.videoUrl,
              progress: lecture.progress,
              totalLectures: 3,
              totalDuration: "01:57:30"
            });
          }}
        >
          <Play className="w-3 h-3 mr-1" />
          {lecture.progress > 0 ? "이어보기" : "재생"}
        </button>
      </div>
    );
  };

  return (
    <>
      {/* Sidebar */}
      <aside className={cn(
        "fixed top-14 left-0 z-40 w-[336px] h-[calc(100vh-3.5rem)] bg-white border-r border-border overflow-y-auto transition-transform lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">나의 강의실</h2>
          <button 
            onClick={onClose}
            className="lg:hidden p-1 text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Curriculum Navigation */}
        <div className="p-4">
          {/* 1차 시험과목 */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 px-2">
              1차 시험과목
            </h3>
            {curriculumData.slice(0, 2).map(subject => (
              <div key={subject.id} className="mb-3">
                {/* Subject Header */}
                <button
                  onClick={() => toggleSubject(subject.id)}
                  className="w-full flex items-center justify-between p-2 text-base font-semibold text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                >
                  <span>{subject.name}</span>
                  {expandedSubjects.includes(subject.id) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>

                {/* Sections */}
                {expandedSubjects.includes(subject.id) && (
                  <div className="mt-2 space-y-1">
                    {subject.sections.map(section => (
                      <div key={section.id}>
                        {/* Section Header */}
                        <button
                          onClick={() => toggleSection(section.id)}
                          className="w-full flex items-center justify-between p-2 pl-6 text-sm font-medium text-muted-foreground hover:bg-muted/50 rounded-lg transition-colors"
                        >
                          <span>{section.name}</span>
                          {expandedSections.includes(section.id) ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>

                        {/* Lectures */}
                        {expandedSections.includes(section.id) && (
                          <div className="mt-2 pl-8 space-y-2">
                            {section.lectures.length > 0 ? (
                              section.lectures.map(renderLecture)
                            ) : (
                              <div className="p-3 text-sm text-muted-foreground text-center">
                                강의가 준비 중입니다.
                              </div>
                            )}
                          </div>
                        )}

                        {/* Special sections after 기출문제풀이과정 */}
                        {section.id === "기출문제풀이과정" && subject.specialSections && (
                          <div className="mt-2 space-y-1">
                            {subject.specialSections.map(specialSection => (
                              <div key={specialSection.id}>
                                <button
                                  onClick={() => toggleSection(specialSection.id)}
                                  className="w-full flex items-center justify-between p-2 pl-6 text-sm font-medium text-muted-foreground hover:bg-muted/50 rounded-lg transition-colors"
                                >
                                  <span>{specialSection.name}</span>
                                  {expandedSections.includes(specialSection.id) ? (
                                    <ChevronDown className="w-4 h-4" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4" />
                                  )}
                                </button>
                                
                                {expandedSections.includes(specialSection.id) && (
                                  <div className="mt-2 pl-8 space-y-2">
                                    {specialSection.lectures.length > 0 ? (
                                      specialSection.lectures.map(renderLecture)
                                    ) : (
                                      <div className="p-3 text-sm text-muted-foreground text-center">
                                        강의가 준비 중입니다.
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 2차 시험과목 */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 px-2">
              2차 시험과목
            </h3>
            {curriculumData.slice(2).map(subject => (
              <div key={subject.id} className="mb-3">
                {/* Subject Header */}
                <button
                  onClick={() => toggleSubject(subject.id)}
                  className="w-full flex items-center justify-between p-2 text-base font-semibold text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                >
                  <span>{subject.name}</span>
                  {expandedSubjects.includes(subject.id) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>

                {/* Sections */}
                {expandedSubjects.includes(subject.id) && (
                  <div className="mt-2 space-y-1">
                    {subject.sections.map(section => (
                      <div key={section.id}>
                        {/* Section Header */}
                        <button
                          onClick={() => toggleSection(section.id)}
                          className="w-full flex items-center justify-between p-2 pl-6 text-sm font-medium text-muted-foreground hover:bg-muted/50 rounded-lg transition-colors"
                        >
                          <span>{section.name}</span>
                          {expandedSections.includes(section.id) ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>

                        {/* Lectures */}
                        {expandedSections.includes(section.id) && (
                          <div className="mt-2 pl-8 space-y-2">
                            {section.lectures.length > 0 ? (
                              section.lectures.map(renderLecture)
                            ) : (
                              <div className="p-3 text-sm text-muted-foreground text-center">
                                강의가 준비 중입니다.
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};