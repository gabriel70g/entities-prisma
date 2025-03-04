import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('Main', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return "OK!!"', () => {
    const resp ={
      "data": "OK!!",
      "statusCode": 200,
      "statusMessage": "OK",
      "errorMessage": null
  }
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect(resp);
  });
});