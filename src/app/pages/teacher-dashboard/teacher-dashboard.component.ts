import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: false,
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.css']
})
export class TeacherDashboardComponent implements OnInit {

  subject: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {

    this.route.params.subscribe(params => {

      this.subject = params['subject'];

    });

  }

  goBackToHome(): void {
    this.router.navigate(['/login']);
  }

}