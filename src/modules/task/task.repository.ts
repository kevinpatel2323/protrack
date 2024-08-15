import { Brackets, DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { TaskEntity } from './task.entity';

@Injectable()
export class TaskRepository extends Repository<TaskEntity> {
  
  constructor(private dataSource: DataSource) {
    super(TaskEntity, dataSource.createEntityManager());
  }

  /**
   * Find a task by its ID for a specific user.
   *
   * @param {number} userId - The ID of the user whose task to retrieve.
   * @param {number} id - The id of the task to retrieve.
   * @returns {Promise<TaskEntity>} - The task object.
   */
  async findById(userId: number,id: number): Promise<TaskEntity> {
    return await this.findOne({
      where: { id, user: { id: userId }  },
      relations: [
      ]
    });
  }

  /**
   * Retrieve tasks based on search criteria, pagination, and user ID
   *
   * @param {number} userId - The ID of the user whose task to retrieve.
   * @param {number} skip - The number of records to skip for pagination.
   * @param {number} take - The number of records to retrieve for pagination.
   * @param {string} searchTerm - Optional search term for filtering tasks.
   * @returns {Promise<{ result: TaskEntity[]; total: number }>} - The tasks and total count.
   */
  async getAll(
    userId: number,
    skip: number,
    take: number,
    searchTerm?: string,
  ): Promise<{ result: TaskEntity[]; total: number }> {
    // Create a query builder to construct the SQL query for retrieving tasks
    const queryBuilder = this.getQueryBuilder(
      userId,
      [
        'taskName',
                'points',
                'dateCreated',
                'dateUpdated',
              ],
      searchTerm, // Optional search term for filtering tasks
    );


    // Order tasks by createdAt timestamp in descending order
    queryBuilder.orderBy('task.createdAt', 'DESC').addSelect('task.createdAt');

    // Set the select, skip, and take properties for pagination
    queryBuilder.select().take(take).skip(skip);

    // Execute the query and return the result along with the total count
    const [result, total] = await queryBuilder.getManyAndCount();

    return {
      result,
      total,
    };
  }

  /**
   * Retrieve tasks based on search criteria and user ID for dropdown selection.
   *
   * @param {number} userId - The ID of the user whose task to retrieve.
   * @param {string[]} fields - The fields to select in the query.
   * @param {string} keyword - Optional keyword for filtering tasks.
   * @returns {Promise<TaskEntity[]>} - The tasks.
   */
  async findAllDropdown(
    userId: number,
    fields: string[],
    keyword?: string,
  ): Promise<TaskEntity[]> {
    // Create a query builder to construct the SQL query for retrieving tasks
    const queryBuilder = this.getQueryBuilder(userId, fields, keyword);

    const selectedColumns = fields.map((field) => `task.${field}`);

    // Set the select and take properties
    queryBuilder.select(selectedColumns).take(5);

    // Execute the query and return the result
    return await queryBuilder.getMany();
  }

  /**
   * Helper function to create a query builder based on fields, optional keyword  and user Id
   *
   * @param {number} userId - The ID of the user for the query.
   * @param {string[]} fields - The fields to include in the search.
   * @param {string} keyword - Optional keyword for filtering tasks.
   * @returns {SelectQueryBuilder<TaskEntity>} - The constructed query builder.
   */
  getQueryBuilder(
    userId: number,
    fields: string[],
    keyword?: string,
  ): SelectQueryBuilder<TaskEntity> {
    // Create a query builder for the 'task' entity
    const queryBuilder = this.createQueryBuilder('task');

    // If a keyword is provided, construct a dynamic query with 'LIKE' and 'OR' conditions for each field
    if (keyword) {
      fields.forEach((field, index) => {
        if (index === 0) {
          queryBuilder.where(`task.${field} LIKE :keyword`, {
            keyword: `${keyword}%`,
          });
        } else {
          queryBuilder.orWhere(`task.${field} LIKE :keyword`, {
            keyword: `${keyword}%`,
          });
        }
      });
    }

    // Add a condition to filter tasks based on user ID
    queryBuilder.andWhere('task.user.id = :userId', { userId });

    // Return the constructed query builder
    return queryBuilder;
  }

}
