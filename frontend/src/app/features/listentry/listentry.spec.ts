import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Listentry } from './listentry';

describe('Listentry', () => {
  let component: Listentry;
  let fixture: ComponentFixture<Listentry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Listentry]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Listentry);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
