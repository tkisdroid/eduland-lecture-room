import { useState, useEffect } from "react";
import { Copy, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { getLectureStrategy, getLectureSummary, getLectureQuiz } from "@/data/lectureContent";

export const LectureTabs = ({ currentLectureId = "1" }: { currentLectureId?: string }) => {
  const [activeTab, setActiveTab] = useState("strategy");
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: boolean | null }>({});
  const [showResults, setShowResults] = useState(false);

  const tabs = [
    { id: "strategy", label: "AI 학습전략" },
    { id: "summary", label: "AI 학습요약" },
    { id: "quiz", label: "OX퀴즈" },
  ];

  // 현재 강의의 동적 콘텐츠 가져오기
  const strategyContent = getLectureStrategy(currentLectureId);
  const summaryContent = getLectureSummary(currentLectureId);
  const quizQuestions = getLectureQuiz(currentLectureId);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const submitQuiz = () => {
    setShowResults(true);
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setShowResults(false);
  };

  // Auto-submit when all questions are answered
  useEffect(() => {
    const allQuestionsAnswered = quizQuestions.every(q => 
      quizAnswers[q.id] !== undefined && quizAnswers[q.id] !== null
    );
    
    if (allQuestionsAnswered && !showResults) {
      submitQuiz();
    }
  }, [quizAnswers, showResults]);

  const renderStrategyTab = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">학습 전략</h3>
      <ul className="space-y-3">
        {strategyContent.map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-accent/10 text-accent rounded-full flex items-center justify-center text-sm font-medium">
              {index + 1}
            </span>
            <span className="text-sm text-foreground">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  const renderSummaryTab = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">핵심 요약</h3>
      
      <div className="edu-card p-6">
        <div className="whitespace-pre-line text-sm text-foreground leading-relaxed">
          {summaryContent}
        </div>
      </div>
    </div>
  );

  const renderQuizTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">OX 퀴즈</h3>
        <div className="flex gap-2">
          <button onClick={resetQuiz} className="btn-lecture bg-muted text-muted-foreground">
            <RotateCcw className="w-3 h-3 mr-1" />
            리셋
          </button>
          {!showResults && (
            <button onClick={submitQuiz} className="btn-lecture">
              제출
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {quizQuestions.map((q, index) => (
          <div key={q.id} className="edu-card p-4">
            <div className="mb-3">
              <span className="text-sm text-muted-foreground">문제 {index + 1}</span>
              <p className="font-medium mt-1">{q.question}</p>
            </div>

            <div className="flex gap-3 mb-3">
              <button
                onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: true }))}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  quizAnswers[q.id] === true 
                    ? "bg-accent text-white" 
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
                disabled={showResults}
              >
                O
              </button>
              <button
                onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: false }))}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  quizAnswers[q.id] === false
                    ? "bg-accent text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
                disabled={showResults}
              >
                X
              </button>
            </div>

            {showResults && (
              <div className={cn(
                "p-3 rounded-lg text-sm",
                quizAnswers[q.id] === q.answer 
                  ? "bg-accent-weak text-foreground" 
                  : "bg-red-50 text-foreground"
              )}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">
                    {quizAnswers[q.id] === q.answer ? "정답" : "오답"}
                  </span>
                  <span className="text-muted-foreground">
                    (정답: {q.answer ? "O" : "X"})
                  </span>
                </div>
                <p className="text-muted-foreground">{q.explanation}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section className="mb-8">
      {/* Tab Navigation */}
      <div className="border-b border-border mb-6">
        <nav className="flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "py-3 px-1 border-b-2 font-medium text-sm transition-colors",
                activeTab === tab.id
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-card rounded-lg border border-border p-6">
        {activeTab === "strategy" && renderStrategyTab()}
        {activeTab === "summary" && renderSummaryTab()}
        {activeTab === "quiz" && renderQuizTab()}
      </div>
    </section>
  );
};