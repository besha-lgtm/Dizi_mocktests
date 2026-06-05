import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface MockTest {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration: number;
  questions: number;
  participants: number;
  avgScore: number;
}

@Component({
  selector: 'app-mock-home',
  standalone: false,
  templateUrl: './mock-home.component.html',
  styleUrl: './mock-home.component.css'
})
export class MockHomeComponent {
  // Static mock tests data
  mockTests: MockTest[] = [
    {
      id: 1,
      title: 'IoT Fundamentals Challenge',
      description: 'Test your knowledge of IoT concepts, sensors, and applications',
      category: 'IoT',
      difficulty: 'Beginner',
      duration: 30,
      questions: 20,
      participants: 245,
      avgScore: 78
    },
    {
      id: 2,
      title: 'Agricultural AI Vision Test',
      description: 'Practice with AI/ML concepts in agriculture and computer vision',
      category: 'AI/Vision',
      difficulty: 'Intermediate',
      duration: 45,
      questions: 30,
      participants: 189,
      avgScore: 72
    },
    {
      id: 3,
      title: 'Manufacturing Optimization Quiz',
      description: 'Solve problems related to manufacturing efficiency and optimization',
      category: 'Manufacturing',
      difficulty: 'Advanced',
      duration: 60,
      questions: 40,
      participants: 156,
      avgScore: 68
    },
    {
      id: 4,
      title: 'RFID Technology Basics',
      description: 'Learn and test your RFID knowledge and implementation skills',
      category: 'RFID',
      difficulty: 'Beginner',
      duration: 25,
      questions: 15,
      participants: 312,
      avgScore: 82
    },
    {
      id: 5,
      title: 'Problem Solving Skills',
      description: 'General problem solving and logical reasoning assessment',
      category: 'General',
      difficulty: 'Intermediate',
      duration: 50,
      questions: 35,
      participants: 428,
      avgScore: 75
    },
    {
      id: 6,
      title: 'Innovation Design Challenge',
      description: 'Design and propose solutions for real-world problems',
      category: 'Design',
      difficulty: 'Advanced',
      duration: 90,
      questions: 5,
      participants: 98,
      avgScore: 70
    }
  ];

  constructor(private router: Router) {}

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  takeMockTest(testId: number): void {
    // Navigate to take the specific mock test
    this.router.navigate(['/mock-test', testId]);
  }
}
