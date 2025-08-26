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
        ? [] // 클릭한 과목이 이미 열려있으면 모두 접기
        : [subjectId] // 클릭한 과목만 열고 나머지는 접기
    );
    // 과목이 바뀌면 섹션도 초기화
    setExpandedSections([]);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId)
        ? [] // 클릭한 섹션이 이미 열려있으면 모두 접기
        : [sectionId] // 클릭한 섹션만 열고 나머지는 접기
    );
  };

  const renderLecture = (lecture: any) => {
    const isCurrentLecture = currentLecture.id === lecture.id;
    const isCompleted = lecture.progress >= 90;
    
    return (
      <div 
        key={lecture.id}
        className={cn(
          "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200",
          isCurrentLecture && "bg-sidebar-navy-light text-sidebar-text-primary font-medium border-l-4 border-accent",
          isCompleted && "bg-sidebar-hover text-sidebar-text-secondary",
          !isCurrentLecture && !isCompleted && "text-sidebar-text-muted hover:bg-sidebar-hover hover:text-sidebar-text-primary"
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
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-sidebar-navy-light flex items-center justify-center text-xs font-medium">
          {isCompleted ? (
            <Check className="w-3 h-3 text-accent" />
          ) : (
            <span className="text-sidebar-text-secondary">{lecture.number}</span>
          )}
        </div>

        {/* Lecture info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium truncate leading-relaxed">{lecture.title}</h4>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-sidebar-text-muted">{lecture.duration}</span>
            <span className="text-xs text-sidebar-text-muted">{lecture.progress}%</span>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-sidebar-navy-light rounded-full h-1.5 mt-2 overflow-hidden">
            <div 
              className="h-full bg-accent transition-all duration-300 rounded-full"
              style={{ width: `${lecture.progress}%` }}
            />
          </div>
        </div>

        {/* Play button */}
        <button 
          className="px-2.5 py-1.5 bg-accent text-accent-foreground text-xs font-medium rounded-md hover:bg-accent/90 transition-colors"
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
          <Play className="w-3 h-3 mr-1 inline" />
          {lecture.progress > 0 ? "이어보기" : "재생"}
        </button>
      </div>
    );
  };

  return (
    <>
      {/* Sidebar */}
      <aside className={cn(
        "fixed top-14 left-0 z-40 w-[336px] h-[calc(100vh-3.5rem)] bg-sidebar-navy overflow-y-auto transition-transform md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-sidebar-navy-light">
          <h2 className="text-xl font-bold text-sidebar-text-primary">나의 강의실</h2>
          <button 
            onClick={onClose}
            className="md:hidden p-1 text-sidebar-text-secondary hover:text-sidebar-text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Curriculum Navigation */}
        <div className="p-6">
          {/* 1차 시험과목 */}
          <div className="mb-8">
            <div className="mb-4 pb-2 border-b border-sidebar-navy-light">
              <h3 className="text-sm font-semibold text-sidebar-text-secondary uppercase tracking-wider">
                1차 시험과목
              </h3>
            </div>
            {curriculumData.slice(0, 2).map(subject => (
              <div key={subject.id} className="mb-4">
                {/* Subject Header */}
                <button
                  onClick={() => toggleSubject(subject.id)}
                  className="w-full flex items-center justify-between p-3 text-base font-bold text-sidebar-text-primary hover:bg-sidebar-hover rounded-lg transition-colors"
                >
                  <span>{subject.name}</span>
                  {expandedSubjects.includes(subject.id) ? (
                    <ChevronDown className="w-4 h-4 text-sidebar-text-secondary" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-sidebar-text-secondary" />
                  )}
                </button>

                {/* Sections */}
                {expandedSubjects.includes(subject.id) && (
                  <div className="mt-3 ml-4 space-y-2 animate-fade-in">
                    {subject.sections.map(section => (
                      <div key={section.id}>
                        {/* Section Header */}
                        <button
                          onClick={() => toggleSection(section.id)}
                          className="w-full flex items-center justify-between p-2.5 text-sm font-medium text-sidebar-text-secondary hover:bg-sidebar-hover hover:text-sidebar-text-primary rounded-lg transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span>{section.name}</span>
                            {section.lectures.length > 0 && (
                              <span className="text-xs bg-sidebar-navy-light text-sidebar-text-muted px-2 py-0.5 rounded-full">
                                {section.lectures.length}개
                              </span>
                            )}
                          </div>
                          {expandedSections.includes(section.id) ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>

                        {/* Lectures */}
                        {expandedSections.includes(section.id) && (
                          <div className="mt-2 ml-4 space-y-1 animate-fade-in">
                            {section.lectures.length > 0 ? (
                              section.lectures.map(renderLecture)
                            ) : (
                              <div className="p-3 text-sm text-sidebar-text-muted text-center">
                                강의가 준비 중입니다.
                              </div>
                            )}
                          </div>
                        )}

                        {/* Special sections after 기출문제풀이과정 */}
                        {section.id === "기출문제풀이과정" && subject.specialSections && (
                          <div className="mt-2 space-y-2">
                            {subject.specialSections.map(specialSection => (
                              <div key={specialSection.id}>
                                <button
                                  onClick={() => toggleSection(specialSection.id)}
                                  className="w-full flex items-center justify-between p-2.5 text-sm font-medium text-sidebar-text-secondary hover:bg-sidebar-hover hover:text-sidebar-text-primary rounded-lg transition-colors"
                                >
                                  <div className="flex items-center gap-2">
                                    <span>{specialSection.name}</span>
                                    {specialSection.lectures.length > 0 && (
                                      <span className="text-xs bg-sidebar-navy-light text-sidebar-text-muted px-2 py-0.5 rounded-full">
                                        {specialSection.lectures.length}개
                                      </span>
                                    )}
                                  </div>
                                  {expandedSections.includes(specialSection.id) ? (
                                    <ChevronDown className="w-4 h-4" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4" />
                                  )}
                                </button>
                                
                                {expandedSections.includes(specialSection.id) && (
                                  <div className="mt-2 ml-4 space-y-1 animate-fade-in">
                                    {specialSection.lectures.length > 0 ? (
                                      specialSection.lectures.map(renderLecture)
                                    ) : (
                                      <div className="p-3 text-sm text-sidebar-text-muted text-center">
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
            <div className="mb-4 pb-2 border-b border-sidebar-navy-light">
              <h3 className="text-sm font-semibold text-sidebar-text-secondary uppercase tracking-wider">
                2차 시험과목
              </h3>
            </div>
            {curriculumData.slice(2).map(subject => (
              <div key={subject.id} className="mb-4">
                {/* Subject Header */}
                <button
                  onClick={() => toggleSubject(subject.id)}
                  className="w-full flex items-center justify-between p-3 text-base font-bold text-sidebar-text-primary hover:bg-sidebar-hover rounded-lg transition-colors"
                >
                  <span>{subject.name}</span>
                  {expandedSubjects.includes(subject.id) ? (
                    <ChevronDown className="w-4 h-4 text-sidebar-text-secondary" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-sidebar-text-secondary" />
                  )}
                </button>

                {/* Sections */}
                {expandedSubjects.includes(subject.id) && (
                  <div className="mt-3 ml-4 space-y-2 animate-fade-in">
                    {subject.sections.map(section => (
                      <div key={section.id}>
                        {/* Section Header */}
                        <button
                          onClick={() => toggleSection(section.id)}
                          className="w-full flex items-center justify-between p-2.5 text-sm font-medium text-sidebar-text-secondary hover:bg-sidebar-hover hover:text-sidebar-text-primary rounded-lg transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span>{section.name}</span>
                            {section.lectures.length > 0 && (
                              <span className="text-xs bg-sidebar-navy-light text-sidebar-text-muted px-2 py-0.5 rounded-full">
                                {section.lectures.length}개
                              </span>
                            )}
                          </div>
                          {expandedSections.includes(section.id) ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>

                        {/* Lectures */}
                        {expandedSections.includes(section.id) && (
                          <div className="mt-2 ml-4 space-y-1 animate-fade-in">
                            {section.lectures.length > 0 ? (
                              section.lectures.map(renderLecture)
                            ) : (
                              <div className="p-3 text-sm text-sidebar-text-muted text-center">
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