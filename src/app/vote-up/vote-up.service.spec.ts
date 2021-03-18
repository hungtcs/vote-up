import { Test, TestingModule } from '@nestjs/testing';
import { VoteUpService } from './vote-up.service';

describe('VoteUpService', () => {
  let service: VoteUpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VoteUpService],
    }).compile();

    service = module.get<VoteUpService>(VoteUpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
