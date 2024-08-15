import { Injectable, NotFoundException, BadRequestException, } from '@nestjs/common';
import { DeepPartial, Like } from 'typeorm';
import { convertArrayToObject } from 'src/shared/utils/common';
import { PointsTableRepository } from './points-table.repository';
import { PointsTableEntity } from './points-table.entity';
import { CreatePointsTableDto } from './create-points-table.dto';
import { UpdatePointsTableDto } from './update-points-table.dto';

@Injectable()
export class PointsTableService {
  constructor(
    private pointsTableRepository: PointsTableRepository,
  ) {}

  /**
   * Retrieve a paginated list of pointsTables for a specific user.
   *
   * @param {number} userId - The ID of the user whose pointsTables to retrieve.
   * @param {number} skip - The number of items to skip for pagination.
   * @param {number} take - The number of items to take per page for pagination.
   * @param {string} search - Optional search term for filter.
   * @returns {Promise<{ result: PointsTableEntity[]; total: number }>} - The list of pointsTables and the total count.
   */
  async getAllPointsTables(
    userId: number,
    skip: number,
    take: number,
    search?: string,
  ): Promise<{ result: PointsTableEntity[]; total: number }> {
    try {
      return await this.pointsTableRepository.getAll(userId, skip, take, search);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Get a pointsTable by ID for a specific user.
   *
   * @param {number} userId - The ID of the user who owns the pointsTable.
   * @param {number} id - The id of the pointsTable to retrieve.
   * @returns {Promise<PointsTableEntity>} - The pointsTable object.
   * @throws {NotFoundException} - If the pointsTable with the given ID is not found.
   */
  async getPointsTableById(userId: number,id: number): Promise<PointsTableEntity> {
    try {
      const pointsTable = await this.pointsTableRepository.findById(userId,id);
      if (!pointsTable) {
        throw new NotFoundException('PointsTableEntity not found');
      }
      return pointsTable;
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Create a new pointsTable for a specific user.
   *
   * @param {number} userId - The ID of the user creating the pointsTable.
   * @param {CreatePointsTableDto} createPointsTableDto - The DTO for creating a pointsTable.
   * @returns {Promise<PointsTableEntity>} - The newly created pointsTable object.
   */
  async createPointsTable(userId: number,createPointsTableDto: CreatePointsTableDto): Promise<PointsTableEntity> {
    try {

      const pointsTable = this.pointsTableRepository.create({
        task: { id: createPointsTableDto.taskId },
        user: { id: userId },
      });
      return this.pointsTableRepository.save(pointsTable);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Update an existing pointsTable for a specific user.
   *
   * @param {number} userId - The ID of the user who owns the pointsTable.
   * @param {number} id - The id of the pointsTable to update.
   * @param {UpdatePointsTableDto} updatePointsTableDto - The DTO for updating a pointsTable.
   * @returns {Promise<PointsTableEntity>} - The updated pointsTable object.
   * @throws {NotFoundException} - If the pointsTable with the given ID is not found.
   */
  async updatePointsTable(userId: number,id: number, updatePointsTableDto: UpdatePointsTableDto): Promise<PointsTableEntity> {
    try {
      const pointsTable = await this.getPointsTableById(userId, id);

      const updateData: DeepPartial<PointsTableEntity> = {
        task: { id: updatePointsTableDto.taskId },
        user: { id: userId },
      };

      this.pointsTableRepository.merge(pointsTable, updateData);
      return this.pointsTableRepository.save(pointsTable);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Delete a pointsTable for a specific user by its ID.
   *
   * @param {number} userId - The ID of the user who owns the pointsTable.
   * @param {number} id - The id of the pointsTable to delete.
   * @returns {Promise<void>}
   * @throws {NotFoundException} - If the pointsTable with the given ID is not found.
   */
  async deletePointsTable(userId: number,id: number): Promise<void> {
    try {
      const pointsTable = await this.getPointsTableById(userId,id);
      await this.pointsTableRepository.remove(pointsTable);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Find pointsTable data for dropdowns with optional filtering.
   *
   *@param {number} userId - The ID of the user whose data to retrieve.
   * @param {string[]} fields - Comma-separated list of fields to retrieve.
   * @param {string} keyword - Optional keyword for filtering data.
   * @returns {Promise<PointsTableEntity[]>} - The list of pointsTable data for dropdowns.
   */
  async findAllDropdownData(userId: number,fields: string[], keyword?: string): Promise<PointsTableEntity[]> {
    try {
      return this.pointsTableRepository.findAllDropdown(userId, fields, keyword);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

   /**
   * Retrieve a paginated list of pointsTables by task for a specific user.
   *
   * @param {number} userId - The ID of the user whose pointsTables to retrieve.
   * @param {number} taskId - The taskId of the pointsTable to retrieve.
   * @param {number} skip - The number of items to skip for pagination.
   * @param {number} take - The number of items to take per page for pagination.
   * @param {string} search - Optional search term for filter.
   * @returns {Promise<{ result: PointsTableEntity[]; total: number }>} - The list of pointsTables and the total count.
   */
  async getPointsTablesByTaskId(
    userId: number,
    taskId: number,
    skip: number,
    take: number,
    search?: string,
  ): Promise<{ result: PointsTableEntity[]; total: number }> {
    try {
      return await this.pointsTableRepository.getPointsTablesByTaskId(userId, taskId, skip, take, search);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

}
