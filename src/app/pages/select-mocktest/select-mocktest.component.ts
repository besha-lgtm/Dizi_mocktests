import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { QuestionService } from '../../services/question.service';
import { ScoreService } from '../../services/score.service';
import { forkJoin, of, combineLatest } from 'rxjs';
import { finalize, catchError } from 'rxjs/operators';

interface MockTestCard {
  id: number;
  title: string;
  description: string;
  questions: number;
  status: 'live' | 'coming-soon' | 'attempted';
}

@Component({
  selector: 'app-select-mocktest',
  standalone: false,
  templateUrl: './select-mocktest.component.html',
  styleUrl: './select-mocktest.component.css'
})
export class SelectMocktestComponent implements OnInit {

  mockTests: MockTestCard[] = [];
  isLoading = false;
  apiError = '';
  examType = 'JEE Mains'; // default, overridden from query param

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private scoreService: ScoreService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    combineLatest([this.route.data, this.route.queryParams]).subscribe(([data, params]) => {
      const newExamType: string = (data && data['examType'])
        ? data['examType']
        : (params['examType'] || 'JEE Mains');

      if (newExamType !== this.examType || this.mockTests.length === 0) {
        this.examType = newExamType;
        this.loadMockTests();
      }
    });
  }

  loadMockTests(): void {
    this.isLoading = true;
    this.apiError = '';

    const studentId =
      localStorage.getItem('dizi_studentId') ||
      sessionStorage.getItem('dizi_studentId') || 'guest';

    forkJoin({
      questions: this.questionService.getQuestions(undefined, undefined, this.examType).pipe(
        catchError(err => {
          console.error('getQuestions error:', err);
          return of({ success: false, questions: [] });
        })
      ),
      scores: this.scoreService.getStudentScores(studentId).pipe(
        catchError(err => {
          console.error('getStudentScores error:', err);
          return of({ success: false, scores: [] });
        })
      )
    })
    .pipe(
      finalize(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      })
    )
    .subscribe(({ questions, scores }) => {
      if (!questions.success) {
        this.apiError = 'Failed to load mock tests. Make sure the backend is running.';
        return;
      }

      const qList = questions.questions ?? [];
      const attemptedMockIds = new Set<number>(
        (scores.scores || [])
          .filter((s: any) => s.examType === this.examType)
          .map((s: any) => s.mockTestId)
      );

      // Group questions by mockTestId
      const groupMap: { [key: number]: number } = {};
      qList.forEach(q => {
        const mId = q.mockTestId || 1;
        groupMap[mId] = (groupMap[mId] || 0) + 1;
      });

      // Build dynamic mock tests
      const cards: MockTestCard[] = Object.keys(groupMap).map(key => {
        const idVal = parseInt(key, 10);
        const isAttempted = attemptedMockIds.has(idVal);
        return {
          id: idVal,
          title: `Mock Test ${idVal}`,
          description: `${this.examType} — Comprehensive assessment covering Mathematics, Physics, and Chemistry.`,
          questions: groupMap[idVal],
          status: isAttempted ? 'attempted' : 'live'
        } as MockTestCard;
      });

      // Sort latest created mock test first (highest mockTestId on top)
      this.mockTests = cards.sort((a, b) => b.id - a.id);
    });
  }

  startTest(test: MockTestCard): void {
    if (test.status === 'live') {
      this.zone.run(() => {
        this.router.navigate(['/exam-home'], {
          queryParams: { mockTestId: test.id, examType: this.examType }
        });
      });
    }
  }

  private getAttemptKey(mockTestId: number): string {
    const studentId =
      localStorage.getItem('dizi_studentId') ||
      sessionStorage.getItem('dizi_studentId') || 'guest';
    return `dizi_attempted_${studentId}_${this.examType}_${mockTestId}`;
  }

  goBack(): void {
    this.zone.run(() => {
      this.router.navigate(['/exam-selection']);
    });
  }
}
