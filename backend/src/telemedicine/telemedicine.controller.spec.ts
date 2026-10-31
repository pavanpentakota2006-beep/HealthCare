import { Test, TestingModule } from '@nestjs/testing';
import { TelemedicineController } from './telemedicine.controller';

describe('TelemedicineController', () => {
  let controller: TelemedicineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TelemedicineController],
    }).compile();

    controller = module.get<TelemedicineController>(TelemedicineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
