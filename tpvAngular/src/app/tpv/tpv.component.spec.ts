import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TpvComponent } from './tpv.component';

describe('TpvComponent', () => {
  let component: TpvComponent;
  let fixture: ComponentFixture<TpvComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TpvComponent]
    });
    fixture = TestBed.createComponent(TpvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
