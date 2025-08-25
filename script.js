// Global state
let currentLecture = {
    id: "1",
    title: "소유권과 점유권의 기본 개념",
    subject: "민법 및 민사특별법",
    section: "핵심개념입문",
    duration: "36:30",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    progress: 45,
    totalLectures: 3,
    totalDuration: "01:57:30"
};

let expandedSubjects = ["민법 및 민사특별법"];
let expandedSections = ["핵심개념입문과정"];
let activeTab = 'strategy';
let quizAnswers = {};
let showQuizResults = false;

// DOM Elements
const sidebarOverlay = document.getElementById('sidebar-overlay');
const lectureSidebar = document.getElementById('lecture-sidebar');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
const curriculumNav = document.getElementById('curriculum-nav');
const videoPlayer = document.getElementById('video-player');
const recentCoursesGrid = document.getElementById('recent-courses-grid');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    renderCurriculum();
    renderRecentCourses();
    renderQuiz();
    updateCurrentLecture(currentLecture);
});

function initializeApp() {
    // Setup tabs
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', (e) => switchTab(e.target.dataset.tab));
    });
    
    // Setup quiz buttons
    document.getElementById('submit-quiz').addEventListener('click', submitQuiz);
    document.getElementById('reset-quiz').addEventListener('click', resetQuiz);
    
    // Setup instructor profile click
    document.getElementById('instructor-profile').addEventListener('click', () => {
        scrollToInstructorCourses();
    });
}

function setupEventListeners() {
    mobileMenuBtn.addEventListener('click', () => openSidebar());
    sidebarCloseBtn.addEventListener('click', () => closeSidebar());
    sidebarOverlay.addEventListener('click', () => closeSidebar());
}

function openSidebar() {
    lectureSidebar.classList.remove('-translate-x-full');
    sidebarOverlay.classList.remove('hidden');
}

function closeSidebar() {
    lectureSidebar.classList.add('-translate-x-full');
    sidebarOverlay.classList.add('hidden');
}

function renderCurriculum() {
    curriculumNav.innerHTML = curriculumData.map(subject => `
        <div class="mb-4">
            <button class="subject-header" onclick="toggleSubject('${subject.id}')">
                <span>${subject.name}</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="${expandedSubjects.includes(subject.id) ? 'M19 9l-7 7-7-7' : 'M9 5l7 7-7 7'}"></path>
                </svg>
            </button>
            ${expandedSubjects.includes(subject.id) ? `
                <div class="mt-2 space-y-1">
                    ${subject.sections.map(section => `
                        <div>
                            <button class="section-header" onclick="toggleSection('${section.id}')">
                                <span>${section.name}</span>
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                          d="${expandedSections.includes(section.id) ? 'M19 9l-7 7-7-7' : 'M9 5l7 7-7 7'}"></path>
                                </svg>
                            </button>
                            ${expandedSections.includes(section.id) ? `
                                <div class="mt-2 pl-8 space-y-2">
                                    ${section.lectures.length > 0 ? 
                                        section.lectures.map(lecture => renderLecture(lecture, subject.name)).join('') :
                                        '<div class="empty-state">강의가 준비 중입니다.</div>'
                                    }
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                    ${subject.specialSections ? subject.specialSections.map(specialSection => `
                        <div>
                            <button class="section-header" onclick="toggleSection('${specialSection.id}')">
                                <span>${specialSection.name}</span>
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                          d="${expandedSections.includes(specialSection.id) ? 'M19 9l-7 7-7-7' : 'M9 5l7 7-7 7'}"></path>
                                </svg>
                            </button>
                            ${expandedSections.includes(specialSection.id) ? `
                                <div class="mt-2 pl-8 space-y-2">
                                    ${specialSection.lectures.length > 0 ? 
                                        specialSection.lectures.map(lecture => renderLecture(lecture, subject.name)).join('') :
                                        '<div class="empty-state">강의가 준비 중입니다.</div>'
                                    }
                                </div>
                            ` : ''}
                        </div>
                    `).join('') : ''}
                </div>
            ` : ''}
        </div>
    `).join('');
}

function renderLecture(lecture, subjectName) {
    const isCurrentLecture = currentLecture.id === lecture.id;
    const isCompleted = lecture.progress >= 90;
    
    return `
        <div class="lecture-item ${isCurrentLecture ? 'current' : ''} ${isCompleted ? 'lecture-completed' : ''}" 
             onclick="selectLecture('${lecture.id}', '${subjectName}')">
            <div class="lecture-number">
                ${isCompleted ? 
                    '<svg class="w-3 h-3 status-check" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>' : 
                    lecture.number
                }
            </div>
            <div class="lecture-info">
                <h4 class="lecture-title">${lecture.title}</h4>
                <div class="lecture-meta">
                    <span>${lecture.duration}</span>
                    <span>${lecture.progress}%</span>
                </div>
                <div class="progress-bar mt-2">
                    <div class="progress-fill" style="width: ${lecture.progress}%"></div>
                </div>
            </div>
            <button class="btn-lecture" onclick="event.stopPropagation(); selectLecture('${lecture.id}', '${subjectName}')">
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15"></path>
                </svg>
                ${lecture.progress > 0 ? '이어보기' : '재생'}
            </button>
        </div>
    `;
}

function toggleSubject(subjectId) {
    if (expandedSubjects.includes(subjectId)) {
        expandedSubjects = expandedSubjects.filter(id => id !== subjectId);
    } else {
        expandedSubjects.push(subjectId);
    }
    renderCurriculum();
}

function toggleSection(sectionId) {
    if (expandedSections.includes(sectionId)) {
        expandedSections = expandedSections.filter(id => id !== sectionId);
    } else {
        expandedSections.push(sectionId);
    }
    renderCurriculum();
}

function selectLecture(lectureId, subjectName) {
    const lecture = findLectureById(lectureId);
    if (lecture) {
        currentLecture = {
            ...lecture,
            subject: subjectName,
            section: "핵심개념입문",
            totalLectures: 3,
            totalDuration: "01:57:30"
        };
        updateCurrentLecture(currentLecture);
        renderCurriculum();
        closeSidebar();
    }
}

function findLectureById(lectureId) {
    for (const subject of curriculumData) {
        for (const section of subject.sections) {
            const lecture = section.lectures.find(l => l.id === lectureId);
            if (lecture) return lecture;
        }
        if (subject.specialSections) {
            for (const specialSection of subject.specialSections) {
                const lecture = specialSection.lectures.find(l => l.id === lectureId);
                if (lecture) return lecture;
            }
        }
    }
    return null;
}

function updateCurrentLecture(lecture) {
    document.getElementById('header-subject').textContent = lecture.subject;
    document.getElementById('header-total-duration').textContent = lecture.totalDuration;
    document.getElementById('header-total-lectures').textContent = lecture.totalLectures;
    document.getElementById('video-title').textContent = lecture.title;
    document.getElementById('video-total-duration').textContent = lecture.totalDuration;
    document.getElementById('video-total-lectures').textContent = lecture.totalLectures;
    
    const videoUrl = `${lecture.videoUrl}?rel=0&modestbranding=1&controls=1&iv_load_policy=3&playsinline=1`;
    videoPlayer.src = videoUrl;
}

function renderRecentCourses() {
    recentCoursesGrid.innerHTML = recentCoursesData.map(course => `
        <div class="edu-card">
            <div class="course-thumbnail">
                <img src="${course.thumbnail}" alt="${course.title}" class="w-full h-full object-cover">
                <div class="course-badge">
                    ${course.isNew ? '<span class="badge badge-new">신규</span>' : ''}
                    ${course.isPopular ? '<span class="badge badge-popular">인기</span>' : ''}
                </div>
                <div class="duration-overlay">${course.totalDuration}</div>
            </div>
            <div class="course-content">
                <h3 class="font-semibold text-foreground mb-2 line-clamp-2 leading-tight">${course.title}</h3>
                <div class="flex items-center gap-2 mb-3">
                    <span class="text-sm text-muted-foreground">${course.instructor}</span>
                    ${course.rating ? `
                        <div class="instructor-rating">
                            <svg class="icon-sm text-yellow-500 fill-current" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                            <span class="text-xs text-muted-foreground">${course.rating}</span>
                        </div>
                    ` : ''}
                </div>
                <div class="course-meta">
                    <div class="flex items-center gap-1">
                        <svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span>총 ${course.totalDuration}</span>
                    </div>
                    <div class="flex items-center gap-1">
                        <svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                        </svg>
                        <span>${course.studentCount}명</span>
                    </div>
                </div>
                ${course.progress !== undefined ? `
                    <div class="course-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${course.progress}%"></div>
                        </div>
                        <span class="course-progress-text">진도율 ${course.progress}%</span>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function switchTab(tabName) {
    activeTab = tabName;
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.add('hidden'));
    
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.remove('hidden');
}

function renderQuiz() {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = quizQuestions.map((q, index) => `
        <div class="quiz-question">
            <h4 class="font-medium mb-3">${index + 1}. ${q.question}</h4>
            <div class="quiz-options">
                <button class="quiz-option ${quizAnswers[index] === 'O' ? 'selected' : ''}" 
                        onclick="selectAnswer(${index}, 'O')">O</button>
                <button class="quiz-option ${quizAnswers[index] === 'X' ? 'selected' : ''}" 
                        onclick="selectAnswer(${index}, 'X')">X</button>
            </div>
            ${showQuizResults ? `
                <div class="quiz-explanation">
                    <strong>${quizAnswers[index] === q.answer ? '정답' : '오답'}:</strong> ${q.explanation}
                </div>
            ` : ''}
        </div>
    `).join('');
}

function selectAnswer(questionIndex, answer) {
    quizAnswers[questionIndex] = answer;
    renderQuiz();
}

function submitQuiz() {
    showQuizResults = true;
    renderQuiz();
    
    const correct = quizQuestions.filter((q, i) => quizAnswers[i] === q.answer).length;
    const total = quizQuestions.length;
    
    document.getElementById('quiz-results').innerHTML = `
        <h4 class="font-medium mb-2">퀴즈 결과</h4>
        <p>총 ${total}문제 중 ${correct}문제 정답 (정답률: ${Math.round(correct/total*100)}%)</p>
    `;
    document.getElementById('quiz-results').classList.remove('hidden');
}

function resetQuiz() {
    quizAnswers = {};
    showQuizResults = false;
    document.getElementById('quiz-results').classList.add('hidden');
    renderQuiz();
}

function scrollToInstructorCourses() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Copy functionality
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('copy-btn')) {
        const summaryItem = e.target.closest('.summary-item');
        const content = summaryItem.querySelector('p').textContent;
        navigator.clipboard.writeText(content).then(() => {
            e.target.textContent = '복사됨!';
            setTimeout(() => {
                e.target.textContent = '복사하기';
            }, 2000);
        });
    }
});