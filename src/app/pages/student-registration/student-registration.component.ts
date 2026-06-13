import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { StudentService } from '../../services/student.service';

interface Student {
  uniqueId: string;
  name:     string;
  mail:     string;
  password?: string;
  section:  string;
  role?:    string;
}

interface Toast {
  id:      number;
  message: string;
  type:   'success' | 'info' | 'danger';
}

@Component({
  selector:    'app-student-registration',
  standalone:  false,
  templateUrl: './student-registration.component.html',
  styleUrls:   ['./student-registration.component.css']
})
export class StudentRegistrationComponent implements OnInit {

  students:          Student[] = [];
  filteredStudents:  Student[] = [];
  paginatedStudents: Student[] = [];
  isPageLoading = false;

  // ── Form State ──────────────────────────────────────────────
  showModal              = false;
  editMode               = false;
  showPassword           = false;
  isSaving               = false;
  selectedStudentIndex: number | null = null;

  // ── Bulk Upload State ────────────────────────────────────────
  bulkUploadMode       = false;
  isFileUploaded       = false;
  fileName             = '';
  bulkUploadedStudents: Student[] = [];
  isDragOver           = false;
  isUploading          = false;

  // ── Form Fields ──────────────────────────────────────────────
  studentForm: Student = {
    uniqueId: '',
    name:     '',
    mail:     '',
    password: '',
    section:  '',
    role:     'student'
  };

  // ── Delete Confirmation Modal ────────────────────────────────
  showDeleteModal      = false;
  studentToDeleteId    = '';
  studentToDeleteName  = '';

  // ── Update Success Modal ─────────────────────────────────────
  showUpdateSuccessModal = false;
  updateSuccessMessage   = '';

  // ── Search & Filter ──────────────────────────────────────────
  searchText            = '';
  selectedSectionFilter = 'All';

  // Deterministic color palette for dynamic section tagging
  private sectionColorsMap: { [key: string]: { [key: string]: string } } = {};
  private colorPalette = [
    { background: '#eff6ff', color: '#2563eb' }, // Blue
    { background: '#ecfdf5', color: '#059669' }, // Green
    { background: '#fffbeb', color: '#d97706' }, // Amber
    { background: '#fff1f2', color: '#e11d48' }, // Rose
    { background: '#f5f3ff', color: '#7c3aed' }, // Purple
    { background: '#ecfeff', color: '#0891b2' }, // Cyan
    { background: '#fdf2f8', color: '#db2777' }, // Pink
    { background: '#f0fdf4', color: '#16a34a' }  // Emerald
  ];

  // ── Pagination ───────────────────────────────────────────────
  currentPage              = 1;
  itemsPerPage             = 5;
  pageNumbers: (number | string)[] = [];

  // ── Toasts ───────────────────────────────────────────────────
  toasts: Toast[] = [];
  private toastIdCounter = 0;

  constructor(
    private router:         Router,
    private studentService: StudentService,
    private cdr:            ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  // Helper to get deterministic styles for any dynamic section
  getSectionStyle(section: string): { [key: string]: string } {
    if (!section) {
      return { 'background-color': '#f1f5f9', 'color': '#475569' };
    }
    const normalized = section.trim().toLowerCase();
    if (!this.sectionColorsMap[normalized]) {
      let hash = 0;
      for (let i = 0; i < normalized.length; i++) {
        hash = normalized.charCodeAt(i) + ((hash << 5) - hash);
      }
      const index = Math.abs(hash) % this.colorPalette.length;
      const paletteColor = this.colorPalette[index];
      this.sectionColorsMap[normalized] = {
        'background-color': paletteColor.background,
        'color': paletteColor.color
      };
    }
    return this.sectionColorsMap[normalized];
  }

  get uniqueSectionsCount(): number {
    const secSet = new Set(this.students.map(s => s.section.trim()).filter(s => !!s));
    return secSet.size;
  }

  // ─────────────────────────────────────────────────────────────
  // API: Load all students from DB
  // ─────────────────────────────────────────────────────────────
  loadStudents(): void {
    this.isPageLoading = true;
    this.studentService.getStudents().subscribe({
      next: (res) => {
        this.isPageLoading = false;
        if (res.success) {
          // Map DB column names (unique_id, email) → component field names (uniqueId, mail)
          this.students = (res.students as any[]).map(s => ({
            uniqueId: s.unique_id   || '',
            name:     s.name        || '',
            mail:     s.email       || '',
            section:  s.section     || '',
            role:     s.role        || 'student'
          }));
          this.applyFilters();
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.isPageLoading = false;
        this.showToast('Failed to load students. Is the backend running?', 'danger');
        this.cdr.detectChanges();
      }
    });
  }

  // ─────────────────────────────────────────────────────────────
  // Filter & Pagination
  // ─────────────────────────────────────────────────────────────
  applyFilters(): void {
    const query = this.searchText.toLowerCase();
    this.filteredStudents = this.students.filter(s =>
      s.name.toLowerCase().includes(query)    ||
      s.mail.toLowerCase().includes(query)    ||
      s.uniqueId.toLowerCase().includes(query) ||
      s.section.toLowerCase().includes(query)
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedStudents = this.filteredStudents.slice(start, start + this.itemsPerPage);

    const totalPages = this.totalPages;
    this.pageNumbers  = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) this.pageNumbers.push(i);
    } else if (this.currentPage <= 3) {
      this.pageNumbers = [1, 2, 3, '...', totalPages];
    } else if (this.currentPage >= totalPages - 2) {
      this.pageNumbers = [1, '...', totalPages - 2, totalPages - 1, totalPages];
    } else {
      this.pageNumbers = [1, '...', this.currentPage, '...', totalPages];
    }
  }

  get totalPages(): number {
    return Math.ceil(this.filteredStudents.length / this.itemsPerPage);
  }

  goToPage(page: number | string): void {
    if (typeof page === 'number') { this.currentPage = page; this.updatePagination(); }
  }

  prevPage(): void {
    if (this.currentPage > 1) { this.currentPage--; this.updatePagination(); }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) { this.currentPage++; this.updatePagination(); }
  }

  getShowingText(): string {
    if (this.filteredStudents.length === 0) return 'Showing 0 of 0 candidates';
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end   = Math.min(start + this.itemsPerPage - 1, this.filteredStudents.length);
    return `Showing ${start} to ${end} of ${this.filteredStudents.length} candidates`;
  }

  // ─────────────────────────────────────────────────────────────
  // Modal Controls
  // ─────────────────────────────────────────────────────────────
  openAddModal(): void {
    this.editMode          = false;
    this.showPassword      = false;
    this.bulkUploadMode    = false;
    this.isFileUploaded    = false;
    this.isUploading       = false;
    this.isSaving          = false;
    this.fileName          = '';
    this.bulkUploadedStudents = [];
    this.studentForm = {
      uniqueId: 'Auto-generated',
      name:     '',
      mail:     '',
      password: '',
      section:  '',
      role:     'student'
    };
    this.showModal = true;
  }

  openEditModal(student: Student): void {
    this.editMode          = true;
    this.showPassword      = false;
    this.bulkUploadMode    = false;
    this.isFileUploaded    = false;
    this.isUploading       = false;
    this.isSaving          = false;
    this.fileName          = '';
    this.bulkUploadedStudents = [];
    this.studentForm = { ...student };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal  = false;
    this.isSaving   = false;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  enableBulkUpload(): void {
    this.bulkUploadMode  = true;
    this.isFileUploaded  = false;
    this.isUploading     = false;
    this.fileName        = '';
    this.bulkUploadedStudents = [];
  }

  disableBulkUpload(): void {
    this.bulkUploadMode  = false;
    this.isFileUploaded  = false;
    this.isUploading     = false;
    this.fileName        = '';
    this.bulkUploadedStudents = [];
  }

  // ─────────────────────────────────────────────────────────────
  // Drag & Drop / File Selection
  // ─────────────────────────────────────────────────────────────
  onDragOver(event: DragEvent): void  { event.preventDefault(); event.stopPropagation(); this.isDragOver = true;  }
  onDragLeave(event: DragEvent): void { event.preventDefault(); event.stopPropagation(); this.isDragOver = false; }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) this.handleExcelFile(files[0]);
  }

  onFileSelected(event: any): void {
    const file = event.target.files?.[0];
    if (file) this.handleExcelFile(file);
  }

  private handleExcelFile(file: File): void {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'xlsx' && ext !== 'xls') {
      this.showToast('Please upload a valid Excel file (.xlsx or .xls)!', 'danger');
      return;
    }

    this.isUploading          = true;
    this.isFileUploaded       = false;
    this.bulkUploadedStudents = [];

    const reader = new FileReader();
    reader.onload = (e: any) => {
      // Simulate brief processing delay for UX
      setTimeout(() => {
        try {
          const data     = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheet    = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(sheet) as any[];

          if (jsonData.length === 0) {
            this.showToast('The uploaded Excel file is empty!', 'danger');
            this.isUploading = false;
            this.cdr.detectChanges();
            return;
          }

          const parsed: Student[] = [];
          for (const row of jsonData) {
            const nameKey     = Object.keys(row).find(k => ['name', 'full name'].includes(k.toLowerCase()));
            const mailKey     = Object.keys(row).find(k => ['email', 'mail', 'email address'].includes(k.toLowerCase()));
            const sectionKey  = Object.keys(row).find(k => k.toLowerCase() === 'section');
            const passwordKey = Object.keys(row).find(k => k.toLowerCase() === 'password');

            const name = nameKey ? String(row[nameKey]).trim() : '';
            const mail = mailKey ? String(row[mailKey]).trim() : '';

            if (!name || !mail) continue;

            parsed.push({
              uniqueId: 'Auto-generated',
              name,
              mail,
              password: passwordKey ? String(row[passwordKey]).trim() : 'Password123',
              section:  sectionKey  ? String(row[sectionKey]).trim()  : 'Section A',
              role:     'student'
            });
          }

          if (parsed.length === 0) {
            this.showToast('No valid entries found. Ensure Name and Email columns exist.', 'danger');
            this.isUploading = false;
            this.cdr.detectChanges();
            return;
          }

          this.bulkUploadedStudents = parsed;
          this.fileName             = file.name;
          this.isFileUploaded       = true;
          this.isUploading          = false;
          this.showToast(`${parsed.length} candidate(s) ready to import.`, 'success');
          this.cdr.detectChanges();

        } catch (err) {
          console.error(err);
          this.showToast('Failed to parse the Excel file.', 'danger');
          this.isUploading = false;
          this.cdr.detectChanges();
        }
      }, 1200);
    };
    reader.readAsArrayBuffer(file);
  }

  // ─────────────────────────────────────────────────────────────
  // API: Bulk Import
  // ─────────────────────────────────────────────────────────────
  importBulkStudents(): void {
    if (!this.isFileUploaded || this.bulkUploadedStudents.length === 0) {
      this.showToast('Please upload a valid Excel file first!', 'danger');
      return;
    }

    this.isSaving = true;

    const payload = this.bulkUploadedStudents.map(s => ({
      name:     s.name,
      email:    s.mail,
      password: s.password || 'Password123',
      section:  s.section  || 'Section A'
    }));

    this.studentService.bulkAddStudents(payload).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.showToast(res.message || 'Imported students successfully!', 'success');
        if (res.errors?.length) {
          res.errors.forEach((e: string) => this.showToast(e, 'info'));
        }
        this.closeModal();
        this.loadStudents();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isSaving = false;
        this.showToast(err.error?.message || 'Bulk import failed. Please try again.', 'danger');
        this.cdr.detectChanges();
      }
    });
  }

  // ─────────────────────────────────────────────────────────────
  // Excel Template Download
  // ─────────────────────────────────────────────────────────────
  downloadTemplate(): void {
    const templateData = [{
      'Full Name':     'Rahul Sharma',
      'Email Address': 'rahul.sharma@example.com',
      'Password':      'Password123',
      'Section':       'Section A'
    }];
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook  = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
    XLSX.writeFile(workbook, 'student-registration-template.xlsx');
    this.showToast('Excel template downloaded successfully!', 'success');
  }

  // ─────────────────────────────────────────────────────────────
  // API: Save (Add or Update)
  // ─────────────────────────────────────────────────────────────
  saveStudent(): void {
    if (this.bulkUploadMode) {
      this.importBulkStudents();
      return;
    }

    if (!this.studentForm.name.trim() || !this.studentForm.mail.trim() ||
        !this.studentForm.password?.trim() || !this.studentForm.section.trim()) {
      this.showToast('Please fill all required fields correctly!', 'danger');
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(this.studentForm.mail)) {
      this.showToast('Please enter a valid email address!', 'danger');
      return;
    }

    this.isSaving = true;
    const payload = {
      name:     this.studentForm.name.trim(),
      email:    this.studentForm.mail.trim().toLowerCase(),
      password: this.studentForm.password?.trim() || '',
      section:  this.studentForm.section.trim()
    };

    if (this.editMode) {
      this.studentService.updateStudent(this.studentForm.uniqueId, payload).subscribe({
        next: (res) => {
          this.isSaving = false;
          this.showUpdateSuccessDialog(res.message || `Updated ${this.studentForm.name} successfully!`);
          this.closeModal();
          this.loadStudents();
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.isSaving = false;
          this.showToast(err.error?.message || 'Update failed. Please try again.', 'danger');
          this.cdr.detectChanges();
        }
      });
    } else {
      this.studentService.addStudent(payload).subscribe({
        next: (res) => {
          this.isSaving = false;
          this.showToast(res.message || 'Student registered successfully!', 'success');
          this.closeModal();
          this.loadStudents();
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.isSaving = false;
          this.showToast(err.error?.message || 'Registration failed. Please try again.', 'danger');
          this.cdr.detectChanges();
        }
      });
    }
  }

  // ─────────────────────────────────────────────────────────────
  // API: Delete
  // ─────────────────────────────────────────────────────────────
  deleteStudent(uniqueId: string): void {
    const student = this.students.find(s => s.uniqueId === uniqueId);
    if (student) {
      this.studentToDeleteId   = uniqueId;
      this.studentToDeleteName = student.name;
      this.showDeleteModal     = true;
    }
  }

  confirmDelete(): void {
    if (!this.studentToDeleteId) return;

    this.studentService.deleteStudent(this.studentToDeleteId).subscribe({
      next: () => {
        this.showToast(`Removed registration for ${this.studentToDeleteName}.`, 'info');
        this.cancelDelete();
        this.loadStudents();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.showToast(err.error?.message || 'Delete failed. Please try again.', 'danger');
        this.cancelDelete();
        this.cdr.detectChanges();
      }
    });
  }

  cancelDelete(): void {
    this.showDeleteModal     = false;
    this.studentToDeleteId   = '';
    this.studentToDeleteName = '';
  }

  // ─────────────────────────────────────────────────────────────
  // Modals & Toasts
  // ─────────────────────────────────────────────────────────────
  showUpdateSuccessDialog(message: string): void {
    this.updateSuccessMessage  = message;
    this.showUpdateSuccessModal = true;
  }

  closeUpdateSuccessModal(): void {
    this.showUpdateSuccessModal = false;
    this.updateSuccessMessage   = '';
  }

  showToast(message: string, type: 'success' | 'info' | 'danger'): void {
    const id = ++this.toastIdCounter;
    this.toasts.push({ id, message, type });
    setTimeout(() => {
      this.removeToast(id);
      this.cdr.detectChanges();
    }, 4000);
  }

  removeToast(id: number): void {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  goBackToDashboard(): void {
    this.router.navigate(['/admin-manageboard']);
  }
}
