import { Test } from '@nestjs/testing';
import { UsersSerivce } from './users.service';

describe('Test UsersService', () => {
  let service: UsersSerivce;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [UsersSerivce],
    }).compile();
    service = module.get<UsersSerivce>(UsersSerivce);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
