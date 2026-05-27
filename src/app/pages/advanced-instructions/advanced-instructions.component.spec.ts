import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedInstructions } from './advanced-instructions.component';

describe('AdvancedInstructions', () => {
  let component: AdvancedInstructions;
  let fixture: ComponentFixture<AdvancedInstructions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdvancedInstructions],
    }).compileComponents();

    fixture = TestBed.createComponent(AdvancedInstructions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
