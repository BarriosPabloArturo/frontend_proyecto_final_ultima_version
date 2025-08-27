import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotaCalendarioFormPage } from './nota-calendario-form-page';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

describe('NotaCalendarioFormPage', () => {
  let component: NotaCalendarioFormPage;
  let fixture: ComponentFixture<NotaCalendarioFormPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotaCalendarioFormPage],
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

    fixture = TestBed.createComponent(NotaCalendarioFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
