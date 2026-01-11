import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagselectorWrapper } from './tagselector-wrapper';

describe('TagselectorWrapper', () => {
  let component: TagselectorWrapper;
  let fixture: ComponentFixture<TagselectorWrapper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagselectorWrapper]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagselectorWrapper);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
