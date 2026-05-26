import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Student {
  uniqueId: string;
  name: string;
  mail: string;
  password?: string;
  section: string;
  batch: string;
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'info' | 'danger';
}

@Component({
  selector: 'app-student-registration',
  standalone: false,
  templateUrl: './student-registration.component.html',
  styleUrls: ['./student-registration.component.css']
})
export class StudentRegistrationComponent implements OnInit {
  students: Student[] = [];
  filteredStudents: Student[] = [];
  paginatedStudents: Student[] = [];

  // Form State
  showModal = false;
  editMode = false;
  showPassword = false;
  selectedStudentIndex: number | null = null;

  // Form Fields
  studentForm: Student = {
    uniqueId: '',
    name: '',
    mail: '',
    password: '',
    section: '',
    batch: ''
  };

  // Search & Filter
  searchText = '';
  selectedSectionFilter = 'All';
  selectedBatchFilter = 'All';

  // Sections & Batches Options
  sections = ['Section A', 'Section B', 'Section C', 'Section D'];
  batches = ['Dropper Batch A', 'Regular Batch B', 'Foundation Batch A', 'Achiever Batch B'];

  // Pagination
  currentPage = 1;
  itemsPerPage = 5;
  pageNumbers: (number | string)[] = [];

  // Toasts
  toasts: Toast[] = [];
  private toastIdCounter = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Initial dummy data matching requirements and visual guidelines
    this.students = [
      {
        uniqueId: 'JEE20260041',
        name: 'Ananya Iyer',
        mail: 'ananya.iyer@gmail.com',
        password: 'ananyaPass123',
        section: 'Section A',
        batch: 'Dropper Batch A'
      },
      {
        uniqueId: 'JEE20260089',
        name: 'Vikram Malhotra',
        mail: 'vikram.m@gmail.com',
        password: 'vikramSecure99',
        section: 'Section B',
        batch: 'Regular Batch B'
      },
      {
        uniqueId: 'JEE20261093',
        name: 'Rahul Sharma',
        mail: 'rahul.sharma@yahoo.com',
        password: 'rahulWord999',
        section: 'Section A',
        batch: 'Dropper Batch A'
      },
      {
        uniqueId: 'JEE20261150',
        name: 'Priya Patel',
        mail: 'priya.patel@outlook.com',
        password: 'priyaSecure!',
        section: 'Section C',
        batch: 'Foundation Batch A'
      },
      {
        uniqueId: 'JEE20261201',
        name: 'Karan Johar',
        mail: 'karan.j@gmail.com',
        password: 'karanPassword',
        section: 'Section D',
        batch: 'Achiever Batch B'
      },
      {
        uniqueId: 'JEE20261305',
        name: 'Sneha Reddy',
        mail: 'sneha.reddy@gmail.com',
        password: 'snehaSecret1',
        section: 'Section B',
        batch: 'Regular Batch B'
      }
    ];

    this.applyFilters();
  }

  // Filter & Search Logic
  applyFilters(): void {
    this.filteredStudents = this.students.filter(s => {
      const matchSearch =
        s.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        s.mail.toLowerCase().includes(this.searchText.toLowerCase()) ||
        s.uniqueId.toLowerCase().includes(this.searchText.toLowerCase());

      const matchSection =
        this.selectedSectionFilter === 'All' || s.section === this.selectedSectionFilter;

      const matchBatch =
        this.selectedBatchFilter === 'All' || s.batch === this.selectedBatchFilter;

      return matchSearch && matchSection && matchBatch;
    });

    this.currentPage = 1;
    this.updatePagination();
  }

  // Pagination Logic
  updatePagination(): void {
    const totalItems = this.filteredStudents.length;
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedStudents = this.filteredStudents.slice(start, end);

    const totalPages = this.totalPages;
    this.pageNumbers = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        this.pageNumbers.push(i);
      }
    } else {
      if (this.currentPage <= 3) {
        this.pageNumbers = [1, 2, 3, '...', totalPages];
      } else if (this.currentPage >= totalPages - 2) {
        this.pageNumbers = [1, '...', totalPages - 2, totalPages - 1, totalPages];
      } else {
        this.pageNumbers = [1, '...', this.currentPage, '...', totalPages];
      }
    }
  }

  get totalPages(): number {
    return Math.ceil(this.filteredStudents.length / this.itemsPerPage);
  }

  goToPage(page: number | string): void {
    if (typeof page === 'number') {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  getShowingText(): string {
    if (this.filteredStudents.length === 0) return 'Showing 0 of 0 candidates';
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(start + this.itemsPerPage - 1, this.filteredStudents.length);
    return `Showing ${start} to ${end} of ${this.filteredStudents.length} candidates`;
  }

  // CRUD Operations
  openAddModal(): void {
    this.editMode = false;
    this.showPassword = false;
    this.studentForm = {
      uniqueId: this.generateUniqueId(),
      name: '',
      mail: '',
      password: '',
      section: this.sections[0],
      batch: this.batches[0]
    };
    this.showModal = true;
  }

  openEditModal(student: Student): void {
    this.editMode = true;
    this.showPassword = false;
    this.studentForm = { ...student };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  saveStudent(): void {
    // Simple Validation
    if (!this.studentForm.name.trim() || !this.studentForm.mail.trim() || !this.studentForm.uniqueId.trim() || !this.studentForm.password?.trim()) {
      this.showToast('Please fill all required fields correctly!', 'danger');
      return;
    }

    // Email format validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(this.studentForm.mail)) {
      this.showToast('Please enter a valid email address!', 'danger');
      return;
    }

    if (this.editMode) {
      const index = this.students.findIndex(s => s.uniqueId === this.studentForm.uniqueId);
      if (index !== -1) {
        this.students[index] = { ...this.studentForm };
        this.showToast(`Updated student registration for ${this.studentForm.name} successfully!`, 'success');
      }
    } else {
      // Check if unique ID already exists
      const exists = this.students.some(s => s.uniqueId.toLowerCase() === this.studentForm.uniqueId.toLowerCase());
      if (exists) {
        this.showToast('A student with this Unique ID already exists!', 'danger');
        return;
      }

      this.students.unshift({ ...this.studentForm });
      this.showToast(`Registered new student ${this.studentForm.name} successfully!`, 'success');
    }

    this.closeModal();
    this.applyFilters();
  }

  deleteStudent(uniqueId: string): void {
    const student = this.students.find(s => s.uniqueId === uniqueId);
    const name = student ? student.name : 'student';
    
    if (confirm(`Are you sure you want to delete the registration for ${name}?`)) {
      this.students = this.students.filter(s => s.uniqueId !== uniqueId);
      this.showToast(`Removed student registration for ${name}.`, 'info');
      this.applyFilters();
    }
  }

  // Utilities
  generateUniqueId(): string {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000); // 4 digit random
    return `JEE${year}${random}`;
  }

  showToast(message: string, type: 'success' | 'info' | 'danger'): void {
    const id = ++this.toastIdCounter;
    this.toasts.push({ id, message, type });
    setTimeout(() => {
      this.removeToast(id);
    }, 4000);
  }

  removeToast(id: number): void {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  goBackToDashboard(): void {
    this.router.navigate(['/admin-dashboard']);
  }
}
