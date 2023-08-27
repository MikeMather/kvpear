import { Test, TestingModule } from '@nestjs/testing';
import { KeyValuesController } from '../key-values.controller';
import { KeyValuesService } from '../key-values.service';

describe('KeyValuesController', () => {
  let controller: KeyValuesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KeyValuesController],
      providers: [KeyValuesService],
    }).compile();

    controller = module.get<KeyValuesController>(KeyValuesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
