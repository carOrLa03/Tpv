import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IframeTpvComponent } from './iframe-tpv.component';

describe('IframeTpvComponent', () => {
  let component: IframeTpvComponent;
  let fixture: ComponentFixture<IframeTpvComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IframeTpvComponent]
    });
    fixture = TestBed.createComponent(IframeTpvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
