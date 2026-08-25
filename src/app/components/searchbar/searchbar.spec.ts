import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { SearchComponent } from './searchbar';
import {provideRouter} from '@angular/router';
import {MapboxService} from '@shared/services/mapbox.service';
import {asyncScheduler, of} from 'rxjs';

declare global {
  interface Window {
    feather: {
      replace: () => void;
    } | undefined;
  }
}

describe('Searchbar', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async () => {
    window.feather = {
      replace: () =>{}
    };
    await TestBed.configureTestingModule({
      imports: [SearchComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => {
    window.feather = undefined;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return empty location list if no search term', () => {
    // TODO: Figure out how to test this
  })

});
