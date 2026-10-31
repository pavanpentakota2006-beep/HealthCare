import { Test, TestingModule } from '@nestjs/testing';
import { HealthTrackingController } from './health-tracking.controller';

describe('HealthTrackingController', () => {
  let controller: HealthTrackingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthTrackingController],
    }).compile();

    controller = module.get<HealthTrackingController>(HealthTrackingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
