import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotaDetallePage } from './nota-detalle-page';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

describe('NotaDetallePage', () => {
  let component: NotaDetallePage;
  let fixture: ComponentFixture<NotaDetallePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotaDetallePage],
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

    fixture = TestBed.createComponent(NotaDetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
