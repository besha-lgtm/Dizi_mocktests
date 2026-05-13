import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Header1 } from './header1.component';

describe('Header1', () => {
  let component: Header1;
  let fixture: ComponentFixture<Header1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Header1],
    }).compileComponents();

    fixture = TestBed.createComponent(Header1);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
