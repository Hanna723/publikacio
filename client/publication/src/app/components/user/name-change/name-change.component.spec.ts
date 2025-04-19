import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NameChangeComponent } from './name-change.component';

describe('NameChangeComponent', () => {
  let component: NameChangeComponent;
  let fixture: ComponentFixture<NameChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NameChangeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NameChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
