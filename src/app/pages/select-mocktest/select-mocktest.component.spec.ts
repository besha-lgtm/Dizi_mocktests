import { ComponentFixture, TestBed } from '@angular/core/testing';

import {SelectMocktestComponent} from './select-mocktest.component';    

describe('SelectMocktestComponent', () => {
    let component: SelectMocktestComponent;
    let fixture: ComponentFixture<SelectMocktestComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SelectMocktestComponent],
        }).compileComponents();
        fixture = TestBed.createComponent(SelectMocktestComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

