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

  searchText = '';

  showModal = false;

  editMode = false;

  currentPage = 1;

  itemsPerPage = 5;

  mock1Attempts = 98;
  mock2Attempts = 85;
  totalCourses = 12;

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