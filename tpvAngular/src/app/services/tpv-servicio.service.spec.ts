import { TestBed } from '@angular/core/testing';

import { TpvServicioService } from './tpv-servicio.service';

describe('TpvServicioService', () => {
  let service: TpvServicioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TpvServicioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
