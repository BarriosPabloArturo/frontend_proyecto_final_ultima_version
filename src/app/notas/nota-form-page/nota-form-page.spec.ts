import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotaFormPage } from './nota-form-page';

describe('NotaFormPage', () => {
  let component: NotaFormPage;
  let fixture: ComponentFixture<NotaFormPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotaFormPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotaFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
