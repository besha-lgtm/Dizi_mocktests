import { Component, Input, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

interface InstructionSection {
  title: string;
  items: string[];
}

@Component({
  selector: 'app-header3',
  standalone: false,
  templateUrl: './header3.component.html',
  styleUrl: './header3.component.css',
})
export class Header3Component implements OnInit, OnDestroy {
  @Input() logoText: string = 'JEE';
  @Input() logoSubtext: string = 'MAINS';
  @Input() examTitle: string = 'Joint Entrance Examination';
  @Input() organizingInstitute: string = 'Dizi Edutech';
  @Input() examBarTitle: string = 'JEE Advanced 2026 Paper 1 Mock Exam';

  // Dynamic timer settings (Changing this minutes value automatically recalibrates the live timer and instructions)
  @Input() set totalTimeMinutes(minutes: number) {
    this._totalTimeMinutes = minutes;
    this.resetTimer(minutes);
  }
  get totalTimeMinutes(): number {
    return this._totalTimeMinutes;
  }
  private _totalTimeMinutes: number = 10; // Default 180 mins (3 Hours)

  timeLeftSeconds: number = 25 * 60;
  private timerInterval: any;

  // Modal controls
  showModal: boolean = false;

  // Dynamic Instruction data structure
  instructionSections: InstructionSection[] = [
    {
      title: 'GENERAL INSTRUCTIONS',
      items: [
        `Total duration of the paper is <b>3 hours (${this.totalTimeMinutes} minutes)</b>.`,
        'The on-screen clock will be set at the server. Only <b>saved</b> answers will be recorded.',
        'The Question Palette shows status for each question using colour-coded symbols.',
        '<b>Mark for Review</b> indicates you would like to revisit the question.',
        'Use <b>&gt;</b> to collapse the palette and maximise the question window.'
      ]
    },
    {
      title: 'NAVIGATING & ANSWERING',
      items: [
        '<b>Save & Next</b> — saves answer and moves to next question.',
        '<b>Mark for Review & Next</b> — saves, flags, and moves to next.',
        '<b>Clear Response</b> — clears the current selection.'
      ]
    }
  ];

  constructor(private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit(): void {
    this.startTimer();
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  private startTimer(): void {
    this.clearTimer();
    this.timerInterval = setInterval(() => {
      if (this.timeLeftSeconds > 0) {
        this.timeLeftSeconds--;
        // Force view refresh on every tick to support zoneless/optimized Angular rendering engines
        this.cdr.detectChanges();
      } else {
        this.clearTimer();
        this.cdr.detectChanges();
        
        this.router.navigate(['/mock-submit']);
      }
    }, 1000);
  }

  private clearTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  private resetTimer(minutes: number): void {
    this.timeLeftSeconds = minutes * 60;
    // Synchronously update the instructions to match the updated time minutes
    this.instructionSections[0].items[0] = `Total duration of the paper is <b>${Math.floor(minutes / 60)} hours (${minutes} minutes)</b>.`;
    this.startTimer();
  }

  get formattedTimeLeft(): string {
    const totalMinutes = Math.floor(this.timeLeftSeconds / 60);
    const secs = this.timeLeftSeconds % 60;

    // Formatting as MM:SS or MMM:SS depending on magnitude
    const displayMinutes = totalMinutes.toString().padStart(2, '0');
    const displaySeconds = secs.toString().padStart(2, '0');

    return `${displayMinutes}:${displaySeconds}`;
  }

  openInstructions(): void {
    this.showModal = true;
  }

  closeInstructions(): void {
    this.showModal = false;
  }
}
