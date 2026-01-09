import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Timeinput } from './timeinput';

describe('Timeinput', () => {
  let component: Timeinput;
  let fixture: ComponentFixture<Timeinput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Timeinput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Timeinput);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
