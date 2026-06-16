import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  NgZone,
} from '@angular/core';
import { Router } from '@angular/router';
import { QuestionService, Question as ApiQuestion } from '../../services/question.service';
import { ScoreService } from '../../services/score.service';
import { finalize } from 'rxjs/operators';

// ── Local Interfaces ────────────────────────────────────────────────────────────

interface Option {
  value: string;
  text: string;
}

type QuestionStatus =
  | 'answered'
  | 'notAnswered'
  | 'notVisited'
  | 'markedForReview'
  | 'answeredAndMarked';

interface Question {
  id: number;
  apiId: string;
  type: string;
  question: string;
  questionImage?: string | null;
  options: Option[];
  selectedOption: string | null;
  correctAnswer: string;         // A | B | C | D — from DB
  subject: string;               // Mathematics | Physics | Chemistry
  status: QuestionStatus;
  markedForReview: boolean;
}

interface Section {
  id: string;
  label: string;
  questions: Question[];
}

interface Candidate {
  name: string;
}

// ── Component ───────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-mock-question',
  standalone: false,
  templateUrl: './mock-question.component.html',
  styleUrls: ['./mock-question.component.css'],
})
export class MockQuestion implements OnInit {
  /** Passed from MainLayoutComponent */
  @Input() mockTestId: number = 1;
  @Input() examType: string = 'JEE Mains';

  candidate: Candidate = { name: 'Student' };

  sections: Section[] = [];
  activeSection = '';
  currentQuestionIndex = 0;
  selectedLanguage = 'English';
  isSubmitModalOpen = false;

  isLoading = true;
  loadError = '';

  private readonly SUBJECT_ORDER = ['Mathematics', 'Physics', 'Chemistry'];
  private readonly SUBJECT_IDS: Record<string, string> = {
    Mathematics: 'math',
    Physics: 'physics',
    Chemistry: 'chemistry',
  };

  constructor(
    private router: Router,
    private questionService: QuestionService,
    private scoreService: ScoreService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    const savedName =
      localStorage.getItem('dizi_studentName') ||
      sessionStorage.getItem('dizi_studentName');
    if (savedName) this.candidate.name = savedName;

    // Check if mock test is already attempted
    const studentId =
      localStorage.getItem('dizi_studentId') ||
      sessionStorage.getItem('dizi_studentId') || 'guest';

    this.scoreService.getStudentScores(studentId).subscribe({
      next: (res) => {
        const attempted = (res.scores || []).some(
          (s: any) => s.examType === this.examType && s.mockTestId === this.mockTestId
        );
        if (attempted) {
          alert('You have already submitted this exam and cannot attempt it again.');
          this.zone.run(() => {
            this.router.navigate(['/select-mocktest'], { queryParams: { examType: this.examType } });
          });
        } else {
          this.loadQuestions();
        }
      },
      error: (err) => {
        console.error('Check attempts error:', err);
        this.loadQuestions();
      }
    });
  }

  // ── Data Loading ─────────────────────────────────────────────────────────────

  loadQuestions(): void {
    this.isLoading = true;
    this.loadError = '';

    this.questionService
      .getQuestionsByMockTest(this.mockTestId, this.examType)
      .pipe(
        finalize(() => {
          this.zone.run(() => {
            this.isLoading = false;
            this.cdr.detectChanges();
          });
        })
      )
      .subscribe({
        next: (res) => {
          const apiQuestions: ApiQuestion[] = res.questions ?? [];
          this.zone.run(() => {
            this.buildSections(apiQuestions);
            this.cdr.detectChanges();
          });
        },
        error: (err) => {
          console.error('Failed to load questions:', err);
          this.zone.run(() => {
            this.loadError =
              'Failed to load questions. Please check your connection and try again.';
            this.cdr.detectChanges();
          });
        },
      });
  }

  private buildSections(apiQuestions: ApiQuestion[]): void {
    const grouped: Record<string, ApiQuestion[]> = {};
    for (const subj of this.SUBJECT_ORDER) grouped[subj] = [];

    apiQuestions.forEach((q) => {
      const subj = q.subject?.trim();
      if (subj && grouped[subj] !== undefined) {
        grouped[subj].push(q);
      } else if (subj) {
        if (!grouped[subj]) grouped[subj] = [];
        grouped[subj].push(q);
      }
    });

    this.sections = Object.keys(grouped)
      .filter((subj) => grouped[subj].length > 0)
      .map((subj) => ({
        id: this.SUBJECT_IDS[subj] || subj.toLowerCase(),
        label: subj,
        questions: grouped[subj].map((q, idx) => this.mapApiQuestion(q, idx + 1)),
      }));

    if (this.sections.length > 0) {
      this.activeSection = this.sections[0].id;
      this.currentQuestionIndex = 0;
      this.markCurrentQuestionVisited();
    }
  }

  private mapApiQuestion(q: ApiQuestion, displayIndex: number): Question {
    return {
      id: displayIndex,
      apiId: q.id,
      type: 'MCQ',
      question: q.questionText,
      questionImage: q.questionImage || null,
      options: [
        { value: 'A', text: q.optionA },
        { value: 'B', text: q.optionB },
        { value: 'C', text: q.optionC },
        { value: 'D', text: q.optionD },
      ],
      selectedOption: null,
      correctAnswer: q.correctAnswer,
      subject: q.subject,
      status: 'notVisited',
      markedForReview: false,
    };
  }

  // ── Computed Properties ──────────────────────────────────────────────────────

  get currentSection(): Section {
    return this.sections.find((s) => s.id === this.activeSection) ?? this.sections[0];
  }

  get currentQuestion(): Question {
    return this.currentSection?.questions[this.currentQuestionIndex];
  }

  get allQuestions(): Question[] {
    return this.sections.flatMap((s) => s.questions);
  }

  get answeredCount(): number {
    return this.allQuestions.filter(
      (q) => q.status === 'answered' || q.status === 'answeredAndMarked'
    ).length;
  }

  get notAnsweredCount(): number {
    return this.allQuestions.filter((q) => q.status === 'notAnswered').length;
  }

  get notVisitedCount(): number {
    return this.allQuestions.filter((q) => q.status === 'notVisited').length;
  }

  get markedForReviewCount(): number {
    return this.allQuestions.filter((q) => q.status === 'markedForReview').length;
  }

  get answeredAndMarkedCount(): number {
    return this.allQuestions.filter((q) => q.status === 'answeredAndMarked').length;
  }

  get totalQuestions(): number {
    return this.allQuestions.length;
  }

  // ── Navigation Handlers ──────────────────────────────────────────────────────

  handleSectionChange(sectionId: string): void {
    this.activeSection = sectionId;
    this.currentQuestionIndex = 0;
    this.markCurrentQuestionVisited();
  }

  handleQuestionNavigation(index: number): void {
    this.currentQuestionIndex = index;
    this.markCurrentQuestionVisited();
  }

  // ── Answer Handlers ──────────────────────────────────────────────────────────

  handleOptionSelect(value: string): void {
    if (this.currentQuestion) this.currentQuestion.selectedOption = value;
  }

  handleMarkReview(): void {
    if (!this.currentQuestion) return;
    if (this.currentQuestion.selectedOption) {
      this.currentQuestion.status = 'answeredAndMarked';
    } else {
      this.currentQuestion.status = 'markedForReview';
    }
    this.currentQuestion.markedForReview = true;
    this.goToNextQuestion();
  }

  handleClearResponse(): void {
    if (!this.currentQuestion) return;
    this.currentQuestion.selectedOption = null;
    this.currentQuestion.markedForReview = false;
    this.currentQuestion.status = 'notAnswered';
  }

  handleSaveNext(): void {
    this.saveCurrentQuestionStatus();
    this.goToNextQuestion();
  }

  handleSubmit(): void {
    this.saveCurrentQuestionStatus();
    this.isSubmitModalOpen = true;
  }

  closeSubmitModal(): void {
    this.isSubmitModalOpen = false;
  }

  confirmSubmit(): void {
    this.isSubmitModalOpen = false;

    // ── 1. Calculate scores ──────────────────────────────────────────────
    const score = this.calculateScore();

    const studentId =
      localStorage.getItem('dizi_studentId') ||
      sessionStorage.getItem('dizi_studentId') || 'guest';
    const studentName =
      localStorage.getItem('dizi_studentName') ||
      sessionStorage.getItem('dizi_studentName') || 'Student';

    const newEntry = {
      studentId,
      studentName,
      examType: this.examType,
      mockTestId: this.mockTestId,
      mock: `Mock Test ${this.mockTestId}`,
      phy: score.physics,
      chm: score.chemistry,
      math: score.mathematics,
      total: score.total,
      maxMarks: score.maxMarks,
      correct: score.correct,
      wrong: score.wrong,
      unattempted: score.unattempted,
      submittedAt: new Date().toISOString(),
    };

    // ── 2. Save score to database via ScoreService ──────────────────────
    this.scoreService.submitScore(newEntry).subscribe({
      next: (res) => {
        // Also save last score locally so Thank You page can retrieve it instantly
        localStorage.setItem('dizi_last_score', JSON.stringify(newEntry));

        // Write attempt lock just in case fallback is needed
        const attemptKey = `dizi_attempted_${studentId}_${this.examType}_${this.mockTestId}`;
        localStorage.setItem(attemptKey, 'true');

        this.zone.run(() => {
          this.router.navigate(['/mock-submit']);
        });
      },
      error: (err) => {
        console.error('submitScore error:', err);
        alert(err.error?.message || 'Failed to submit score. Please try again.');
      }
    });
  }

  // ── Score Calculation (+4 correct, -1 wrong, 0 unattempted) ─────────────────
  private calculateScore(): {
    physics: number; chemistry: number; mathematics: number;
    total: number; maxMarks: number; correct: number; wrong: number; unattempted: number;
  } {
    const subjectMarks: Record<string, number> = {
      Mathematics: 0, Physics: 0, Chemistry: 0
    };
    let correct = 0, wrong = 0, unattempted = 0;

    this.allQuestions.forEach((q) => {
      if (!q.selectedOption) {
        unattempted++;
      } else if (q.selectedOption === q.correctAnswer) {
        subjectMarks[q.subject] = (subjectMarks[q.subject] || 0) + 4;
        correct++;
      } else {
        subjectMarks[q.subject] = (subjectMarks[q.subject] || 0) - 1;
        wrong++;
      }
    });

    const maxMarks = this.allQuestions.length * 4;
    const total = subjectMarks['Mathematics'] + subjectMarks['Physics'] + subjectMarks['Chemistry'];

    return {
      physics: Math.max(0, subjectMarks['Physics']),
      chemistry: Math.max(0, subjectMarks['Chemistry']),
      mathematics: Math.max(0, subjectMarks['Mathematics']),
      total: Math.max(0, total),
      maxMarks,
      correct,
      wrong,
      unattempted,
    };
  }

  // ── UI Helpers ───────────────────────────────────────────────────────────────

  getQuestionButtonClass(question: Question, index: number): string {
    const classes = [this.getStatusClass(question.status)];
    if (index === this.currentQuestionIndex) classes.push('current');
    return classes.join(' ');
  }

  getMathLines(mathContent: string): string[] {
    return mathContent.split('\n');
  }

  // ── Private Helpers ──────────────────────────────────────────────────────────

  private getStatusClass(status: QuestionStatus): string {
    switch (status) {
      case 'answered':         return 'answered';
      case 'notAnswered':      return 'not-answered';
      case 'markedForReview':  return 'marked-review';
      case 'answeredAndMarked':return 'answered-marked-review';
      default:                 return 'not-visited';
    }
  }

  private markCurrentQuestionVisited(): void {
    if (this.currentQuestion?.status === 'notVisited') {
      this.currentQuestion.status = 'notAnswered';
    }
  }

  private saveCurrentQuestionStatus(): void {
    if (!this.currentQuestion) return;
    if (this.currentQuestion.selectedOption) {
      this.currentQuestion.status = this.currentQuestion.markedForReview
        ? 'answeredAndMarked' : 'answered';
    } else {
      this.currentQuestion.status = this.currentQuestion.markedForReview
        ? 'markedForReview' : 'notAnswered';
    }
  }

  private goToNextQuestion(): void {
    if (!this.currentSection) return;
    if (this.currentQuestionIndex < this.currentSection.questions.length - 1) {
      this.currentQuestionIndex++;
      this.markCurrentQuestionVisited();
      return;
    }
    const sectionIndex = this.sections.findIndex((s) => s.id === this.activeSection);
    const nextSection = this.sections[sectionIndex + 1];
    if (nextSection) {
      this.activeSection = nextSection.id;
      this.currentQuestionIndex = 0;
      this.markCurrentQuestionVisited();
    }
  }
}
