import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotaVozFormPage } from './nota-voz-form-page';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

describe('NotaVozFormPage', () => {
  let component: NotaVozFormPage;
  let fixture: ComponentFixture<NotaVozFormPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotaVozFormPage],
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

    fixture = TestBed.createComponent(NotaVozFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
