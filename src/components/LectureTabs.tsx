import { useState } from "react";
import { Copy, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export const LectureTabs = () => {
  const [activeTab, setActiveTab] = useState("strategy");
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: boolean | null }>({});
  const [showResults, setShowResults] = useState(false);

  const tabs = [
    { id: "strategy", label: "AI 학습전략" },
    { id: "summary", label: "AI 학습요약" },
    { id: "quiz", label: "OX퀴즈" },
  ];

  const strategyContent = [
    "소유권의 개념을 명확히 이해하고 점유권과의 차이점을 구분하세요",
    "민법 제185조~제259조의 소유권 관련 조문을 반복 학습하세요", 
    "판례를 통해 실제 적용 사례를 익히고 문제 해결 능력을 키우세요",
    "기출문제를 풀며 출제 경향을 파악하고 약점을 보완하세요"
  ];

  const summaryItems = [
    {
      title: "소유권의 정의",
      content: "소유권은 물건을 직접 지배하여 사용·수익·처분할 수 있는 완전한 물권이다."
    },
    {
      title: "소유권의 특성", 
      content: "완전성, 탄력성, 영속성, 관념성의 4가지 특성을 가진다."
    },
    {
      title: "점유권과의 차이",
      content: "소유권은 본권이고, 점유권은 사실상의 지배를 기초로 한 권리이다."
    }
  ];

  const quizQuestions = [
    {
      id: "q1",
      question: "소유권은 물건에 대한 가장 완전한 권리이다.",
      answer: true,
      explanation: "소유권은 물건을 직접 지배하여 사용·수익·처분할 수 있는 완전한 물권으로, 물권 중 가장 완전한 권리입니다."
    },
    {
      id: "q2", 
      question: "점유권은 소유권과 동일한 성격의 권리이다.",
      answer: false,
      explanation: "점유권은 사실상의 지배를 기초로 한 권리이고, 소유권은 법률상 완전한 지배권이므로 성격이 다릅니다."
    },
    {
      id: "q3",
      question: "소유권의 탄력성은 제한물권이 소멸하면 완전한 내용을 회복한다는 의미이다.", 
      answer: true,
      explanation: "탄력성은 소유권에 제한이 가해져도 그 제한이 없어지면 완전한 내용을 회복한다는 특성입니다."
    }
  ];

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
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">핵심 요약</h3>
      </div>
      
      <div className="space-y-3">
        {summaryItems.map((item, index) => (
          <div key={index} className="edu-card p-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-foreground">{item.title}</h4>
              <button 
                onClick={() => copyToClipboard(`${item.title}: ${item.content}`)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{item.content}</p>
          </div>
        ))}
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