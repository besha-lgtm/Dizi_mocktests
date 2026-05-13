import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockHome } from './mock-home.component';

describe('MockHome', () => {
  let component: MockHome;
  let fixture: ComponentFixture<MockHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MockHome],
    }).compileComponents();

    fixture = TestBed.createComponent(MockHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
