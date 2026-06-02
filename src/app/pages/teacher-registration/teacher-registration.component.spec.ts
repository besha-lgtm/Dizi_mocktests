import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TeacherRegistrationComponent} from './teacher-registration.component';
describe('TeacherRegistrationComponent', () => {
    let component: TeacherRegistrationComponent;
    let fixture: ComponentFixture<TeacherRegistrationComponent>;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TeacherRegistrationComponent],
        }).compileComponents();
        fixture = TestBed.createComponent(TeacherRegistrationComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    }); 
});