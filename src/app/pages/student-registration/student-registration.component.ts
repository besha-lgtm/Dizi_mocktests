import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';

interface Student {
  uniqueId: string;
  name: string;
  mail: string;
  password?: string;
  section: string;
  role?: string;
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

  // Bulk Upload State
  bulkUploadMode = false;
  isFileUploaded = false;
  fileName = '';
  bulkUploadedStudents: Student[] = [];
  isDragOver = false;
  isUploading = false;

  // Form Fields
  studentForm: Student = {
    uniqueId: '',
    name: '',
    mail: '',
    password: '',
    section: '',
    role: 'student'
  };

  // Delete Confirmation Modal State
  showDeleteModal = false;
  studentToDeleteId = '';
  studentToDeleteName = '';

  // Update Success Modal State
  showUpdateSuccessModal = false;
  updateSuccessMessage = '';

  // Search & Filter
  searchText = '';
  selectedSectionFilter = 'All';

  // Sections Options
  sections = ['Section A', 'Section B', 'Section C', 'Section D'];

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
        role: 'student'
      },
      {
        uniqueId: 'JEE20260089',
        name: 'Vikram Malhotra',
        mail: 'vikram.m@gmail.com',
        password: 'vikramSecure99',
        section: 'Section B',
        role: 'student'
      },
      {
        uniqueId: 'JEE20261093',
        name: 'Rahul Sharma',
        mail: 'rahul.sharma@yahoo.com',
        password: 'rahulWord999',
        section: 'Section A',
        role: 'student'
      },
      {
        uniqueId: 'JEE20261150',
        name: 'Priya Patel',
        mail: 'priya.patel@outlook.com',
        password: 'priyaSecure!',
        section: 'Section C',
        role: 'student'
      },
      {
        uniqueId: 'JEE20261201',
        name: 'Karan Johar',
        mail: 'karan.j@gmail.com',
        password: 'karanPassword',
        section: 'Section D',
        role: 'student'
      },
      {
        uniqueId: 'JEE20261305',
        name: 'Sneha Reddy',
        mail: 'sneha.reddy@gmail.com',
        password: 'snehaSecret1',
        section: 'Section B',
        role: 'student'
      }
    ];

    this.applyFilters();
  }

  // Filter & Search Logic
  applyFilters(): void {
    this.filteredStudents = this.students.filter(s => {
      return s.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        s.mail.toLowerCase().includes(this.searchText.toLowerCase()) ||
        s.uniqueId.toLowerCase().includes(this.searchText.toLowerCase());
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
    this.bulkUploadMode = false;
    this.isFileUploaded = false;
    this.isUploading = false;
    this.fileName = '';
    this.bulkUploadedStudents = [];
    this.studentForm = {
      uniqueId: this.generateUniqueId(),
      name: '',
      mail: '',
      password: '',
      section: '',
      role: 'student'
    };
    this.showModal = true;
  }

  openEditModal(student: Student): void {
    this.editMode = true;
    this.showPassword = false;
    this.bulkUploadMode = false;
    this.isFileUploaded = false;
    this.isUploading = false;
    this.fileName = '';
    this.bulkUploadedStudents = [];
    this.studentForm = { ...student };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  enableBulkUpload(): void {
    this.bulkUploadMode = true;
    this.isFileUploaded = false;
    this.isUploading = false;
    this.fileName = '';
    this.bulkUploadedStudents = [];
  }

  disableBulkUpload(): void {
    this.bulkUploadMode = false;
    this.isFileUploaded = false;
    this.isUploading = false;
    this.fileName = '';
    this.bulkUploadedStudents = [];
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleExcelFile(files[0]);
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      this.handleExcelFile(file);
    }
  }

  private handleExcelFile(file: File): void {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (fileExtension !== 'xlsx' && fileExtension !== 'xls') {
      this.showToast('Please upload a valid Excel file (.xlsx or .xls)!', 'danger');
      return;
    }

    this.isUploading = true;
    this.isFileUploaded = false;
    this.bulkUploadedStudents = [];

    const reader = new FileReader();
    reader.onload = (e: any) => {
      setTimeout(() => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

          if (jsonData.length === 0) {
            this.showToast('The uploaded Excel file is empty!', 'danger');
            this.isUploading = false;
            return;
          }

          const parsedStudents: Student[] = [];
          for (const row of jsonData) {
            const nameKey = Object.keys(row).find(k => k.toLowerCase() === 'name' || k.toLowerCase() === 'full name');
            const mailKey = Object.keys(row).find(k => k.toLowerCase() === 'email' || k.toLowerCase() === 'mail' || k.toLowerCase() === 'email address');
            const sectionKey = Object.keys(row).find(k => k.toLowerCase() === 'section');
            const passwordKey = Object.keys(row).find(k => k.toLowerCase() === 'password');
            const idKey = Object.keys(row).find(k => k.toLowerCase() === 'uniqueid' || k.toLowerCase() === 'id' || k.toLowerCase() === 'unique id');

            const name = nameKey ? String(row[nameKey]).trim() : '';
            const mail = mailKey ? String(row[mailKey]).trim() : '';

            if (!name || !mail) {
              continue;
            }

            const section = sectionKey && String(row[sectionKey]).trim() ? String(row[sectionKey]).trim() : 'Section A';

            const password = passwordKey ? String(row[passwordKey]).trim() : 'Password123';
            const uniqueId = idKey ? String(row[idKey]).trim() : this.generateUniqueId();

            parsedStudents.push({
              uniqueId,
              name,
              mail,
              password,
              section,
              role: 'student'
            });
          }

          if (parsedStudents.length === 0) {
            this.showToast('No valid student entries found! Ensure columns for Name and Email exist.', 'danger');
            this.isUploading = false;
            return;
          }

          this.bulkUploadedStudents = parsedStudents;
          this.fileName = file.name;
          this.isFileUploaded = true;
          this.isUploading = false;
          this.showToast('file upload succesfully', 'success');
        } catch (err) {
          console.error(err);
          this.showToast('Failed to parse the Excel file.', 'danger');
          this.isUploading = false;
        }
      }, 1200);
    };
    reader.readAsArrayBuffer(file);
  }

  importBulkStudents(): void {
    if (!this.isFileUploaded || this.bulkUploadedStudents.length === 0) {
      this.showToast('Please upload a valid Excel file first!', 'danger');
      return;
    }

    let addedCount = 0;
    for (const student of this.bulkUploadedStudents) {
      let uniqueId = student.uniqueId;
      const idExists = this.students.some(s => s.uniqueId.toLowerCase() === uniqueId.toLowerCase());
      if (idExists) {
        uniqueId = this.generateUniqueId();
      }

      this.students.unshift({
        ...student,
        uniqueId
      });
      addedCount++;
    }

    this.showToast(`Imported ${addedCount} candidates successfully!`, 'success');
    this.closeModal();
    this.applyFilters();
  }

  downloadTemplate(): void {
    const templateData = [
      {
        'Full Name': 'Rahul Sharma',
        'Email Address': 'rahul.sharma@example.com',
        'Password': 'Password123',
        'Section': 'Section A'
      }
    ];
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
    XLSX.writeFile(workbook, 'student-registration-template.xlsx');
    this.showToast('Student Excel template downloaded successfully!', 'success');
  }

  saveStudent(): void {
    if (this.bulkUploadMode) {
      this.importBulkStudents();
      return;
    }

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
        this.showUpdateSuccessDialog(`Updated student registration for ${this.studentForm.name} successfully!`);
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
    if (student) {
      this.studentToDeleteId = uniqueId;
      this.studentToDeleteName = student.name;
      this.showDeleteModal = true;
    }
  }

  confirmDelete(): void {
    if (this.studentToDeleteId) {
      this.students = this.students.filter(s => s.uniqueId !== this.studentToDeleteId);
      this.showToast(`Removed student registration for ${this.studentToDeleteName}.`, 'info');
      this.applyFilters();
      this.cancelDelete();
    }
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.studentToDeleteId = '';
    this.studentToDeleteName = '';
  }

  showUpdateSuccessDialog(message: string): void {
    this.updateSuccessMessage = message;
    this.showUpdateSuccessModal = true;
  }

  closeUpdateSuccessModal(): void {
    this.showUpdateSuccessModal = false;
    this.updateSuccessMessage = '';
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
    this.router.navigate(['/admin-manageboard']);
  }
}
