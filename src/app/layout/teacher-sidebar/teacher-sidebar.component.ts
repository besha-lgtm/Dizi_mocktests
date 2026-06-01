import { Component } from '@angular/core';

@Component({
  selector: 'app-teacher-sidebar',
  standalone: false,
  templateUrl: './teacher-sidebar.component.html',
  styleUrls: ['./teacher-sidebar.component.css']
})
export class TeacherSidebarComponent  {

  isCollapsed = false;

  toggleSidebar() {

    this.isCollapsed = !this.isCollapsed;

    if (this.isCollapsed) {

      document.body.classList.add('sidebar-collapsed');

    } else {

      document.body.classList.remove('sidebar-collapsed');

    }

  }

}