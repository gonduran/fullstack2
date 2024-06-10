import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Catalog2Component } from './catalog2.component';

describe('Catalog2Component', () => {
  let component: Catalog2Component;
  let fixture: ComponentFixture<Catalog2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Catalog2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Catalog2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
