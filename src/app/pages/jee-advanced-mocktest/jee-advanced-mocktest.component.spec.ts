import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JeeAdvancedMocktest } from './jee-advanced-mocktest.component';

describe('JeeAdvancedMocktest', () => {
  let component: JeeAdvancedMocktest;
  let fixture: ComponentFixture<JeeAdvancedMocktest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JeeAdvancedMocktest],
    }).compileComponents();

    fixture = TestBed.createComponent(JeeAdvancedMocktest);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
