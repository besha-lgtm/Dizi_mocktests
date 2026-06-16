import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { Router } from '@angular/router';
import { ScoreService } from '../../services/score.service';

@Component({
  selector: 'app-score-management',
  standalone: false,
  templateUrl: './score-management.component.html',
  styleUrls: ['./score-management.component.css']
})
export class ScoreManagementComponent implements OnInit {

  searchText    = '';
  selectedExam  = 'All';
  selectedMock  = 'All';

  currentPage   = 1;
  itemsPerPage  = 10;

  scores        : any[] = [];
  filteredScores: any[] = [];
  paginatedScores: any[] = [];

  /** Unique mock test labels for the filter dropdown (built from data) */
  mockOptions: string[] = [];

  constructor(private router: Router, private scoreService: ScoreService) {}

  ngOnInit(): void {
    this.loadScores();
  }

  // ── Load real scores from localStorage ──────────────────────────────────────
  loadScores(): void {
    this.scoreService.getScores().subscribe({
      next: (res) => {
        const stored = res.scores || [];

        // Normalize stored structure to match the table columns
        this.scores = stored.map((s: any) => ({
          id         : s.studentId  || '—',
          name       : s.studentName|| '—',
          exam       : s.examType   || '—',
          mock       : s.mock       || `Mock Test ${s.mockTestId || 1}`,
          mockTestId : s.mockTestId || 1,
          phy        : s.phy        ?? 0,
          chm        : s.chm        ?? 0,
          math       : s.math       ?? 0,
          total      : s.total      ?? 0,
          maxMarks   : s.maxMarks   ?? 0,
          correct    : s.correct    ?? 0,
          wrong      : s.wrong      ?? 0,
          unattempted: s.unattempted ?? 0,
          submittedAt: s.submittedAt ? new Date(s.submittedAt).toLocaleString() : '—',
        }));

        // Build dynamic mock dropdown options
        const mocks = new Set<string>(this.scores.map(s => s.mock));
        this.mockOptions = Array.from(mocks).sort();

        this.filteredScores = [...this.scores];
        this.updatePagination();
      },
      error: (err) => {
        console.error('Failed to load scores from backend:', err);
      }
    });
  }

  // ── Computed stats ───────────────────────────────────────────────────────────
  get highestScore(): number {
    if (!this.scores.length) return 0;
    return Math.max(...this.scores.map(s => s.total));
  }

  get uniqueMockCount(): number {
    return new Set(this.scores.map(s => `${s.exam}-${s.mockTestId}`)).size;
  }

  // ── Filtering ────────────────────────────────────────────────────────────────
  filterScores(): void {
    this.filteredScores = this.scores.filter(student => {
      const q = this.searchText.toLowerCase();
      const matchesSearch =
        student.name.toLowerCase().includes(q) ||
        student.id.toLowerCase().includes(q) ||
        (student.exam && student.exam.toLowerCase().includes(q));

      const matchesExam =
        this.selectedExam === 'All' || student.exam === this.selectedExam;

      const matchesMock =
        this.selectedMock === 'All' || student.mock === this.selectedMock;

      return matchesSearch && matchesExam && matchesMock;
    });

    this.currentPage = 1;
    this.updatePagination();
  }

  // ── Pagination ───────────────────────────────────────────────────────────────
  updatePagination(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedScores = this.filteredScores.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredScores.length / this.itemsPerPage));
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) { this.currentPage++; this.updatePagination(); }
  }

  prevPage(): void {
    if (this.currentPage > 1) { this.currentPage--; this.updatePagination(); }
  }

  // ── Export — respects current filter ────────────────────────────────────────
  exportExcel(): void {
    // Map to clean readable column names
    const exportData = this.filteredScores.map(s => ({
      'Student ID'   : s.id,
      'Student Name' : s.name,
      'Exam Type'    : s.exam,
      'Mock Test'    : s.mock,
      'Physics'      : s.phy,
      'Chemistry'    : s.chm,
      'Mathematics'  : s.math,
      'Total Score'  : s.total,
      'Max Marks'    : s.maxMarks,
      'Correct'      : s.correct,
      'Wrong'        : s.wrong,
      'Unattempted'  : s.unattempted,
      'Submitted At' : s.submittedAt,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook  = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Scores');

    // File name reflects the active filter
    const examPart = this.selectedExam !== 'All' ? `_${this.selectedExam.replace(/\s+/g, '-')}` : '';
    const mockPart = this.selectedMock !== 'All' ? `_${this.selectedMock.replace(/\s+/g, '-')}` : '';
    XLSX.writeFile(workbook, `scores${examPart}${mockPart}.xlsx`);
  }

  goBackToDashboard(): void {
    this.router.navigate(['/admin-manageboard']);
  }
}