import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Catalog4Component } from './catalog4.component';

describe('Catalog4Component', () => {
  let component: Catalog4Component;
  let fixture: ComponentFixture<Catalog4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Catalog4Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Catalog4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
