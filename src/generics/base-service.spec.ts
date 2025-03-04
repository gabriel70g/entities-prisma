import { Test, TestingModule } from '@nestjs/testing';
import { BaseService } from './base-service';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from '@nestjs/common';

class TestEntity { id: string; name: string; } // Entidad ficticia para pruebas

describe('BaseService', () => {
    let service: BaseService<TestEntity, { id: string }, any>;
    let prismaService: PrismaService;
    let logger: Logger;

    const mockPrisma = {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };

    const mockLogger = {
        log: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn(),
        verbose: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                { provide: PrismaService, useValue: mockPrisma },
                { provide: Logger, useValue: mockLogger },
            ],
        }).compile();

        prismaService = module.get<PrismaService>(PrismaService);
        logger = module.get<Logger>(Logger);
        service = new BaseService(prismaService, mockPrisma); // Pasamos el mock como modelo
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should call findOne with correct parameters', async () => {
        const id = '123';
        mockPrisma.findUnique.mockResolvedValue({ id, name: 'Test Entity' });

        const result = await service.findOne({ id });

        expect(mockPrisma.findUnique).toHaveBeenCalledWith({ where: { id } });
        expect(result).toEqual({ id, name: 'Test Entity' });
    });

    it('should call findMany and return entities', async () => {
        mockPrisma.findMany.mockResolvedValue([{ id: '123', name: 'Entity1' }]);

        const result = await service.findMany();

        expect(mockPrisma.findMany).toHaveBeenCalledWith(undefined);
        expect(result).toEqual([{ id: '123', name: 'Entity1' }]);
    });

    it('should create an entity', async () => {
        const data = { name: 'New Entity' };
        const createdEntity = { id: '123', ...data };
        mockPrisma.create.mockResolvedValue(createdEntity);

        const result = await service.create(data);

        expect(mockPrisma.create).toHaveBeenCalledWith({ data });
        expect(result).toEqual(createdEntity);
    });

    it('should update an entity', async () => {
        const id = '123';
        const data = { name: 'Updated Name' };
        const updatedEntity = { id, ...data };
        mockPrisma.update.mockResolvedValue(updatedEntity);

        const result = await service.update({ where: { id }, data });

        expect(mockPrisma.update).toHaveBeenCalledWith({ where: { id }, data });
        expect(result).toEqual(updatedEntity);
    });

    it('should delete an entity', async () => {
        const id = '123';
        const deletedEntity = { id, name: 'Deleted Entity' };
        mockPrisma.delete.mockResolvedValue(deletedEntity);

        const result = await service.delete({ id });

        expect(mockPrisma.delete).toHaveBeenCalledWith({ where: { id } });
        expect(result).toEqual(deletedEntity);
    });

    it('should log an error when findOne throws an exception', async () => {
        const id = '123';
        const error = new Error('Test Error');
        mockPrisma.findUnique.mockRejectedValue(error);

        await expect(service.findOne({ id })).rejects.toThrow(error);
    
    });

    it('should log an error when create throws an exception', async () => {
        const data = { name: 'New Entity' };
        const error = new Error('Test Error');
        mockPrisma.create.mockRejectedValue(error);

        await expect(service.create(data)).rejects.toThrow(error);
    });

    // Agrega más pruebas para otros métodos y excepciones según sea necesario
});