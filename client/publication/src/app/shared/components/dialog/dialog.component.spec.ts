import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogComponent } from './dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;

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
      imports: [DialogComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: matDialogSpy,
        },
        { provide: MAT_DIALOG_DATA, useValue: data },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
