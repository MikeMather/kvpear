import { Test, TestingModule } from '@nestjs/testing';
import { KeyValuesService } from './key-values.service';

describe('KeyValuesService', () => {
  let service: KeyValuesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KeyValuesService],
    }).compile();

    service = module.get<KeyValuesService>(KeyValuesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
