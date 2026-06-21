import { Component, OnInit, HostBinding } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-teacher-sidebar',
  standalone: false,
  templateUrl: './teacher-sidebar.component.html',
  styleUrls: ['./teacher-sidebar.component.css']
})
export class TeacherSidebarComponent implements OnInit {

  isCollapsed = localStorage.getItem('teacher-sidebar-collapsed') === 'true';
  teacherSubject: string = 'All';

  @HostBinding('class.collapsed')
  get collapsedClass() {
    return this.isCollapsed;
  }

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.updateBodyClass();
    this.teacherSubject = this.authService.getSubject() || 'All';
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    localStorage.setItem('teacher-sidebar-collapsed', String(this.isCollapsed));
    this.updateBodyClass();
  }

  private updateBodyClass() {
    if (this.isCollapsed) {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }
  }

}