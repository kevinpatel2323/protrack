import { Injectable, NotFoundException, BadRequestException, } from '@nestjs/common';
import { DeepPartial, Like } from 'typeorm';
import { convertArrayToObject } from 'src/shared/utils/common';
import { TaskRepository } from './task.repository';
import { TaskEntity } from './task.entity';
import { CreateTaskDto } from './create-task.dto';
import { UpdateTaskDto } from './update-task.dto';

@Injectable()
export class TaskService {
  constructor(
    private taskRepository: TaskRepository,
  ) {}

  /**
   * Retrieve a paginated list of tasks for a specific user.
   *
   * @param {number} userId - The ID of the user whose tasks to retrieve.
   * @param {number} skip - The number of items to skip for pagination.
   * @param {number} take - The number of items to take per page for pagination.
   * @param {string} search - Optional search term for filter.
   * @returns {Promise<{ result: TaskEntity[]; total: number }>} - The list of tasks and the total count.
   */
  async getAllTasks(
    userId: number,
    skip: number,
    take: number,
    search?: string,
  ): Promise<{ result: TaskEntity[]; total: number }> {
    try {
      return await this.taskRepository.getAll(userId, skip, take, search);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Get a task by ID for a specific user.
   *
   * @param {number} userId - The ID of the user who owns the task.
   * @param {number} id - The id of the task to retrieve.
   * @returns {Promise<TaskEntity>} - The task object.
   * @throws {NotFoundException} - If the task with the given ID is not found.
   */
  async getTaskById(userId: number,id: number): Promise<TaskEntity> {
    try {
      const task = await this.taskRepository.findById(userId,id);
      if (!task) {
        throw new NotFoundException('TaskEntity not found');
      }
      return task;
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Create a new task for a specific user.
   *
   * @param {number} userId - The ID of the user creating the task.
   * @param {CreateTaskDto} createTaskDto - The DTO for creating a task.
   * @returns {Promise<TaskEntity>} - The newly created task object.
   */
  async createTask(userId: number,createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    try {

      const task = this.taskRepository.create({
        taskName: createTaskDto.taskName,
                points: createTaskDto.points,
                dateCreated: createTaskDto.dateCreated,
                dateUpdated: createTaskDto.dateUpdated,
                user: { id: userId },
      });
      return this.taskRepository.save(task);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Update an existing task for a specific user.
   *
   * @param {number} userId - The ID of the user who owns the task.
   * @param {number} id - The id of the task to update.
   * @param {UpdateTaskDto} updateTaskDto - The DTO for updating a task.
   * @returns {Promise<TaskEntity>} - The updated task object.
   * @throws {NotFoundException} - If the task with the given ID is not found.
   */
  async updateTask(userId: number,id: number, updateTaskDto: UpdateTaskDto): Promise<TaskEntity> {
    try {
      const task = await this.getTaskById(userId, id);

      const updateData: DeepPartial<TaskEntity> = {
        taskName: updateTaskDto.taskName,
                points: updateTaskDto.points,
                dateCreated: updateTaskDto.dateCreated,
                dateUpdated: updateTaskDto.dateUpdated,
                user: { id: userId },
      };

      this.taskRepository.merge(task, updateData);
      return this.taskRepository.save(task);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Delete a task for a specific user by its ID.
   *
   * @param {number} userId - The ID of the user who owns the task.
   * @param {number} id - The id of the task to delete.
   * @returns {Promise<void>}
   * @throws {NotFoundException} - If the task with the given ID is not found.
   */
  async deleteTask(userId: number,id: number): Promise<void> {
    try {
      const task = await this.getTaskById(userId,id);
      await this.taskRepository.remove(task);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Find task data for dropdowns with optional filtering.
   *
   *@param {number} userId - The ID of the user whose data to retrieve.
   * @param {string[]} fields - Comma-separated list of fields to retrieve.
   * @param {string} keyword - Optional keyword for filtering data.
   * @returns {Promise<TaskEntity[]>} - The list of task data for dropdowns.
   */
  async findAllDropdownData(userId: number,fields: string[], keyword?: string): Promise<TaskEntity[]> {
    try {
      return this.taskRepository.findAllDropdown(userId, fields, keyword);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

}
