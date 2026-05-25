import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-sidebar',
  standalone: false,
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css']
})
export class AdminSidebarComponent {

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