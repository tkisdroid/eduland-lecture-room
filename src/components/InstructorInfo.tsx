export const InstructorInfo = () => {
  return (
    <section className="mb-8">
      <div className="edu-card p-6">
        <div 
          className="flex items-start gap-4 cursor-pointer hover:bg-muted/30 rounded-lg p-2 -m-2 transition-colors"
          onClick={() => {
            // Navigate to instructor's courses
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          {/* Instructor Photo */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-muted-foreground">김</span>
            </div>
          </div>
          
          {/* Instructor Info */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-1">
              김민수 강사
            </h3>
            <p className="text-muted-foreground text-sm mb-3">
              공인중개사 시험 대비 전문 강사 · 15년 경력 · 합격률 95%
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="chip-meta">민법 전문</span>
              <span className="chip-meta">부동산학 전문</span>
              <span className="chip-meta">판례 분석</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};