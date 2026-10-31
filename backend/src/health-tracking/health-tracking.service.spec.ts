import { Test, TestingModule } from '@nestjs/testing';
import { HealthTrackingService } from './health-tracking.service';

describe('HealthTrackingService', () => {
  let service: HealthTrackingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthTrackingService],
    }).compile();

    service = module.get<HealthTrackingService>(HealthTrackingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
