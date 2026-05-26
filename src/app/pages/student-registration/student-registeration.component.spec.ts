import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentRegistrationComponent } from './student-registeration.component';

describe('StudentRegistrationComponent', () => {
  let component: StudentRegistrationComponent;
  let fixture: ComponentFixture<StudentRegistrationComponent>;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StudentRegistrationComponent],
        }).compileComponents();
        fixture = TestBed.createComponent(StudentRegistrationComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });    
});
