import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainLayout2 } from './main-layout2.component';

describe('MainLayout2', () => {
  let component: MainLayout2;
  let fixture: ComponentFixture<MainLayout2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainLayout2],
    }).compileComponents();

    fixture = TestBed.createComponent(MainLayout2);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
