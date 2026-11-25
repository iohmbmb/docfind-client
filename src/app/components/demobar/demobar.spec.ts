import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Demobar } from './demobar';

describe('Demobar', () => {
  let component: Demobar;
  let fixture: ComponentFixture<Demobar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Demobar],
    }).compileComponents();

    fixture = TestBed.createComponent(Demobar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
