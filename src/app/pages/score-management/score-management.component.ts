import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-score-management',
  standalone:false,
  templateUrl: './score-management.component.html',
  styleUrls: ['./score-management.component.css']
})
export class ScoreManagementComponent implements OnInit {

  searchText = '';

  selectedBatch = 'All';

  selectedExam = 'All';

  selectedMock = 'All';

  currentPage = 1;

  itemsPerPage = 5;

  scores: any[] = [];

  filteredScores: any[] = [];

  paginatedScores: any[] = [];
  constructor(private router: Router) {}
  ngOnInit(): void {

  this.scores = [

    {
      id: 'JEE20260041',
      name: 'Ananya Iyer',
      batch: 'Dropper Batch',
      exam: 'JEE Mains',
      mock: 'Mock Test 1',
      phy: 88,
      chm: 92,
      math: 96,
      aggregate: '276/300',
      percentile: 99.84
    },

    {
      id: 'JEE20260042',
      name: 'Rahul Sharma',
      batch: 'Foundation',
      exam: 'JEE Advanced',
      mock: 'Mock Test 2',
      phy: 71,
      chm: 78,
      math: 82,
      aggregate: '231/300',
      percentile: 97.12
    },

    {
      id: 'JEE20260043',
      name: 'Sneha Reddy',
      batch: 'Dropper Batch',
      exam: 'JEE Mains',
      mock: 'Mock Test 1',
      phy: 95,
      chm: 90,
      math: 94,
      aggregate: '279/300',
      percentile: 99.91
    },

    {
      id: 'JEE20260044',
      name: 'Vikram Malhotra',
      batch: 'Foundation',
      exam: 'JEE Advanced',
      mock: 'Mock Test 2',
      phy: 60,
      chm: 54,
      math: 48,
      aggregate: '162/300',
      percentile: 94.12
    },

    {
      id: 'JEE20260045',
      name: 'Priya Patel',
      batch: 'Dropper Batch',
      exam: 'JEE Mains',
      mock: 'Mock Test 1',
      phy: 82,
      chm: 86,
      math: 79,
      aggregate: '247/300',
      percentile: 98.04
    },

    {
      id: 'JEE20260046',
      name: 'Arjun Verma',
      batch: 'Foundation',
      exam: 'JEE Advanced',
      mock: 'Mock Test 2',
      phy: 73,
      chm: 75,
      math: 69,
      aggregate: '217/300',
      percentile: 96.22
    },

    {
      id: 'JEE20260047',
      name: 'Meera Nair',
      batch: 'Dropper Batch',
      exam: 'JEE Mains',
      mock: 'Mock Test 1',
      phy: 91,
      chm: 89,
      math: 92,
      aggregate: '272/300',
      percentile: 99.45
    },

    {
      id: 'JEE20260048',
      name: 'Karthik Rao',
      batch: 'Foundation',
      exam: 'JEE Advanced',
      mock: 'Mock Test 2',
      phy: 66,
      chm: 70,
      math: 64,
      aggregate: '200/300',
      percentile: 95.04
    },

    {
      id: 'JEE20260049',
      name: 'Divya Kapoor',
      batch: 'Dropper Batch',
      exam: 'JEE Mains',
      mock: 'Mock Test 1',
      phy: 84,
      chm: 88,
      math: 90,
      aggregate: '262/300',
      percentile: 98.88
    },

    {
      id: 'JEE20260050',
      name: 'Aditya Singh',
      batch: 'Foundation',
      exam: 'JEE Advanced',
      mock: 'Mock Test 2',
      phy: 58,
      chm: 61,
      math: 66,
      aggregate: '185/300',
      percentile: 93.76
    }

  ];

  this.filteredScores = [...this.scores];

  this.updatePagination();

}

  filterScores() {

    this.filteredScores = this.scores.filter(student => {

      const matchesSearch =
        student.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        student.id.toLowerCase().includes(this.searchText.toLowerCase()) ||
        (student.exam && student.exam.toLowerCase().includes(this.searchText.toLowerCase()));

      const matchesBatch =
        this.selectedBatch === 'All' ||
        student.batch === this.selectedBatch;

      const matchesExam =
        this.selectedExam === 'All' ||
        student.exam === this.selectedExam;

      const matchesMock =
        this.selectedMock === 'All' ||
        student.mock === this.selectedMock;

      return matchesSearch && matchesBatch && matchesExam && matchesMock;

    });

    this.currentPage = 1;

    this.updatePagination();

  }

  updatePagination() {

    const start =
      (this.currentPage - 1) * this.itemsPerPage;

    const end =
      start + this.itemsPerPage;

    this.paginatedScores =
      this.filteredScores.slice(start, end);

  }

  get totalPages(): number {

    return Math.ceil(
      this.filteredScores.length / this.itemsPerPage
    );

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

  exportExcel(): void {

    const worksheet =
      XLSX.utils.json_to_sheet(this.filteredScores);

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Scores'
    );

    XLSX.writeFile(
      workbook,
      'score-management.xlsx'
    );

  }
   goBackToDashboard(): void {
    this.router.navigate(['/admin-manageboard']);
  }

}