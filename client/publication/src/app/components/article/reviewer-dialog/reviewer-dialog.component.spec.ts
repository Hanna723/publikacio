import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewerDialogComponent } from './reviewer-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('ReviewerDialogComponent', () => {
  let component: ReviewerDialogComponent;
  let fixture: ComponentFixture<ReviewerDialogComponent>;

  const data = {
    title: 'title',
    message: 'message',
    summary: 'my summary',
  };

  beforeEach(async () => {
    const matDialogSpy = jasmine.createSpyObj('MatDialogRef', [
      'onNoClick',
      'closeDialog',
    ]);

    await TestBed.configureTestingModule({
      imports: [ReviewerDialogComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: matDialogSpy,
        },
        { provide: MAT_DIALOG_DATA, useValue: data },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
