import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectUpload } from './subject-upload.component';

describe('SubjectUpload', () => {
  let component: SubjectUpload;
  let fixture: ComponentFixture<SubjectUpload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubjectUpload],
    }).compileComponents();

    fixture = TestBed.createComponent(SubjectUpload);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
