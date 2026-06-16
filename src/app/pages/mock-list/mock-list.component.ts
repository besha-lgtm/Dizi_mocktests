import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { QuestionService, Question } from '../../services/question.service';

@Component({
  selector    : 'app-mock-list',
  standalone  : false,
  templateUrl : './mock-list.component.html',
  styleUrls   : ['./mock-list.component.css']
})
export class MockListComponent implements OnInit {

  subject         : string = '';
  showExamDropdown: boolean = false;
  isLoading       : boolean = false;
  apiError        : string  = '';

  // ─── Working arrays ──────────────────────────────────────────────────────────
  allQuestions      : Question[] = [];
  filteredQuestions : Question[] = [];
  paginatedQuestions: Question[] = [];

  // Filter state
  selectedTopic      : string = 'All Topics';
  selectedDifficulty : string = 'All Difficulty';
  selectedExamType   : string = 'All Exams';

  examTypes: string[] = ['All Exams', 'JEE Mains', 'JEE Advanced'];

  examDropdownOpen      : boolean = false;
  topicDropdownOpen     : boolean = false;
  difficultyDropdownOpen: boolean = false;

  // Pagination
  currentPage : number = 1;
  itemsPerPage: number = 4;
  totalPages  : number = 1;
  pageNumbers : (number | string)[] = [];

  // Dynamic topics list (built from loaded questions)
  topics      : string[] = ['All Topics'];
  difficulties: string[] = ['All Difficulty', 'Easy', 'Medium', 'Hard'];

  // Stats
  totalQuestions: number = 0;
  activeTopics  : number = 0;
  lastUpdate    : string = '—';

  // ─── Topic map per subject (for sidebar filters) ─────────────────────────────
  private topicMap: Record<string, string[]> = {
    Mathematics : ['All Topics', 'Algebra', 'Calculus', 'Geometry', 'Trigonometry', 'Statistics'],
    Physics     : ['All Topics', 'Mechanics', 'Electromagnetism', 'Optics', 'Thermodynamics', 'Waves', 'Modern Physics'],
    Chemistry   : ['All Topics', 'Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Electrochemistry'],
  };

  constructor(
    private route           : ActivatedRoute,
    private router          : Router,
    private questionService : QuestionService,
    private cdr             : ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.subject = params['subject'] || 'Mathematics';
      this.loadSubjectData();
    });
  }

  // ─── Load from API ────────────────────────────────────────────────────────────
  loadSubjectData(): void {
    this.isLoading = true;
    this.apiError  = '';

    // Reset filters & topic list for the new subject
    this.topics            = this.topicMap[this.subject] ?? ['All Topics'];
    this.selectedTopic     = 'All Topics';
    this.selectedDifficulty= 'All Difficulty';
    this.selectedExamType  = 'All Exams';

    this.questionService.getQuestions(this.subject)
      .pipe(
        finalize(() => {
          // Guaranteed to run whether success or error
          this.isLoading = false;
          this.cdr.detectChanges(); // Force Angular to update the view
        })
      )
      .subscribe({
        next: (res) => {
          this.allQuestions   = res.questions ?? [];
          this.totalQuestions = this.allQuestions.length;
          this.activeTopics   = new Set(this.allQuestions.map(q => q.topic)).size;
          this.lastUpdate     = this.allQuestions.length > 0
            ? (this.allQuestions[0].lastModified ?? '—')
            : '—';
          this.applyFilters();
        },
        error: (err) => {
          this.apiError     = 'Failed to load questions. Please check your connection.';
          console.error('getQuestions error:', err);
          this.allQuestions = [];
          this.applyFilters();
        }
      });
  }

  // ─── Filters ─────────────────────────────────────────────────────────────────
  applyFilters(): void {
    this.filteredQuestions = this.allQuestions.filter(q => {
      const topicMatch = this.selectedTopic === 'All Topics' || q.topic === this.selectedTopic;
      const diffMatch  = this.selectedDifficulty === 'All Difficulty' || q.difficulty === this.selectedDifficulty;
      const examMatch  = this.selectedExamType === 'All Exams' || q.examType === this.selectedExamType;
      return topicMatch && diffMatch && examMatch;
    });

    this.currentPage = 1;
    this.calculatePagination();
    this.updatePage();
  }

  // ─── Pagination ───────────────────────────────────────────────────────────────
  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredQuestions.length / this.itemsPerPage);
    this.buildPageNumbers();
  }

  buildPageNumbers(): void {
    const pages: (number | string)[] = [];
    if (this.totalPages <= 5) {
      for (let i = 1; i <= this.totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (this.currentPage > 3) pages.push('...');
      for (let i = Math.max(2, this.currentPage - 1); i <= Math.min(this.totalPages - 1, this.currentPage + 1); i++) {
        pages.push(i);
      }
      if (this.currentPage < this.totalPages - 2) pages.push('...');
      pages.push(this.totalPages);
    }
    this.pageNumbers = pages;
  }

  updatePage(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedQuestions = this.filteredQuestions.slice(start, start + this.itemsPerPage);
  }

  goToPage(page: number | string): void {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.buildPageNumbers();
      this.updatePage();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) { this.currentPage--; this.buildPageNumbers(); this.updatePage(); }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) { this.currentPage++; this.buildPageNumbers(); this.updatePage(); }
  }

  // ─── Dropdown Toggles ─────────────────────────────────────────────────────────
  selectTopic(topic: string): void {
    this.selectedTopic = topic;
    this.topicDropdownOpen = false;
    this.applyFilters();
  }

  selectDifficulty(diff: string): void {
    this.selectedDifficulty = diff;
    this.difficultyDropdownOpen = false;
    this.applyFilters();
  }

  selectExamType(exam: string): void {
    this.selectedExamType = exam;
    this.examDropdownOpen = false;
    this.applyFilters();
  }

  toggleTopicDropdown(): void {
    this.topicDropdownOpen = !this.topicDropdownOpen;
    this.difficultyDropdownOpen = false;
    this.examDropdownOpen = false;
  }

  toggleDifficultyDropdown(): void {
    this.difficultyDropdownOpen = !this.difficultyDropdownOpen;
    this.topicDropdownOpen = false;
    this.examDropdownOpen = false;
  }

  toggleExamDropdown(): void {
    this.examDropdownOpen = !this.examDropdownOpen;
    this.topicDropdownOpen = false;
    this.difficultyDropdownOpen = false;
  }

  closeDropdowns(): void {
    this.topicDropdownOpen      = false;
    this.difficultyDropdownOpen = false;
    this.examDropdownOpen       = false;
    this.showExamDropdown       = false;
  }

  // ─── CRUD Actions ─────────────────────────────────────────────────────────────

  addNewQuestion(examType: string): void {
    this.showExamDropdown = false;
    this.router.navigate(
      ['/subject-upload', this.subject],
      { queryParams: { examType } }
    );
  }

  editQuestion(question: Question): void {
    this.router.navigate(
      ['/subject-upload', this.subject],
      { state: { editData: question } }
    );
  }

  deleteQuestion(id: string): void {
    if (!confirm('Are you sure you want to delete this question?')) return;

    this.questionService.deleteQuestion(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.allQuestions   = this.allQuestions.filter(q => q.id !== id);
          this.totalQuestions = this.allQuestions.length;
          this.activeTopics   = new Set(this.allQuestions.map(q => q.topic)).size;
          this.applyFilters();
        } else {
          alert('Failed to delete question: ' + res.message);
        }
      },
      error: (err) => {
        console.error('deleteQuestion error:', err);
        alert('Error deleting question. Please try again.');
      }
    });
  }

  goBackToSubjects(): void {
    this.router.navigate(['/teacher-dashboard']);
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────────
  getShowingText(): string {
    if (this.filteredQuestions.length === 0) return 'Showing 0 questions';
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end   = Math.min(this.currentPage * this.itemsPerPage, this.filteredQuestions.length);
    return `Showing ${start}–${end} of ${this.filteredQuestions.length} questions`;
  }

  getDifficultyClass(difficulty: string): string {
    switch (difficulty) {
      case 'Easy'  : return 'badge-easy';
      case 'Medium': return 'badge-medium';
      case 'Hard'  : return 'badge-hard';
      default      : return '';
    }
  }

  getTopicClass(topic: string): string {
    const map: Record<string, string> = {
      // Mathematics
      'Algebra'           : 'topic-algebra',
      'Calculus'          : 'topic-calculus',
      'Geometry'          : 'topic-geometry',
      'Trigonometry'      : 'topic-trigonometry',
      'Statistics'        : 'topic-statistics',
      // Physics
      'Mechanics'         : 'topic-mechanics',
      'Electromagnetism'  : 'topic-electromagnetism',
      'Optics'            : 'topic-optics',
      'Thermodynamics'    : 'topic-thermodynamics',
      'Waves'             : 'topic-waves',
      'Modern Physics'    : 'topic-modern',
      // Chemistry
      'Organic Chemistry' : 'topic-organic',
      'Inorganic Chemistry':'topic-inorganic',
      'Physical Chemistry': 'topic-physical',
      'Electrochemistry'  : 'topic-electrochemistry',
    };
    return map[topic] ?? 'topic-default';
  }
}
