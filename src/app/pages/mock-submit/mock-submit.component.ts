import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mock-submit',
  standalone: false,
  templateUrl: './mock-submit.component.html',
  styleUrl: './mock-submit.component.css',
})
export class MockSubmit implements OnInit, OnDestroy {

  // Prevent back navigation
  private handlePopState = (): void => { history.pushState(null, '', location.href); };

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Prevent back button
    history.pushState(null, '', location.href);
    window.addEventListener('popstate', this.handlePopState);
  }

  ngOnDestroy(): void {
    window.removeEventListener('popstate', this.handlePopState);
  }

  goHome(): void {
    this.router.navigate(['/mock-home']);
  }
}
