import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotaSketchpadFormPage } from './nota-sketchpad-form-page';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

describe('NotaSketchpadFormPage', () => {
  let component: NotaSketchpadFormPage;
  let fixture: ComponentFixture<NotaSketchpadFormPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotaSketchpadFormPage],
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

    fixture = TestBed.createComponent(NotaSketchpadFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
