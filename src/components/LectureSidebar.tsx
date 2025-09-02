import { useState } from "react";
import { X, Play, ChevronDown, ChevronRight, Check, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { curriculumData } from "@/data/curriculum";
import { uiLabels, subjectCategories } from "@/data/uiLabels";
import { getLectureMetadata, getDefaultLectureMetadata } from "@/data/lectureMetadata";

interface LectureSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  currentLecture: any;
  onLectureSelect: (lecture: any) => void;
}

export const LectureSidebar = ({ 
  isOpen, 
  onClose,
  collapsed,
  onToggleCollapse,
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
    
    // 강의 메타데이터 가져오기
    const metadata = getLectureMetadata(lecture.id) || getDefaultLectureMetadata();
    
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
              subject: metadata.subject,
              section: metadata.section,
              lectureNumber: lecture.number,
              duration: lecture.duration,
              videoUrl: lecture.videoUrl,
              progress: lecture.progress,
              totalLectures: metadata.totalLectures,
              totalDuration: metadata.totalDuration
            });
          }}
        >
          <Play className="w-3 h-3 mr-1 inline" />
          {lecture.progress > 0 ? uiLabels.videoPlayer.playback.continueWatching : uiLabels.videoPlayer.playback.play}
        </button>
      </div>
    );
  };

  return (
    <>
      {/* Sidebar */}
      <aside className={cn(
        "fixed top-14 left-0 z-40 h-[calc(100vh-3.5rem)] bg-sidebar-navy overflow-y-auto transition-all duration-300 lg:translate-x-0",
        collapsed ? "w-16" : "w-[336px]",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-sidebar-navy-light">
          {!collapsed && (
            <h2 className="text-xl font-bold text-sidebar-text-primary">{uiLabels.sidebar.myClassroom}</h2>
          )}
          <div className="flex items-center gap-2">
            {/* Collapse/Expand button - always visible on desktop */}
            <button 
              onClick={onToggleCollapse}
              className="hidden lg:block p-1 text-sidebar-text-secondary hover:text-sidebar-text-primary transition-colors"
              title={collapsed ? "사이드바 펼치기" : "사이드바 접기"}
            >
              {collapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
            </button>
            {/* Close button - only visible on mobile */}
            <button 
              onClick={onClose}
              className="lg:hidden p-1 text-sidebar-text-secondary hover:text-sidebar-text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Curriculum Navigation */}
        <div className={cn("transition-all duration-300", collapsed ? "p-2" : "p-6")}>
          {collapsed && (
            <div className="text-center">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-accent-foreground text-sm font-bold">강</span>
              </div>
            </div>
          )}
          {!collapsed && (
            <>
              {/* 1차 시험과목 */}
              <div className="mb-8">
                <div className="mb-4 pb-2 border-b border-sidebar-navy-light">
                  <h3 className="text-sm font-semibold text-sidebar-text-secondary uppercase tracking-wider">
                    {uiLabels.sidebar.primarySubjects}
                  </h3>
                </div>
                {curriculumData.filter(subject => subjectCategories.primary.includes(subject.name)).map(subject => (
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
                                    {uiLabels.sidebar.lecturesInPreparation}
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
                                            {uiLabels.sidebar.lecturesInPreparation}
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
                    {uiLabels.sidebar.secondarySubjects}
                  </h3>
                </div>
                {curriculumData.filter(subject => subjectCategories.secondary.includes(subject.name)).map(subject => (
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
                                    {uiLabels.sidebar.lecturesInPreparation}
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
            </>
          )}
        </div>
      </aside>
    </>
  );
};