import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
  selector: 'app-teacher-sidebar',
  standalone: false,
  templateUrl: './teacher-sidebar.component.html',
  styleUrls: ['./teacher-sidebar.component.css']
})
export class TeacherSidebarComponent implements OnInit {

  isCollapsed = localStorage.getItem('teacher-sidebar-collapsed') === 'true';

  @HostBinding('class.collapsed')
  get collapsedClass() {
    return this.isCollapsed;
  }

  ngOnInit() {
    this.updateBodyClass();
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