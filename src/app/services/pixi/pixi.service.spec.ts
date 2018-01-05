import { TestBed, inject } from '@angular/core/testing';

import { PixiService } from './pixi.service';

describe('PixiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PixiService]
    });
  });

  it('should be created', inject([PixiService], (service: PixiService) => {
    expect(service).toBeTruthy();
  }));
});
