import { Test, TestingModule } from '@nestjs/testing';
import { VoteUpController } from './vote-up.controller';

describe('VoteUpController', () => {
  let controller: VoteUpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VoteUpController],
    }).compile();

    controller = module.get<VoteUpController>(VoteUpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
