import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { CustomerFeedbackByProductComponent } from './customer-feedback-by-product.component';
import { environment } from '../../../../../environments/environment';

describe('CustomerFeedbackByProductComponent', () => {
  let component: CustomerFeedbackByProductComponent;
  let fixture: ComponentFixture<CustomerFeedbackByProductComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerFeedbackByProductComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerFeedbackByProductComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    // ✅ Test 1: component initializes
    expect(component).toBeTruthy();
  });

  it('should fetch feedback data on init and set state to ready', () => {
    // ✅ Test 2: successful API call -> state ready + rows populated
    fixture.detectChanges(); // triggers ngOnInit

    const req = httpMock.expectOne(
      `${environment.apiBaseUrl}/reports/customer-feedback/by-product`,
    );
    expect(req.request.method).toBe('GET');

    req.flush([
      { product: 'Internet', responses: 10, avgRating: 4.2 },
      { product: 'Mobile', responses: 5, avgRating: 3.8 },
    ]);

    expect(component.state).toBe('ready');
    expect(component.rows.length).toBe(2);
    expect(component.rows[0].product).toBe('Internet');
  });

  it('should set state to error when the API call fails', () => {
    // ✅ Test 3: failed API call -> state error + message set
    fixture.detectChanges(); // triggers ngOnInit

    const req = httpMock.expectOne(
      `${environment.apiBaseUrl}/reports/customer-feedback/by-product`,
    );
    expect(req.request.method).toBe('GET');

    req.flush(
      { message: 'Server error' },
      { status: 500, statusText: 'Server Error' },
    );

    expect(component.state).toBe('error');
    expect(component.errorMessage).toBeTruthy();
  });
});
