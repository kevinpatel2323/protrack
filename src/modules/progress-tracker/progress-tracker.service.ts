import { Injectable, NotFoundException, BadRequestException, } from '@nestjs/common';
import { DeepPartial, Like } from 'typeorm';
import { convertArrayToObject } from 'src/shared/utils/common';
import { ProgressTrackerRepository } from './progress-tracker.repository';
import { ProgressTrackerEntity } from './progress-tracker.entity';
import { CreateProgressTrackerDto } from './create-progress-tracker.dto';
import { UpdateProgressTrackerDto } from './update-progress-tracker.dto';

@Injectable()
export class ProgressTrackerService {
  constructor(
    private progressTrackerRepository: ProgressTrackerRepository,
  ) {}

  /**
   * Retrieve a paginated list of progressTrackers for a specific user.
   *
   * @param {number} userId - The ID of the user whose progressTrackers to retrieve.
   * @param {number} skip - The number of items to skip for pagination.
   * @param {number} take - The number of items to take per page for pagination.
   * @param {string} search - Optional search term for filter.
   * @returns {Promise<{ result: ProgressTrackerEntity[]; total: number }>} - The list of progressTrackers and the total count.
   */
  async getAllProgressTrackers(
    userId: number,
    skip: number,
    take: number,
    search?: string,
  ): Promise<{ result: ProgressTrackerEntity[]; total: number }> {
    try {
      return await this.progressTrackerRepository.getAll(userId, skip, take, search);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Get a progressTracker by ID for a specific user.
   *
   * @param {number} userId - The ID of the user who owns the progressTracker.
   * @param {number} id - The id of the progressTracker to retrieve.
   * @returns {Promise<ProgressTrackerEntity>} - The progressTracker object.
   * @throws {NotFoundException} - If the progressTracker with the given ID is not found.
   */
  async getProgressTrackerById(userId: number,id: number): Promise<ProgressTrackerEntity> {
    try {
      const progressTracker = await this.progressTrackerRepository.findById(userId,id);
      if (!progressTracker) {
        throw new NotFoundException('ProgressTrackerEntity not found');
      }
      return progressTracker;
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Create a new progressTracker for a specific user.
   *
   * @param {number} userId - The ID of the user creating the progressTracker.
   * @param {CreateProgressTrackerDto} createProgressTrackerDto - The DTO for creating a progressTracker.
   * @returns {Promise<ProgressTrackerEntity>} - The newly created progressTracker object.
   */
  async createProgressTracker(userId: number,createProgressTrackerDto: CreateProgressTrackerDto): Promise<ProgressTrackerEntity> {
    try {

      const progressTracker = this.progressTrackerRepository.create({
        totalPoints: createProgressTrackerDto.totalPoints,
                completionPercentage: createProgressTrackerDto.completionPercentage,
                user: { id: userId },
      });
      return this.progressTrackerRepository.save(progressTracker);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Update an existing progressTracker for a specific user.
   *
   * @param {number} userId - The ID of the user who owns the progressTracker.
   * @param {number} id - The id of the progressTracker to update.
   * @param {UpdateProgressTrackerDto} updateProgressTrackerDto - The DTO for updating a progressTracker.
   * @returns {Promise<ProgressTrackerEntity>} - The updated progressTracker object.
   * @throws {NotFoundException} - If the progressTracker with the given ID is not found.
   */
  async updateProgressTracker(userId: number,id: number, updateProgressTrackerDto: UpdateProgressTrackerDto): Promise<ProgressTrackerEntity> {
    try {
      const progressTracker = await this.getProgressTrackerById(userId, id);

      const updateData: DeepPartial<ProgressTrackerEntity> = {
        totalPoints: updateProgressTrackerDto.totalPoints,
                completionPercentage: updateProgressTrackerDto.completionPercentage,
                user: { id: userId },
      };

      this.progressTrackerRepository.merge(progressTracker, updateData);
      return this.progressTrackerRepository.save(progressTracker);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Delete a progressTracker for a specific user by its ID.
   *
   * @param {number} userId - The ID of the user who owns the progressTracker.
   * @param {number} id - The id of the progressTracker to delete.
   * @returns {Promise<void>}
   * @throws {NotFoundException} - If the progressTracker with the given ID is not found.
   */
  async deleteProgressTracker(userId: number,id: number): Promise<void> {
    try {
      const progressTracker = await this.getProgressTrackerById(userId,id);
      await this.progressTrackerRepository.remove(progressTracker);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Find progressTracker data for dropdowns with optional filtering.
   *
   *@param {number} userId - The ID of the user whose data to retrieve.
   * @param {string[]} fields - Comma-separated list of fields to retrieve.
   * @param {string} keyword - Optional keyword for filtering data.
   * @returns {Promise<ProgressTrackerEntity[]>} - The list of progressTracker data for dropdowns.
   */
  async findAllDropdownData(userId: number,fields: string[], keyword?: string): Promise<ProgressTrackerEntity[]> {
    try {
      return this.progressTrackerRepository.findAllDropdown(userId, fields, keyword);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

}
