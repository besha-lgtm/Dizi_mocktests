import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface AdvancedMockTest {

  id: number;

  title: string;

  description: string;

  questions: number;

  status: 'live' | 'coming-soon';

}

@Component({
  selector: 'app-jee-advanced-mocktest',
  standalone: false,
  templateUrl: './jee-advanced-mocktest.component.html',
  styleUrls: ['./jee-advanced-mocktest.component.css']
})

export class JeeAdvancedMocktestComponent {

  mockTests: AdvancedMockTest[] = [

    {
      id: 1,

      title: 'JEE Advanced Mock Test 1',

      description:
      'Full syllabus advanced examination with multi-correct, numerical and paragraph-based questions.',

      questions: 54,

      status: 'live'
    },

    {
      id: 2,

      title: 'JEE Advanced Mock Test 2',

      description:
      'High difficulty IIT-level problem solving assessment for Physics, Chemistry and Mathematics.',

      questions: 54,

      status: 'coming-soon'
    },

    {
      id: 3,

      title: 'JEE Advanced Mock Test 3',

      description:
      'Real JEE Advanced pattern test with conceptual IIT-level questions, and negative marking evaluation.',

      questions: 54,

      status: 'coming-soon'
    }

  ];

  constructor(
    private router: Router
  ) {}

  startTest(test: AdvancedMockTest): void {

    if(test.status === 'live'){

      this.router.navigate(['/advanced-instructions']);

    }

  }

}