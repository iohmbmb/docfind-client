import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Preferences } from './preferences';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';

declare global {
  interface Window {
    feather: {
      replace: () => void;
    } | undefined;
  }
}

describe('Preferences', () => {
  let component: Preferences;
  let fixture: ComponentFixture<Preferences>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    window.feather = {
      replace: () =>{}
    }

    await TestBed.configureTestingModule({
      imports: [Preferences],
      providers: [provideHttpClientTesting() ],
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(Preferences);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach( async () => {
    window.feather = undefined;
    try {
      const pendingRequests = httpTestingController.match(() => true);
      pendingRequests.forEach(req => req.flush({}));
    } catch (e) {
    }
    await new Promise(resolve => setTimeout(resolve, 10));
    if (fixture) {
      fixture.destroy();
    }
  })

  it('should create', async () => {
    expect(component).toBeTruthy();
  });
});
