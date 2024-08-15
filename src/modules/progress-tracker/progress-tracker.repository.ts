import { Brackets, DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ProgressTrackerEntity } from './progress-tracker.entity';

@Injectable()
export class ProgressTrackerRepository extends Repository<ProgressTrackerEntity> {
  
  constructor(private dataSource: DataSource) {
    super(ProgressTrackerEntity, dataSource.createEntityManager());
  }

  /**
   * Find a progressTracker by its ID for a specific user.
   *
   * @param {number} userId - The ID of the user whose progressTracker to retrieve.
   * @param {number} id - The id of the progressTracker to retrieve.
   * @returns {Promise<ProgressTrackerEntity>} - The progressTracker object.
   */
  async findById(userId: number,id: number): Promise<ProgressTrackerEntity> {
    return await this.findOne({
      where: { id, user: { id: userId }  },
      relations: [
      ]
    });
  }

  /**
   * Retrieve progressTrackers based on search criteria, pagination, and user ID
   *
   * @param {number} userId - The ID of the user whose progressTracker to retrieve.
   * @param {number} skip - The number of records to skip for pagination.
   * @param {number} take - The number of records to retrieve for pagination.
   * @param {string} searchTerm - Optional search term for filtering progressTrackers.
   * @returns {Promise<{ result: ProgressTrackerEntity[]; total: number }>} - The progressTrackers and total count.
   */
  async getAll(
    userId: number,
    skip: number,
    take: number,
    searchTerm?: string,
  ): Promise<{ result: ProgressTrackerEntity[]; total: number }> {
    // Create a query builder to construct the SQL query for retrieving progressTrackers
    const queryBuilder = this.getQueryBuilder(
      userId,
      [
        'totalPoints',
                'completionPercentage',
              ],
      searchTerm, // Optional search term for filtering progressTrackers
    );


    // Order progressTrackers by createdAt timestamp in descending order
    queryBuilder.orderBy('progressTracker.createdAt', 'DESC').addSelect('progressTracker.createdAt');

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
   * Retrieve progressTrackers based on search criteria and user ID for dropdown selection.
   *
   * @param {number} userId - The ID of the user whose progressTracker to retrieve.
   * @param {string[]} fields - The fields to select in the query.
   * @param {string} keyword - Optional keyword for filtering progressTrackers.
   * @returns {Promise<ProgressTrackerEntity[]>} - The progressTrackers.
   */
  async findAllDropdown(
    userId: number,
    fields: string[],
    keyword?: string,
  ): Promise<ProgressTrackerEntity[]> {
    // Create a query builder to construct the SQL query for retrieving progressTrackers
    const queryBuilder = this.getQueryBuilder(userId, fields, keyword);

    const selectedColumns = fields.map((field) => `progressTracker.${field}`);

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
   * @param {string} keyword - Optional keyword for filtering progressTrackers.
   * @returns {SelectQueryBuilder<ProgressTrackerEntity>} - The constructed query builder.
   */
  getQueryBuilder(
    userId: number,
    fields: string[],
    keyword?: string,
  ): SelectQueryBuilder<ProgressTrackerEntity> {
    // Create a query builder for the 'progressTracker' entity
    const queryBuilder = this.createQueryBuilder('progressTracker');

    // If a keyword is provided, construct a dynamic query with 'LIKE' and 'OR' conditions for each field
    if (keyword) {
      fields.forEach((field, index) => {
        if (index === 0) {
          queryBuilder.where(`progressTracker.${field} LIKE :keyword`, {
            keyword: `${keyword}%`,
          });
        } else {
          queryBuilder.orWhere(`progressTracker.${field} LIKE :keyword`, {
            keyword: `${keyword}%`,
          });
        }
      });
    }

    // Add a condition to filter progressTrackers based on user ID
    queryBuilder.andWhere('progressTracker.user.id = :userId', { userId });

    // Return the constructed query builder
    return queryBuilder;
  }

}
