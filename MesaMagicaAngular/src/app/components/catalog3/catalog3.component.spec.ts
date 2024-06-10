import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Catalog3Component } from './catalog3.component';

describe('Catalog3Component', () => {
  let component: Catalog3Component;
  let fixture: ComponentFixture<Catalog3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Catalog3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Catalog3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
