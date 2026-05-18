import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
interface SubmitData {
  title: string;
  message: string;
  submissionId: string;
  timestamp: string;
  description: string;
}

@Component({
  selector: 'app-mock-submit',
  standalone: false,
  templateUrl: './mock-submit.component.html',
  styleUrl: './mock-submit.component.css',
})
export class MockSubmit implements OnInit, OnDestroy {
  private timerId: ReturnType<typeof setInterval> | null = null;
  remainingSeconds = 5;

  submitData: SubmitData = {
    title: 'Examination Submitted!',
    message: 'Your answers have been successfully recorded and submitted. Thank you for completing the examination.',
    submissionId: 'JEE26-MOCK-00491',
    timestamp: '5/14/2026, 3:14:04 PM',
    description: 'Submission Details'
  };

  constructor(private cdr: ChangeDetectorRef, private router: Router) {}

  ngOnInit(): void {
    this.startTimer();
    this.preventRefresh();
  }

  ngOnDestroy(): void {
    this.clearTimer();
    this.removeRefreshPrevention();
  }

  get timerDisplay(): string {
    const minutes = Math.floor(this.remainingSeconds / 60);
    const seconds = this.remainingSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // CHANGE: Added method to prevent page refresh and back navigation
  private preventRefresh(): void {
    // Prevent browser refresh (F5, Ctrl+R, Cmd+R)
    window.addEventListener('beforeunload', this.handleBeforeUnload);
    
    // Prevent back button navigation
    history.pushState(null, '', location.href);
    window.addEventListener('popstate', this.handlePopState);
  }

  // CHANGE: Added method to remove refresh prevention listeners on component destroy
  private removeRefreshPrevention(): void {
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
    window.removeEventListener('popstate', this.handlePopState);
  }

  // CHANGE: Handle beforeunload event to show warning on refresh
  private handleBeforeUnload = (event: BeforeUnloadEvent): void => {
    event.preventDefault();
    event.returnValue = '';
    return;
  };

  // CHANGE: Handle popstate event to prevent back button navigation
  private handlePopState = (): void => {
    history.pushState(null, '', location.href);
  };

  private startTimer(): void {
    this.clearTimer();

    this.timerId = setInterval(() => {
      this.remainingSeconds--;
      this.cdr.detectChanges();

      if (this.remainingSeconds < 0) {
        this.clearTimer();
        // Redirect to feedback page when time is up
        this.router.navigate(['/feedback']);
      }
    }, 1000);
  }

  private clearTimer(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}
