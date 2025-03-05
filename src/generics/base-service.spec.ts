import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from './base-service';
import { logger } from 'src/logger/loggerBase';

jest.mock('src/logger/loggerBase');

describe('BaseService', () => {
    let service: BaseService<any, any, any, any, any, any>;
    let prismaService: PrismaService;

    const mockModel = {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: PrismaService,
                    useValue: {
                        model: mockModel,
                    },
                },
                {
                    provide: BaseService,
                    useFactory: (prismaService: PrismaService) => new BaseService(prismaService, mockModel),
                    inject: [PrismaService],
                },
            ],
        }).compile();

        service = module.get<BaseService<any, any, any, any, any, any>>(BaseService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findOne', () => {
        it('should return a single entity', async () => {
          const entity = { id: 1, name: 'Test' };
          mockModel.findUnique.mockResolvedValue(entity);
      
          const result = await service.findOne({ id: 1 });
          expect(result).toEqual(entity);
        });
      
        it('should throw an error if findOne fails', async () => {
          mockModel.findUnique.mockRejectedValue(new Error('Error'));
      
          await expect(service.findOne({ id: 1 })).rejects.toThrow('Error');
        });
      });

    describe('findAll', () => {
        it('should return an array of entities', async () => {
            const entities = [{ id: 1, name: 'Test' }];
            mockModel.findMany.mockResolvedValue(entities);

            const result = await service.findAll({});
            expect(result).toEqual(entities);
        });

        it('should throw an error if findAll fails', async () => {
            mockModel.findMany.mockRejectedValue(new Error('Error'));

            await expect(service.findAll({})).rejects.toThrow('Error');
        });
    });

    describe('create', () => {
        it('should create a new entity', async () => {
            const entity = { id: 1, name: 'Test' };
            mockModel.create.mockResolvedValue(entity);

            const result = await service.create({ name: 'Test' });
            expect(result).toEqual(entity);
        });

        it('should throw an error if create fails', async () => {
            mockModel.create.mockRejectedValue(new Error('Error'));

            await expect(service.create({ name: 'Test' })).rejects.toThrow('Error');
        });
    });

    describe('update', () => {
        it('should update an existing entity', async () => {
            const entity = { id: 1, name: 'Updated Test' };
            mockModel.update.mockResolvedValue(entity);

            const result = await service.update({ where: { id: 1 }, data: { name: 'Updated Test' } });
            expect(result).toEqual(entity);
        });

        it('should throw an error if update fails', async () => {
            mockModel.update.mockRejectedValue(new Error('Error'));

            await expect(service.update({ where: { id: 1 }, data: { name: 'Updated Test' } })).rejects.toThrow('Error');
        });
    });

    describe('delete', () => {
        it('should delete an existing entity', async () => {
            const entity = { id: 1, name: 'Test' };
            mockModel.delete.mockResolvedValue(entity);

            const result = await service.delete({ id: 1 });
            expect(result).toEqual(entity);
        });

        it('should throw an error if delete fails', async () => {
            mockModel.delete.mockRejectedValue(new Error('Error'));

            await expect(service.delete({ id: 1 })).rejects.toThrow('Error');

        });
    });
});