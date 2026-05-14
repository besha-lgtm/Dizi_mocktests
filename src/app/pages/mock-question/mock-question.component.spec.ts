import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockQuestion } from './mock-question.component';

describe('MockQuestion', () => {
  let component: MockQuestion;
  let fixture: ComponentFixture<MockQuestion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MockQuestion],
    }).compileComponents();

    fixture = TestBed.createComponent(MockQuestion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
