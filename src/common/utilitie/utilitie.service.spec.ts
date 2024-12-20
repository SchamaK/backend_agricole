import { Test, TestingModule } from '@nestjs/testing';
import { UtilitieService } from './utilitie.service';

describe('UtilitieService', () => {
  let service: UtilitieService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UtilitieService],
    }).compile();

    service = module.get<UtilitieService>(UtilitieService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
