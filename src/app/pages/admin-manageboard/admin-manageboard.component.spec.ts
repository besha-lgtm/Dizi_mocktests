import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManageboard } from './admin-manageboard.component';

describe('AdminManageboard', () => {
  let component: AdminManageboard;
  let fixture: ComponentFixture<AdminManageboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminManageboard],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminManageboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
