import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeacherRegisterComponent } from './teacher-register.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

describe('TeacherRegisterComponent', () => {
  let component: TeacherRegisterComponent;
  let fixture: ComponentFixture<TeacherRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherRegisterComponent ],
      imports: [ FormsModule, RouterModule.forRoot([]) ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
