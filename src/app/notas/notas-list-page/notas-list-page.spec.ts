import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotasListPage } from './notas-list-page';

describe('NotasListPage', () => {
  let component: NotasListPage;
  let fixture: ComponentFixture<NotasListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotasListPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotasListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
