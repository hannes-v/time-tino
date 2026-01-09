import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tagselector } from './tagselector';

describe('Tagselector', () => {
  let component: Tagselector;
  let fixture: ComponentFixture<Tagselector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tagselector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tagselector);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
