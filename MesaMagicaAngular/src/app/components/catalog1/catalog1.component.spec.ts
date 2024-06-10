import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Catalog1Component } from './catalog1.component';

describe('Catalog1Component', () => {
  let component: Catalog1Component;
  let fixture: ComponentFixture<Catalog1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Catalog1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Catalog1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
