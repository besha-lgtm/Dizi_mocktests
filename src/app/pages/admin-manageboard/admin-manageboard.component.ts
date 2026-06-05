import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-admin-manageboard',
  standalone: false,
  templateUrl: './admin-manageboard.component.html',
  styleUrls: ['./admin-manageboard.component.css']
})
export class AdminManageboardComponent implements OnInit {

  recentMocks: any[] = [];
  topStudents: any[] = [];

  // Line chart properties
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  mainsEnrollments = [1500, 1900, 1850, 1750, 1950, 2458, 2200, 2300, 2100, 2250, 2550, 2750];
  advancedEnrollments = [600, 700, 750, 720, 800, 1128, 900, 800, 750, 850, 1000, 1400];

  mainsPoints: any[] = [];
  advancedPoints: any[] = [];
  mainsPath = '';
  advancedPath = '';
  mainsFillPath = '';
  advancedFillPath = '';

  selectedPeriod = 'Yearly';
  selectedExamFilter = 'All Exams';

  hoveredIndex: number | null = null;
  hoveredStudentSegment: string | null = null;
  hoveredScoreSegment: string | null = null;

  showDatePicker = false;
  selectedDateRange = 'May 1 - May 31, 2025';
  showReportToast = false;

  dateRanges = [
    { label: 'Today', value: 'Jun 5, 2026', statsMultiplier: 0.05 },
    { label: 'Last 7 Days', value: 'May 29 - Jun 5, 2026', statsMultiplier: 0.25 },
    { label: 'Last 30 Days', value: 'May 6 - Jun 5, 2026', statsMultiplier: 1.0 },
    { label: 'This Month', value: 'May 1 - May 31, 2025', statsMultiplier: 1.0 },
    { label: 'Last Month', value: 'Apr 1 - Apr 30, 2025', statsMultiplier: 0.95 },
    { label: 'Year to Date', value: 'Jan 1 - Jun 5, 2026', statsMultiplier: 3.5 }
  ];

  kpiStats = {
    mainsStudents: '2,458',
    mainsTrend: '+12.6%',
    advancedStudents: '1,128',
    advancedTrend: '+8.9%',
    teachers: '158',
    teachersTrend: '+6.4%',
    mockTests: '203',
    mockTestsTrend: '+15.3%',
    attempts: '6,742',
    attemptsTrend: '+18.7%',
    avgScore: '71.45%',
    avgScoreTrend: '+5.6%'
  };

  studentsDist = {
    mains: { count: 2458, percentage: 68.5, dash: '172.16', offset: '0' },
    advanced: { count: 1128, percentage: 31.5, dash: '79.16', offset: '-172.16' },
    total: 3586
  };

  scoreDistribution = {
    excellent: { count: 1024, percentage: 28.6, dash: '71.88', offset: '0' },
    good: { count: 1356, percentage: 37.8, dash: '95.00', offset: '-71.88' },
    average: { count: 842, percentage: 23.5, dash: '59.06', offset: '-166.88' },
    poor: { count: 364, percentage: 10.1, dash: '25.38', offset: '-225.94' },
    avgScoreText: '71.4%'
  };

  searchText = '';
  currentPage = 1;
  itemsPerPage = 5;
  editMode = false;
  showModal = false;

  students: any[] = [];
  teachers: any[] = [];

  filteredStudents: any[] = [];

  paginatedStudents: any[] = [];

  studentForm = {
    id: '',
    name: '',
    course: '',
    attempts: 0,
    status: 'Active'
  };

   constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.students = [
      {
        id: 'STU101',
        name: 'Rahul Kumar',
        course: 'JEE Advanced',
        attempts: 5,
        status: 'Active'
      },
      {
        id: 'STU102',
        name: 'Sneha Reddy',
        course: 'NEET',
        attempts: 3,
        status: 'Active'
      },
      {
        id: 'STU103',
        name: 'Arjun Sharma',
        course: 'Foundation',
        attempts: 1,
        status: 'Inactive'
      }
    ];

    this.teachers = [
      {
        name: 'Dr. Amit Patel',
        mail: 'amit.patel@gmail.com',
        subject: 'Physics'
      },
      {
        name: 'Prof. Rita Sen',
        mail: 'rita.sen@gmail.com',
        subject: 'Chemistry'
      },
      {
        name: 'Dr. Alok Verma',
        mail: 'alok.verma@gmail.com',
        subject: 'Mathematics'
      },
      {
        name: 'Dr. Neha Sharma',
        mail: 'neha.sharma@gmail.com',
        subject: 'Physics'
      },
      {
        name: 'Prof. Sanjay Dutt',
        mail: 'sanjay.dutt@gmail.com',
        subject: 'Chemistry'
      }
    ];

    this.filteredStudents = [...this.students];
    this.updatePagination();

    // Load dashboard datasets matching mockup
    this.recentMocks = [
      { name: 'JEE Main Mock Test 15', category: 'Mains', studentsCount: 1245, avgScore: '72.45%', status: 'Completed' },
      { name: 'NEET Advanced Mock 08', category: 'Advanced', studentsCount: 842, avgScore: '68.30%', status: 'Completed' },
      { name: 'JEE Main Mock Test 14', category: 'Mains', studentsCount: 1134, avgScore: '74.12%', status: 'Completed' },
      { name: 'NEET Advanced Mock 07', category: 'Advanced', studentsCount: 765, avgScore: '65.91%', status: 'Completed' },
      { name: 'JEE Main Mock Test 13', category: 'Mains', studentsCount: 1096, avgScore: '70.65%', status: 'Completed' }
    ];

    this.topStudents = [
      { rank: 1, name: 'Rohan Sharma', exam: 'JEE Main Mock 15', score: '98.76%' },
      { rank: 2, name: 'Aarav Patel', exam: 'JEE Main Mock 15', score: '97.45%' },
      { rank: 3, name: 'Ishita Verma', exam: 'NEET Adv Mock 08', score: '96.32%' },
      { rank: 4, name: 'Kartik Gupta', exam: 'JEE Main Mock 15', score: '95.81%' },
      { rank: 5, name: 'Ananya Singh', exam: 'NEET Adv Mock 08', score: '95.26%' }
    ];

    this.calculateChartPoints();
  }

  calculateChartPoints() {
    const width = 500;
    const height = 200;
    const paddingX = 30;
    const paddingY = 20;

    const mainsData = this.mainsEnrollments;
    const advData = this.advancedEnrollments;

    const maxVal = Math.max(...mainsData, ...advData) * 1.1; // Add 10% safety ceiling
    const minVal = 0;

    this.mainsPoints = mainsData.map((val, i) => {
      const x = paddingX + (i / (mainsData.length - 1)) * (width - 2 * paddingX);
      const y = height - paddingY - ((val - minVal) / (maxVal - minVal)) * (height - 2 * paddingY);
      return { x, y, month: this.months[i], val };
    });

    this.advancedPoints = advData.map((val, i) => {
      const x = paddingX + (i / (advData.length - 1)) * (width - 2 * paddingX);
      const y = height - paddingY - ((val - minVal) / (maxVal - minVal)) * (height - 2 * paddingY);
      return { x, y, month: this.months[i], val };
    });

    this.mainsPath = this.mainsPoints.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ');
    this.advancedPath = this.advancedPoints.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ');

    this.mainsFillPath = `${this.mainsPath} L ${this.mainsPoints[this.mainsPoints.length - 1].x} ${height - paddingY} L ${this.mainsPoints[0].x} ${height - paddingY} Z`;
    this.advancedFillPath = `${this.advancedPath} L ${this.advancedPoints[this.advancedPoints.length - 1].x} ${height - paddingY} L ${this.advancedPoints[0].x} ${height - paddingY} Z`;
  }

  onPeriodChange() {
    if (this.selectedPeriod === 'Monthly') {
      this.months = ['W1', 'W2', 'W3', 'W4'];
      this.mainsEnrollments = [520, 680, 590, 668];
      this.advancedEnrollments = [210, 280, 230, 408];
      this.kpiStats = {
        mainsStudents: '548',
        mainsTrend: '+14.2%',
        advancedStudents: '286',
        advancedTrend: '+9.1%',
        teachers: '12',
        teachersTrend: '+4.5%',
        mockTests: '48',
        mockTestsTrend: '+18.2%',
        attempts: '1,245',
        attemptsTrend: '+16.5%',
        avgScore: '72.80%',
        avgScoreTrend: '+6.2%'
      };
    } else {
      this.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      this.mainsEnrollments = [1500, 1900, 1850, 1750, 1950, 2458, 2200, 2300, 2100, 2250, 2550, 2750];
      this.advancedEnrollments = [600, 700, 750, 720, 800, 1128, 900, 800, 750, 850, 1000, 1400];
      this.kpiStats = {
        mainsStudents: '2,458',
        mainsTrend: '+12.6%',
        advancedStudents: '1,128',
        advancedTrend: '+8.9%',
        teachers: '158',
        teachersTrend: '+6.4%',
        mockTests: '203',
        mockTestsTrend: '+15.3%',
        attempts: '6,742',
        attemptsTrend: '+18.7%',
        avgScore: '71.45%',
        avgScoreTrend: '+5.6%'
      };
    }
    this.selectedDateRange = this.selectedPeriod === 'Monthly' ? 'May 1 - May 31, 2025' : 'Jan 1 - Jun 5, 2026';
    this.calculateChartPoints();
    this.updateStudentDistributionDonut();
  }

  toggleDatePicker() {
    this.showDatePicker = !this.showDatePicker;
  }

  selectDateRange(range: any) {
    this.selectedDateRange = range.value;
    this.showDatePicker = false;

    // Simulate dataset adjustments based on multiplier
    const m = range.statsMultiplier;
    this.kpiStats = {
      mainsStudents: Math.round(2458 * m).toLocaleString(),
      mainsTrend: m > 1 ? '+15.2%' : '+11.4%',
      advancedStudents: Math.round(1128 * m).toLocaleString(),
      advancedTrend: m > 1 ? '+10.8%' : '+8.2%',
      teachers: Math.max(5, Math.round(158 * (m < 1 ? Math.max(0.6, m) : m))).toLocaleString(),
      teachersTrend: m > 1 ? '+8.5%' : '+5.9%',
      mockTests: Math.max(3, Math.round(203 * m)).toLocaleString(),
      mockTestsTrend: m > 1 ? '+17.4%' : '+12.1%',
      attempts: Math.round(6742 * m).toLocaleString(),
      attemptsTrend: m > 1 ? '+21.3%' : '+16.8%',
      avgScore: m > 1 ? '73.12%' : '70.85%',
      avgScoreTrend: m > 1 ? '+6.8%' : '+4.9%'
    };

    // Also adjust the line chart datasets proportionally
    if (this.selectedPeriod === 'Monthly') {
      this.mainsEnrollments = [Math.round(520 * m), Math.round(680 * m), Math.round(590 * m), Math.round(668 * m)];
      this.advancedEnrollments = [Math.round(210 * m), Math.round(280 * m), Math.round(230 * m), Math.round(408 * m)];
    } else {
      const baseMains = [1500, 1900, 1850, 1750, 1950, 2458, 2200, 2300, 2100, 2250, 2550, 2750];
      const baseAdv = [600, 700, 750, 720, 800, 1128, 900, 800, 750, 850, 1000, 1400];
      this.mainsEnrollments = baseMains.map(v => Math.round(v * m));
      this.advancedEnrollments = baseAdv.map(v => Math.round(v * m));
    }
    this.calculateChartPoints();
    this.updateStudentDistributionDonut();
  }

  updateStudentDistributionDonut() {
    const mainsCount = parseInt(this.kpiStats.mainsStudents.replace(/,/g, ''), 10) || 0;
    const advCount = parseInt(this.kpiStats.advancedStudents.replace(/,/g, ''), 10) || 0;
    const totalCount = mainsCount + advCount;

    if (totalCount === 0) return;

    const mainsPct = (mainsCount / totalCount) * 100;
    const advPct = (advCount / totalCount) * 100;

    const mainsDash = ((mainsCount / totalCount) * 251.32).toFixed(2);
    const advDash = ((advCount / totalCount) * 251.32).toFixed(2);

    this.studentsDist = {
      mains: { count: mainsCount, percentage: parseFloat(mainsPct.toFixed(1)), dash: mainsDash, offset: '0' },
      advanced: { count: advCount, percentage: parseFloat(advPct.toFixed(1)), dash: advDash, offset: '-' + mainsDash },
      total: totalCount
    };
  }

  onExamFilterChange() {
    if (this.selectedExamFilter === 'Mains') {
      this.scoreDistribution = {
        excellent: { count: 750, percentage: 30.0, dash: '75.4', offset: '0' },
        good: { count: 950, percentage: 38.0, dash: '95.5', offset: '-75.4' },
        average: { count: 550, percentage: 22.0, dash: '55.3', offset: '-170.9' },
        poor: { count: 250, percentage: 10.0, dash: '25.1', offset: '-226.2' },
        avgScoreText: '73.2%'
      };
    } else if (this.selectedExamFilter === 'Advanced') {
      this.scoreDistribution = {
        excellent: { count: 274, percentage: 25.2, dash: '63.3', offset: '0' },
        good: { count: 406, percentage: 37.4, dash: '94.0', offset: '-63.3' },
        average: { count: 292, percentage: 26.9, dash: '67.6', offset: '-157.3' },
        poor: { count: 114, percentage: 10.5, dash: '26.4', offset: '-224.9' },
        avgScoreText: '67.8%'
      };
    } else {
      // All Exams
      this.scoreDistribution = {
        excellent: { count: 1024, percentage: 28.6, dash: '71.88', offset: '0' },
        good: { count: 1356, percentage: 37.8, dash: '95.00', offset: '-71.88' },
        average: { count: 842, percentage: 23.5, dash: '59.06', offset: '-166.88' },
        poor: { count: 364, percentage: 10.1, dash: '25.38', offset: '-225.94' },
        avgScoreText: '71.4%'
      };
    }
  }

  navigateToAddStudent() {
    this.router.navigate(['/student-registration']);
  }

  navigateToAddTeacher() {
    this.router.navigate(['/teacher-registration']);
  }

  navigateToScoreManagement() {
    this.router.navigate(['/score-management']);
  }

  generateReport() {
    this.showReportToast = true;
    setTimeout(() => {
      this.showReportToast = false;
    }, 3500);
  }

  openDatePicker() {
    this.toggleDatePicker();
  }

  filterStudents() {

    this.filteredStudents = this.students.filter(student =>
      student.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      student.course.toLowerCase().includes(this.searchText.toLowerCase()) ||
      student.id.toLowerCase().includes(this.searchText.toLowerCase())
    );

    this.currentPage = 1;

    this.updatePagination();

  }

  updatePagination() {

    const start =
      (this.currentPage - 1) * this.itemsPerPage;

    const end =
      start + this.itemsPerPage;

    this.paginatedStudents =
      this.filteredStudents.slice(start, end);

  }

  get totalPages(): number {

    return Math.ceil(
      this.filteredStudents.length / this.itemsPerPage
    );

  }

  get totalPagesArray(): number[] {

    return Array(this.totalPages)
      .fill(0)
      .map((x, i) => i + 1);

  }

  goToPage(page: number) {

    this.currentPage = page;

    this.updatePagination();

  }

  nextPage() {

    if (this.currentPage < this.totalPages) {

      this.currentPage++;

      this.updatePagination();

    }

  }

  prevPage() {

    if (this.currentPage > 1) {

      this.currentPage--;

      this.updatePagination();

    }

  }

  openAddModal() {

    this.editMode = false;

    this.studentForm = {
      id: '',
      name: '',
      course: '',
      attempts: 0,
      status: 'Active'
    };

    this.showModal = true;

  }

  editStudent(student: any) {

    this.editMode = true;

    this.studentForm = { ...student };

    this.showModal = true;

  }

  saveStudent() {

    if (this.editMode) {

      const index = this.students.findIndex(
        x => x.id === this.studentForm.id
      );

      this.students[index] = { ...this.studentForm };

    } else {

      this.students.unshift({
        ...this.studentForm
      });

    }

    this.closeModal();

    this.filterStudents();

  }

  deleteStudent(id: string) {

    this.students =
      this.students.filter(x => x.id !== id);

    this.filterStudents();

  }

  closeModal() {

    this.showModal = false;

  }
   goBackToSubjects(): void {
    this.router.navigate(['/admin-dashboard']);
  }

}