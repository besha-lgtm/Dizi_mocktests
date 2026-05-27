import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamSelection } from './exam-selection.component';

describe('ExamSelection', () => {
  let component: ExamSelection;
  let fixture: ComponentFixture<ExamSelection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExamSelection],
    }).compileComponents();

    fixture = TestBed.createComponent(ExamSelection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
