import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotaChecklistFormPage } from './nota-checklist-form-page';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

describe('NotaChecklistFormPage', () => {
  let component: NotaChecklistFormPage;
  let fixture: ComponentFixture<NotaChecklistFormPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotaChecklistFormPage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: null })
            }
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotaChecklistFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
