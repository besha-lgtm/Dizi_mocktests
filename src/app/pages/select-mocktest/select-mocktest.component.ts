import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface MockTestCard {
  id: number;
  title: string;
  description: string;
  questions: number;
  status: 'live' | 'coming-soon';
}

@Component({
  selector: 'app-select-mocktest',
  standalone: false,
  templateUrl: './select-mocktest.component.html',
  styleUrl: './select-mocktest.component.css'
})
export class SelectMocktestComponent {

  mockTests: MockTestCard[] = [
    {
      id: 1,
      title: 'Mock Test 1',
      description: 'Comprehensive assessment covering Mathematics, Physics, and Chemistry modules.',
      questions: 30,
      status: 'live'
    },
    {
      id: 2,
      title: 'Mock Test 2',
      description: 'Preparation series for core Science subjects: Maths, Physics, and Chemistry.',
      questions: 30,
      status: 'coming-soon'
    },
    {
      id: 3,
      title: 'Mock Test 3',
      description: 'Advanced practice modules for Mathematics, Physics, and Chemistry.',
      questions: 30,
      status: 'coming-soon'
    }
  ];

  constructor(private router: Router) {}

  startTest(test: MockTestCard): void {
    if (test.status === 'live') {
      this.router.navigate(['/exam-home']);
    }
  }
}
