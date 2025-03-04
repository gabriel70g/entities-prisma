
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ConflictException, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { logger } from 'src/logger/loggerBase';


export class BaseService<T, U, V> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly model: any // Modelo Prisma dinámico
  ) {}

  async findOne(where: U): Promise<T | null> {
    const record = await this.model.findUnique({ where });
    if (!record) {
      throw new NotFoundException(`Record not found`);
    }
    return record;
  }

  async findMany(params?: {
    skip?: number;
    take?: number;
    cursor?: U;
    where?: V;
    orderBy?: any;
  }): Promise<T[]> {
  try {
    const result = await this.model.findMany(params);
    logger.info(`findMany result: ${JSON.stringify(result)}`);
    return result;
  } catch (error) {
    logger.error(error.message);
    throw new InternalServerErrorException(error.message);
  }


  }

  async create(data: any, uniqueField?: keyof U, specificField?: keyof V): Promise<T> {
    try {

      // Verifica si el campo específico existe en los datos proporcionados
      if (specificField && data[specificField] !== undefined) {
        const specificRecord = await this.model.findFirst({ where: { [specificField]: data[specificField] } });
        if (!specificRecord) {
          throw new NotFoundException(`Record with this ${String(specificField)} not found`);
        }
      }
      logger.info(`save data: ${JSON.stringify(data)}`);
      return await this.model.create({ data });
    } catch (error) {
      
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        const messageError = `Record with this ${String(uniqueField)} already exists`
        logger.error(messageError);
        throw new ConflictException(messageError);
      }

      logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(params: { where: U; data: any }): Promise<T> {
    let messageError = '';
    try {
      // Verifica si el registro existe antes de actualizar
      const existingRecord = await this.model.findUnique({ where: params.where });
      if (!existingRecord) {
        messageError = `Record not found`;
        throw new NotFoundException(messageError);
      }
      return await this.model.update(params);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        messageError = `Record with this ${String(params.where)} already exists`;
        logger.error(messageError);
        throw new ConflictException(messageError);
      }
      logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async delete(where: U): Promise<T> {
    let messageError = '';
    try {
      // Verifica si el registro existe antes de eliminar
      const existingRecord = await this.model.findUnique({ where });
      if (!existingRecord) {
        messageError = `Record not found`;
        throw new NotFoundException(messageError);
      }
      return await this.model.delete({ where });
    } catch (error) {
      logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }
}