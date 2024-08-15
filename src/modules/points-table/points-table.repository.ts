import { Brackets, DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { PointsTableEntity } from './points-table.entity';

@Injectable()
export class PointsTableRepository extends Repository<PointsTableEntity> {
  
  constructor(private dataSource: DataSource) {
    super(PointsTableEntity, dataSource.createEntityManager());
  }

  /**
   * Find a pointsTable by its ID for a specific user.
   *
   * @param {number} userId - The ID of the user whose pointsTable to retrieve.
   * @param {number} id - The id of the pointsTable to retrieve.
   * @returns {Promise<PointsTableEntity>} - The pointsTable object.
   */
  async findById(userId: number,id: number): Promise<PointsTableEntity> {
    return await this.findOne({
      where: { id, user: { id: userId }  },
      relations: [
        'task',
      ]
    });
  }

  /**
   * Retrieve pointsTables based on search criteria, pagination, and user ID
   *
   * @param {number} userId - The ID of the user whose pointsTable to retrieve.
   * @param {number} skip - The number of records to skip for pagination.
   * @param {number} take - The number of records to retrieve for pagination.
   * @param {string} searchTerm - Optional search term for filtering pointsTables.
   * @returns {Promise<{ result: PointsTableEntity[]; total: number }>} - The pointsTables and total count.
   */
  async getAll(
    userId: number,
    skip: number,
    take: number,
    searchTerm?: string,
  ): Promise<{ result: PointsTableEntity[]; total: number }> {
    // Create a query builder to construct the SQL query for retrieving pointsTables
    const queryBuilder = this.getQueryBuilder(
      userId,
      [
      ],
      searchTerm, // Optional search term for filtering pointsTables
    );

    queryBuilder
    .innerJoin('pointsTable.task', 'task')
    .addSelect(['task.id', 'task.taskName']);

    if(searchTerm) {
      queryBuilder.orWhere(`task.taskName LIKE :keyword`, {
        keyword: `${searchTerm}%`,
      });
    }
    

    // Order pointsTables by createdAt timestamp in descending order
    queryBuilder.orderBy('pointsTable.createdAt', 'DESC').addSelect('pointsTable.createdAt');

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
   * Retrieve pointsTables based on search criteria and user ID for dropdown selection.
   *
   * @param {number} userId - The ID of the user whose pointsTable to retrieve.
   * @param {string[]} fields - The fields to select in the query.
   * @param {string} keyword - Optional keyword for filtering pointsTables.
   * @returns {Promise<PointsTableEntity[]>} - The pointsTables.
   */
  async findAllDropdown(
    userId: number,
    fields: string[],
    keyword?: string,
  ): Promise<PointsTableEntity[]> {
    // Create a query builder to construct the SQL query for retrieving pointsTables
    const queryBuilder = this.getQueryBuilder(userId, fields, keyword);

    const selectedColumns = fields.map((field) => `pointsTable.${field}`);

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
   * @param {string} keyword - Optional keyword for filtering pointsTables.
   * @returns {SelectQueryBuilder<PointsTableEntity>} - The constructed query builder.
   */
  getQueryBuilder(
    userId: number,
    fields: string[],
    keyword?: string,
  ): SelectQueryBuilder<PointsTableEntity> {
    // Create a query builder for the 'pointsTable' entity
    const queryBuilder = this.createQueryBuilder('pointsTable');

    // If a keyword is provided, construct a dynamic query with 'LIKE' and 'OR' conditions for each field
    if (keyword) {
      fields.forEach((field, index) => {
        if (index === 0) {
          queryBuilder.where(`pointsTable.${field} LIKE :keyword`, {
            keyword: `${keyword}%`,
          });
        } else {
          queryBuilder.orWhere(`pointsTable.${field} LIKE :keyword`, {
            keyword: `${keyword}%`,
          });
        }
      });
    }

    // Add a condition to filter pointsTables based on user ID
    queryBuilder.andWhere('pointsTable.user.id = :userId', { userId });

    // Return the constructed query builder
    return queryBuilder;
  }

  /**
   * Retrieve a paginated list of pointsTables by task for a specific user.
   *
   * @param {number} userId - The ID of the user whose pointsTables to retrieve.
   * @param {number} taskId - The taskId of the pointsTable to retrieve.
   * @param {number} skip - The number of items to skip for pagination.
   * @param {number} take - The number of items to take per page for pagination.
   * @param {string} searchTerm - Optional search term for filter.
   * @returns {Promise<{ result: PointsTableEntity[]; total: number }>} - The list of pointsTables and the total count.
   */
  async getPointsTablesByTaskId(
    userId: number,
    taskId: number,
    skip: number,
    take: number,
    searchTerm?: string,
  ): Promise<{ result: PointsTableEntity[]; total: number }> {

    const fields = [
    ];

    // Create a query builder for the 'pointsTable' entity
    const queryBuilder = this.createQueryBuilder('pointsTable');

    // Add a condition to filter pointsTables based on user ID
    queryBuilder.andWhere('pointsTable.user.id = :userId', { userId });

    // Add a condition to filter comments based on taskId
    queryBuilder.andWhere('pointsTable.task.id = :taskId', { taskId });


    // If a keyword is provided, construct a dynamic query with 'LIKE' and 'OR' conditions for each field
    if (searchTerm) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          fields.forEach((field) => {
            qb.orWhere(`pointsTable.${field} LIKE :keyword`, {
              keyword: `${searchTerm}%`,
            });
          });
      }))
    }

    // Order pointsTables by createdAt timestamp in descending order
    queryBuilder.orderBy('pointsTable.createdAt', 'DESC').addSelect('pointsTable.createdAt');

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
