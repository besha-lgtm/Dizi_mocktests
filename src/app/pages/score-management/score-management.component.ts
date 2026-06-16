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

  selectedExam    = 'All';
  selectedMock    = 'All';
  selectedSection = 'All';

  currentPage  = 1;
  itemsPerPage = 10;

  scores         : any[] = [];
  filteredScores : any[] = [];
  paginatedScores: any[] = [];

  /** Dropdown options built from actual data */
  mockOptions   : string[] = [];
  sectionOptions: string[] = [];

  constructor(private router: Router, private scoreService: ScoreService) {}

  ngOnInit(): void {
    this.loadScores();
  }

  // ── Load scores from backend ──────────────────────────────────────────────
  loadScores(): void {
    this.scoreService.getScores().subscribe({
      next: (res) => {
        const stored = res.scores || [];

        this.scores = stored.map((s: any) => ({
          id          : s.studentId   || '—',
          name        : s.studentName || '—',
          section     : s.section     || '—',
          exam        : s.examType    || '—',
          mock        : s.mock        || `Mock Test ${s.mockTestId || 1}`,
          mockTestId  : s.mockTestId  || 1,
          phy         : s.phy         ?? 0,
          chm         : s.chm         ?? 0,
          math        : s.math        ?? 0,
          total       : s.total       ?? 0,
          maxMarks    : s.maxMarks    ?? 0,
          correct     : s.correct     ?? 0,
          wrong       : s.wrong       ?? 0,
          unattempted : s.unattempted ?? 0,
        }));

        // Compute percentile per student within their mock test group
        this.computePercentiles();

        // Build dynamic dropdown options from actual data
        const mocks    = new Set<string>(this.scores.map(s => s.mock));
        const sections = new Set<string>(
          this.scores.map(s => s.section).filter(s => s && s !== '—')
        );

        this.mockOptions    = Array.from(mocks).sort();
        this.sectionOptions = Array.from(sections).sort();

        this.filteredScores = [...this.scores];
        this.updatePagination();
      },
      error: (err) => {
        console.error('Failed to load scores from backend:', err);
      }
    });
  }

  // ── Percentile computation ────────────────────────────────────────────────
  private computePercentiles(): void {
    const groups: { [key: string]: number[] } = {};
    this.scores.forEach(s => {
      const key = `${s.exam}||${s.mockTestId}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(s.total);
    });

    this.scores.forEach(s => {
      const key   = `${s.exam}||${s.mockTestId}`;
      const group = groups[key];
      const below = group.filter(t => t < s.total).length;
      s.percentile = group.length <= 1
        ? 100
        : Math.round((below / (group.length - 1)) * 100);
    });
  }

  // ── Computed stats ────────────────────────────────────────────────────────
  get highestScore(): number {
    if (!this.scores.length) return 0;
    return Math.max(...this.scores.map(s => s.total));
  }

  get uniqueMockCount(): number {
    return new Set(this.scores.map(s => `${s.exam}-${s.mockTestId}`)).size;
  }

  // ── Filtering ─────────────────────────────────────────────────────────────
  filterScores(): void {
    this.filteredScores = this.scores.filter(s => {
      const matchesExam    = this.selectedExam    === 'All' || s.exam    === this.selectedExam;
      const matchesMock    = this.selectedMock    === 'All' || s.mock    === this.selectedMock;
      const matchesSection = this.selectedSection === 'All' || s.section === this.selectedSection;
      return matchesExam && matchesMock && matchesSection;
    });

    this.currentPage = 1;
    this.updatePagination();
  }

  // ── Pagination ────────────────────────────────────────────────────────────
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

  // ── Export — respects current filter ─────────────────────────────────────
  exportExcel(): void {
    const exportData = this.filteredScores.map(s => ({
      'Student ID'  : s.id,
      'Student Name': s.name,
      'Section'     : s.section,
      'Exam Type'   : s.exam,
      'Mock Test'   : s.mock,
      'Physics'     : s.phy,
      'Chemistry'   : s.chm,
      'Mathematics' : s.math,
      'Total Score' : s.total,
      'Max Marks'   : s.maxMarks,
      'Correct'     : s.correct,
      'Wrong'       : s.wrong,
      'Unattempted' : s.unattempted,
      'Percentile'  : s.percentile !== undefined ? `${s.percentile}%` : '—',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook  = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Scores');

    const examPart    = this.selectedExam    !== 'All' ? `_${this.selectedExam.replace(/\s+/g, '-')}`    : '';
    const mockPart    = this.selectedMock    !== 'All' ? `_${this.selectedMock.replace(/\s+/g, '-')}`    : '';
    const sectionPart = this.selectedSection !== 'All' ? `_${this.selectedSection.replace(/\s+/g, '-')}` : '';
    XLSX.writeFile(workbook, `scores${examPart}${mockPart}${sectionPart}.xlsx`);
  }

  goBackToDashboard(): void {
    this.router.navigate(['/admin-manageboard']);
  }
}