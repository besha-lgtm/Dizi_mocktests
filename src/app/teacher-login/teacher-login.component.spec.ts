import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeacherLoginComponent } from './teacher-login.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

describe('TeacherLoginComponent', () => {
  let component: TeacherLoginComponent;
  let fixture: ComponentFixture<TeacherLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherLoginComponent ],
      imports: [ FormsModule, RouterModule.forRoot([]) ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
