import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherSidebar } from './teacher-sidebar.component';

describe('TeacherSidebar', () => {
  let component: TeacherSidebar;
  let fixture: ComponentFixture<TeacherSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeacherSidebar],
    }).compileComponents();

    fixture = TestBed.createComponent(TeacherSidebar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
