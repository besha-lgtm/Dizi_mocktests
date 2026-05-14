import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  type: string;
  question: string;
  mathContent?: string;
  options: Option[];
  selectedOption: string | null;
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

@Component({
  selector: 'app-mock-question',
  standalone: false,
  templateUrl: './mock-question.component.html',
  styleUrls: ['./mock-question.component.css'],
})
export class MockQuestion implements OnInit {
  candidate: Candidate = {
    name: 'John Smith',
  };

  sections: Section[] = [
    {
      id: 'math',
      label: 'Math Sec 1',
      questions: [
        {
          id: 1,
          type: 'MCQ',
          question:
            'Let R denote the set of all real numbers. Let aᵢ, bᵢ ∈ ℝ for i ∈ {1,2,3}. Define functions f, g, h: ℝ → ℝ as below. If f(x) ≠ g(x) for every x ∈ ℝ, then the coefficient of x³ in h(x) is',
          mathContent:
            'f(x) = a₁ + 10x + a₂x² + a₃x³ + x⁴\ng(x) = b₁ + 3x + 2x² + b₃x³ + x⁴\nh(x) = f(x+1) - g(x+2)',
          options: [
            { value: 'A', text: '15' },
            { value: 'B', text: '-15' },
            { value: 'C', text: '10' },
            { value: 'D', text: '-10' },
          ],
          selectedOption: null,
          status: 'notVisited',
          markedForReview: false,
        },
        {
          id: 2,
          type: 'MCQ',
          question:
            'If the sum of first n terms is 3n² - 2n, find the nth term.',
          options: [
            { value: 'A', text: '6n - 5' },
            { value: 'B', text: '6n + 5' },
            { value: 'C', text: '5n - 6' },
            { value: 'D', text: '5n + 6' },
          ],
          selectedOption: null,
          status: 'notVisited',
          markedForReview: false,
        },
        {
          id: 3,
          type: 'MCQ',
          question: 'What is sin(45°) + cos(45°)?',
          options: [
            { value: 'A', text: '√2' },
            { value: 'B', text: '2' },
            { value: 'C', text: '1' },
            { value: 'D', text: '1/2' },
          ],
          selectedOption: null,
          status: 'notVisited',
          markedForReview: false,
        },
        {
          id: 4,
          type: 'MCQ',
          question: 'Find derivative of x³ + 2x² - 5x + 1',
          options: [
            { value: 'A', text: '3x² + 4x - 5' },
            { value: 'B', text: '3x² + 4x + 5' },
            { value: 'C', text: '3x² - 4x - 5' },
            { value: 'D', text: '3x² - 4x + 5' },
          ],
          selectedOption: null,
          status: 'notVisited',
          markedForReview: false,
        },
      ],
    },
    {
      id: 'physics',
      label: 'Physics Sec 1',
      questions: [
        {
          id: 1,
          type: 'MCQ',
          question: 'What is SI unit of force?',
          options: [
            { value: 'A', text: 'Kilogram' },
            { value: 'B', text: 'Newton' },
            { value: 'C', text: 'Joule' },
            { value: 'D', text: 'Watt' },
          ],
          selectedOption: null,
          status: 'notVisited',
          markedForReview: false,
        },
      ],
    },
    {
      id: 'chemistry',
      label: 'Chemistry Sec 1',
      questions: [
        {
          id: 1,
          type: 'MCQ',
          question: 'Chemical symbol for Gold?',
          options: [
            { value: 'A', text: 'Go' },
            { value: 'B', text: 'Gd' },
            { value: 'C', text: 'Au' },
            { value: 'D', text: 'Ag' },
          ],
          selectedOption: null,
          status: 'notVisited',
          markedForReview: false,
        },
      ],
    },
  ];

  activeSection = 'math';
  currentQuestionIndex = 0;
  selectedLanguage = 'English';
  isSubmitModalOpen = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.markCurrentQuestionVisited();
  }

  get currentSection(): Section {
    return (
      this.sections.find((section) => section.id === this.activeSection) ??
      this.sections[0]
    );
  }

  get currentQuestion(): Question {
    return this.currentSection.questions[this.currentQuestionIndex];
  }

  get allQuestions(): Question[] {
    return this.sections.flatMap((section) => section.questions);
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
    return this.allQuestions.filter(
      (q) => q.status === 'markedForReview'
    ).length;
  }

  get answeredAndMarkedCount(): number {
    return this.allQuestions.filter(
      (q) => q.status === 'answeredAndMarked'
    ).length;
  }

  handleSectionChange(sectionId: string): void {
    this.activeSection = sectionId;
    this.currentQuestionIndex = 0;
    this.markCurrentQuestionVisited();
  }

  handleQuestionNavigation(index: number): void {
    this.currentQuestionIndex = index;
    this.markCurrentQuestionVisited();
  }

  handleOptionSelect(value: string): void {
    this.currentQuestion.selectedOption = value;
  }

  handleMarkReview(): void {
    if (this.currentQuestion.selectedOption) {
      this.currentQuestion.status = 'answeredAndMarked';
    } else {
      this.currentQuestion.status = 'markedForReview';
    }

    this.currentQuestion.markedForReview = true;
    this.goToNextQuestion();
  }

  handleClearResponse(): void {
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
    this.router.navigate(['/mock-submit']);
  }

  getQuestionButtonClass(question: Question, index: number): string {
    const classes = [this.getStatusClass(question.status)];

    if (index === this.currentQuestionIndex) {
      classes.push('current');
    }

    return classes.join(' ');
  }

  getMathLines(mathContent: string): string[] {
    return mathContent.split('\n');
  }

  private getStatusClass(status: QuestionStatus): string {
    switch (status) {
      case 'answered':
        return 'answered';
      case 'notAnswered':
        return 'not-answered';
      case 'markedForReview':
        return 'marked-review';
      case 'answeredAndMarked':
        return 'answered-marked-review';
      default:
        return 'not-visited';
    }
  }

  private markCurrentQuestionVisited(): void {
    if (this.currentQuestion.status === 'notVisited') {
      this.currentQuestion.status = 'notAnswered';
    }
  }

  private saveCurrentQuestionStatus(): void {
    if (this.currentQuestion.selectedOption) {
      this.currentQuestion.status = this.currentQuestion.markedForReview
        ? 'answeredAndMarked'
        : 'answered';
    } else {
      this.currentQuestion.status = this.currentQuestion.markedForReview
        ? 'markedForReview'
        : 'notAnswered';
    }
  }

  private goToNextQuestion(): void {
    if (this.currentQuestionIndex < this.currentSection.questions.length - 1) {
      this.currentQuestionIndex++;
      this.markCurrentQuestionVisited();
      return;
    }

    const sectionIndex = this.sections.findIndex(
      (section) => section.id === this.activeSection
    );
    const nextSection = this.sections[sectionIndex + 1];

    if (nextSection) {
      this.activeSection = nextSection.id;
      this.currentQuestionIndex = 0;
      this.markCurrentQuestionVisited();
    }
  }
}
