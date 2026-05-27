import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Header3 } from './header3.component';

describe('Header3', () => {
  let component: Header3;
  let fixture: ComponentFixture<Header3>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Header3],
    }).compileComponents();

    fixture = TestBed.createComponent(Header3);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
