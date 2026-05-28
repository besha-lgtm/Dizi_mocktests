import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JeeAdvancedQuestions } from './jee-advanced-questions.component';

describe('JeeAdvancedQuestions', () => {
  let component: JeeAdvancedQuestions;
  let fixture: ComponentFixture<JeeAdvancedQuestions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JeeAdvancedQuestions],
    }).compileComponents();

    fixture = TestBed.createComponent(JeeAdvancedQuestions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
