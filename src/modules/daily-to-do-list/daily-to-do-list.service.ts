import { Injectable, NotFoundException, BadRequestException, } from '@nestjs/common';
import { DeepPartial, Like } from 'typeorm';
import { convertArrayToObject } from 'src/shared/utils/common';
import { DailyToDoListRepository } from './daily-to-do-list.repository';
import { DailyToDoListEntity } from './daily-to-do-list.entity';
import { CreateDailyToDoListDto } from './create-daily-to-do-list.dto';
import { UpdateDailyToDoListDto } from './update-daily-to-do-list.dto';

@Injectable()
export class DailyToDoListService {
  constructor(
    private dailyToDoListRepository: DailyToDoListRepository,
  ) {}

  /**
   * Retrieve a paginated list of dailyToDoLists for a specific user.
   *
   * @param {number} userId - The ID of the user whose dailyToDoLists to retrieve.
   * @param {number} skip - The number of items to skip for pagination.
   * @param {number} take - The number of items to take per page for pagination.
   * @param {string} search - Optional search term for filter.
   * @returns {Promise<{ result: DailyToDoListEntity[]; total: number }>} - The list of dailyToDoLists and the total count.
   */
  async getAllDailyToDoLists(
    userId: number,
    skip: number,
    take: number,
    search?: string,
  ): Promise<{ result: DailyToDoListEntity[]; total: number }> {
    try {
      return await this.dailyToDoListRepository.getAll(userId, skip, take, search);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Get a dailyToDoList by ID for a specific user.
   *
   * @param {number} userId - The ID of the user who owns the dailyToDoList.
   * @param {number} id - The id of the dailyToDoList to retrieve.
   * @returns {Promise<DailyToDoListEntity>} - The dailyToDoList object.
   * @throws {NotFoundException} - If the dailyToDoList with the given ID is not found.
   */
  async getDailyToDoListById(userId: number,id: number): Promise<DailyToDoListEntity> {
    try {
      const dailyToDoList = await this.dailyToDoListRepository.findById(userId,id);
      if (!dailyToDoList) {
        throw new NotFoundException('DailyToDoListEntity not found');
      }
      return dailyToDoList;
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Create a new dailyToDoList for a specific user.
   *
   * @param {number} userId - The ID of the user creating the dailyToDoList.
   * @param {CreateDailyToDoListDto} createDailyToDoListDto - The DTO for creating a dailyToDoList.
   * @returns {Promise<DailyToDoListEntity>} - The newly created dailyToDoList object.
   */
  async createDailyToDoList(userId: number,createDailyToDoListDto: CreateDailyToDoListDto): Promise<DailyToDoListEntity> {
    try {

      const dailyToDoList = this.dailyToDoListRepository.create({
        status: createDailyToDoListDto.status,
                completionDate: createDailyToDoListDto.completionDate,
                task: { id: createDailyToDoListDto.taskId },
        user: { id: userId },
      });
      return this.dailyToDoListRepository.save(dailyToDoList);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Update an existing dailyToDoList for a specific user.
   *
   * @param {number} userId - The ID of the user who owns the dailyToDoList.
   * @param {number} id - The id of the dailyToDoList to update.
   * @param {UpdateDailyToDoListDto} updateDailyToDoListDto - The DTO for updating a dailyToDoList.
   * @returns {Promise<DailyToDoListEntity>} - The updated dailyToDoList object.
   * @throws {NotFoundException} - If the dailyToDoList with the given ID is not found.
   */
  async updateDailyToDoList(userId: number,id: number, updateDailyToDoListDto: UpdateDailyToDoListDto): Promise<DailyToDoListEntity> {
    try {
      const dailyToDoList = await this.getDailyToDoListById(userId, id);

      const updateData: DeepPartial<DailyToDoListEntity> = {
        status: updateDailyToDoListDto.status,
                completionDate: updateDailyToDoListDto.completionDate,
                task: { id: updateDailyToDoListDto.taskId },
        user: { id: userId },
      };

      this.dailyToDoListRepository.merge(dailyToDoList, updateData);
      return this.dailyToDoListRepository.save(dailyToDoList);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Delete a dailyToDoList for a specific user by its ID.
   *
   * @param {number} userId - The ID of the user who owns the dailyToDoList.
   * @param {number} id - The id of the dailyToDoList to delete.
   * @returns {Promise<void>}
   * @throws {NotFoundException} - If the dailyToDoList with the given ID is not found.
   */
  async deleteDailyToDoList(userId: number,id: number): Promise<void> {
    try {
      const dailyToDoList = await this.getDailyToDoListById(userId,id);
      await this.dailyToDoListRepository.remove(dailyToDoList);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Find dailyToDoList data for dropdowns with optional filtering.
   *
   *@param {number} userId - The ID of the user whose data to retrieve.
   * @param {string[]} fields - Comma-separated list of fields to retrieve.
   * @param {string} keyword - Optional keyword for filtering data.
   * @returns {Promise<DailyToDoListEntity[]>} - The list of dailyToDoList data for dropdowns.
   */
  async findAllDropdownData(userId: number,fields: string[], keyword?: string): Promise<DailyToDoListEntity[]> {
    try {
      return this.dailyToDoListRepository.findAllDropdown(userId, fields, keyword);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

   /**
   * Retrieve a paginated list of dailyToDoLists by task for a specific user.
   *
   * @param {number} userId - The ID of the user whose dailyToDoLists to retrieve.
   * @param {number} taskId - The taskId of the dailyToDoList to retrieve.
   * @param {number} skip - The number of items to skip for pagination.
   * @param {number} take - The number of items to take per page for pagination.
   * @param {string} search - Optional search term for filter.
   * @returns {Promise<{ result: DailyToDoListEntity[]; total: number }>} - The list of dailyToDoLists and the total count.
   */
  async getDailyToDoListsByTaskId(
    userId: number,
    taskId: number,
    skip: number,
    take: number,
    search?: string,
  ): Promise<{ result: DailyToDoListEntity[]; total: number }> {
    try {
      return await this.dailyToDoListRepository.getDailyToDoListsByTaskId(userId, taskId, skip, take, search);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

}
