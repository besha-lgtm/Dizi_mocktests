import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockSubmit } from './mock-submit.component';

describe('MockSubmit', () => {
  let component: MockSubmit;
  let fixture: ComponentFixture<MockSubmit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MockSubmit],
    }).compileComponents();

    fixture = TestBed.createComponent(MockSubmit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
