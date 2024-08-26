import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagesOptionsCouponsComponent } from './packages-options-coupons.component';

describe('PackagesOptionsCouponsComponent', () => {
  let component: PackagesOptionsCouponsComponent;
  let fixture: ComponentFixture<PackagesOptionsCouponsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackagesOptionsCouponsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackagesOptionsCouponsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
