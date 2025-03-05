import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { logger } from 'src/logger/loggerBase';

@Injectable()
export class BaseService<T, CreateInput, UpdateInput, WhereUniqueInput, WhereInput, OrderByInput> {
  constructor(private readonly prisma: PrismaService, private readonly model: any) { }

  async findOne(where: WhereUniqueInput): Promise<T | null> {
    try {
      const resp = this.model.findUnique({ where });
      logger.info('findOne', resp);
      return resp;
    }
    catch (error) {
      logger.error(error);
      throw new Error(error);
    }
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: WhereUniqueInput;
    where?: WhereInput;
    orderBy?: OrderByInput;
  }): Promise<T[]> {
    try {
      const { skip, take, cursor, where, orderBy } = params;
      return this.model.findMany({ skip, take, cursor, where, orderBy });
    } catch (error) {
      logger.error(error);
      throw new Error(error);
    }

  }

  async create(data: CreateInput): Promise<T> {
    try {
      const resp = this.model.create({ data });
      logger.info('create', resp);
      return resp;
    }
    catch (error) {
      logger.error(error);
      throw new Error(error);
    }
  }

  async update(params: { where: WhereUniqueInput; data: UpdateInput }): Promise<T> {
    try {
      const { where, data } = params;
      const resp = this.model.update({ where, data
      });
      logger.info('update', resp);
      return resp;
    } catch (error) {
      logger.error(error);
      throw new Error(error);
    }
  }

  async delete(where: WhereUniqueInput): Promise<T> {
    try {
    const resp = this.model.delete({ where });
    logger.info('delete', resp);
    return resp;
  }
  catch (error) {
    logger.error(error);
    throw new Error(error);
  }
}
}