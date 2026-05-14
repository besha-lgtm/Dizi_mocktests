import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

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

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.startTimer();
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  get timerDisplay(): string {
    const minutes = Math.floor(this.remainingSeconds / 60);
    const seconds = this.remainingSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  private startTimer(): void {
    this.clearTimer();

    this.timerId = setInterval(() => {
      if (this.remainingSeconds <= 1) {
        this.remainingSeconds = 0;
        this.clearTimer();
        this.cdr.detectChanges();
        return;
      }

      this.remainingSeconds--;
      this.cdr.detectChanges();
    }, 1000);
  }

  private clearTimer(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}
