import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyInputComponent } from './copy-input.component';

describe('CopyInputComponent', () => {
  let component: CopyInputComponent;
  let fixture: ComponentFixture<CopyInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CopyInputComponent]
    });
    fixture = TestBed.createComponent(CopyInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
