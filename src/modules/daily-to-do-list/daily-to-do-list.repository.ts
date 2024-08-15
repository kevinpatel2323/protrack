import { Brackets, DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DailyToDoListEntity } from './daily-to-do-list.entity';

@Injectable()
export class DailyToDoListRepository extends Repository<DailyToDoListEntity> {
  
  constructor(private dataSource: DataSource) {
    super(DailyToDoListEntity, dataSource.createEntityManager());
  }

  /**
   * Find a dailyToDoList by its ID for a specific user.
   *
   * @param {number} userId - The ID of the user whose dailyToDoList to retrieve.
   * @param {number} id - The id of the dailyToDoList to retrieve.
   * @returns {Promise<DailyToDoListEntity>} - The dailyToDoList object.
   */
  async findById(userId: number,id: number): Promise<DailyToDoListEntity> {
    return await this.findOne({
      where: { id, user: { id: userId }  },
      relations: [
        'task',
      ]
    });
  }

  /**
   * Retrieve dailyToDoLists based on search criteria, pagination, and user ID
   *
   * @param {number} userId - The ID of the user whose dailyToDoList to retrieve.
   * @param {number} skip - The number of records to skip for pagination.
   * @param {number} take - The number of records to retrieve for pagination.
   * @param {string} searchTerm - Optional search term for filtering dailyToDoLists.
   * @returns {Promise<{ result: DailyToDoListEntity[]; total: number }>} - The dailyToDoLists and total count.
   */
  async getAll(
    userId: number,
    skip: number,
    take: number,
    searchTerm?: string,
  ): Promise<{ result: DailyToDoListEntity[]; total: number }> {
    // Create a query builder to construct the SQL query for retrieving dailyToDoLists
    const queryBuilder = this.getQueryBuilder(
      userId,
      [
        'status',
                'completionDate',
              ],
      searchTerm, // Optional search term for filtering dailyToDoLists
    );

    queryBuilder
    .innerJoin('dailyToDoList.task', 'task')
    .addSelect(['task.id', 'task.taskName']);

    if(searchTerm) {
      queryBuilder.orWhere(`task.taskName LIKE :keyword`, {
        keyword: `${searchTerm}%`,
      });
    }
    

    // Order dailyToDoLists by createdAt timestamp in descending order
    queryBuilder.orderBy('dailyToDoList.createdAt', 'DESC').addSelect('dailyToDoList.createdAt');

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
   * Retrieve dailyToDoLists based on search criteria and user ID for dropdown selection.
   *
   * @param {number} userId - The ID of the user whose dailyToDoList to retrieve.
   * @param {string[]} fields - The fields to select in the query.
   * @param {string} keyword - Optional keyword for filtering dailyToDoLists.
   * @returns {Promise<DailyToDoListEntity[]>} - The dailyToDoLists.
   */
  async findAllDropdown(
    userId: number,
    fields: string[],
    keyword?: string,
  ): Promise<DailyToDoListEntity[]> {
    // Create a query builder to construct the SQL query for retrieving dailyToDoLists
    const queryBuilder = this.getQueryBuilder(userId, fields, keyword);

    const selectedColumns = fields.map((field) => `dailyToDoList.${field}`);

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
   * @param {string} keyword - Optional keyword for filtering dailyToDoLists.
   * @returns {SelectQueryBuilder<DailyToDoListEntity>} - The constructed query builder.
   */
  getQueryBuilder(
    userId: number,
    fields: string[],
    keyword?: string,
  ): SelectQueryBuilder<DailyToDoListEntity> {
    // Create a query builder for the 'dailyToDoList' entity
    const queryBuilder = this.createQueryBuilder('dailyToDoList');

    // If a keyword is provided, construct a dynamic query with 'LIKE' and 'OR' conditions for each field
    if (keyword) {
      fields.forEach((field, index) => {
        if (index === 0) {
          queryBuilder.where(`dailyToDoList.${field} LIKE :keyword`, {
            keyword: `${keyword}%`,
          });
        } else {
          queryBuilder.orWhere(`dailyToDoList.${field} LIKE :keyword`, {
            keyword: `${keyword}%`,
          });
        }
      });
    }

    // Add a condition to filter dailyToDoLists based on user ID
    queryBuilder.andWhere('dailyToDoList.user.id = :userId', { userId });

    // Return the constructed query builder
    return queryBuilder;
  }

  /**
   * Retrieve a paginated list of dailyToDoLists by task for a specific user.
   *
   * @param {number} userId - The ID of the user whose dailyToDoLists to retrieve.
   * @param {number} taskId - The taskId of the dailyToDoList to retrieve.
   * @param {number} skip - The number of items to skip for pagination.
   * @param {number} take - The number of items to take per page for pagination.
   * @param {string} searchTerm - Optional search term for filter.
   * @returns {Promise<{ result: DailyToDoListEntity[]; total: number }>} - The list of dailyToDoLists and the total count.
   */
  async getDailyToDoListsByTaskId(
    userId: number,
    taskId: number,
    skip: number,
    take: number,
    searchTerm?: string,
  ): Promise<{ result: DailyToDoListEntity[]; total: number }> {

    const fields = [
      'status',
            'completionDate',
          ];

    // Create a query builder for the 'dailyToDoList' entity
    const queryBuilder = this.createQueryBuilder('dailyToDoList');

    // Add a condition to filter dailyToDoLists based on user ID
    queryBuilder.andWhere('dailyToDoList.user.id = :userId', { userId });

    // Add a condition to filter comments based on taskId
    queryBuilder.andWhere('dailyToDoList.task.id = :taskId', { taskId });


    // If a keyword is provided, construct a dynamic query with 'LIKE' and 'OR' conditions for each field
    if (searchTerm) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          fields.forEach((field) => {
            qb.orWhere(`dailyToDoList.${field} LIKE :keyword`, {
              keyword: `${searchTerm}%`,
            });
          });
      }))
    }

    // Order dailyToDoLists by createdAt timestamp in descending order
    queryBuilder.orderBy('dailyToDoList.createdAt', 'DESC').addSelect('dailyToDoList.createdAt');

    // Set the select, skip, and take properties for pagination
    queryBuilder.select().take(take).skip(skip);

    // Execute the query and return the result along with the total count
    const [result, total] = await queryBuilder.getManyAndCount();

    return {
      result,
      total,
    };
  }
  
}
