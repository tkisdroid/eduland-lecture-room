import { Menu } from "lucide-react";

interface LectureHeaderProps {
  title: string;
  subject: string;
  totalLectures: number;
  totalDuration: string;
  onMenuClick: () => void;
}

export const LectureHeader = ({ 
  title, 
  subject, 
  totalLectures, 
  totalDuration, 
  onMenuClick 
}: LectureHeaderProps) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-border">
      <div className="px-4 h-14 flex items-center justify-between">
        {/* Mobile menu button */}
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 -m-2 text-muted-foreground hover:text-foreground"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Subject and meta info */}
        <div className="flex-1 lg:ml-[336px]">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-foreground truncate">
              {subject}
            </h1>
            <div className="hidden sm:flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
                총 강의시간 {totalDuration}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
                강의 수 {totalLectures}강
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};