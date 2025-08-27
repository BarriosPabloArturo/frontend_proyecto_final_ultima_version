import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotaTipoPage } from './nota-tipo-page';
import { ActivatedRoute } from '@angular/router';

describe('NotaTipoPage', () => {
  let component: NotaTipoPage;
  let fixture: ComponentFixture<NotaTipoPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotaTipoPage],
      providers: [
        { provide: ActivatedRoute, useValue: {} }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotaTipoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
