import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
  selector: 'app-admin-sidebar',
  standalone: false,
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css']
})
export class AdminSidebarComponent implements OnInit {

  isCollapsed = localStorage.getItem('admin-sidebar-collapsed') === 'true';

  @HostBinding('class.collapsed')
  get collapsedClass() {
    return this.isCollapsed;
  }

  ngOnInit() {
    this.updateBodyClass();
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    localStorage.setItem('admin-sidebar-collapsed', String(this.isCollapsed));
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