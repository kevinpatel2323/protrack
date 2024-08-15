import { Controller, Get, Post, Put, Delete, Param, Body, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { PointsTableService } from './points-table.service';
import { PointsTableEntity } from './points-table.entity';
import { CreatePointsTableDto } from './create-points-table.dto';
import { UpdatePointsTableDto } from './update-points-table.dto';

@ApiBearerAuth('BearerAuth')
@ApiTags('PointsTables')
@Controller('pointsTables')
export class PointsTableController {
  constructor(
    private pointsTableService: PointsTableService,
  ) {}


  /**
   * Get all pointsTables with pagination support.
   *
   * @param {Request} req - The Express request object.
   * @param {number} page - The page number for pagination (optional, default: 1).
   * @param {number} limit - The number of items per page (optional, default: 10).
   * @param {string} search - Optional search term for filtering pointsTables.
   * @returns {Promise<{ result: PointsTableEntity[]; total: number }>} - The list of pointsTables and the total count.
   */
  @Get()
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Optional page for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Optional limit for pagination',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Optional search for searching',
  })
  async getAllPointsTables(
    @Req() req,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ): Promise<{ result: PointsTableEntity[]; total: number }> {
    // Convert page and limit to numbers and ensure they are positive values
    const pageNumber = Math.max(1, Number(page));
    const itemsPerPage = Math.max(1, Number(limit));

    // Calculate the number of items to skip based on the current page and items per page
    const skip = (pageNumber - 1) * itemsPerPage;

    return this.pointsTableService.getAllPointsTables(
      req.user.userId,
      skip,
      itemsPerPage,
      search
    );
  }

  /**
   * Get pointsTable data for dropdowns.
   *
   * @param {Request} req - The Express request object.
   * @param {string} fields - Comma-separated list of fields to retrieve (optional).
   * @param {string} keyword - The keyword for filtering data (optional).
   * @returns {Promise<PointsTableEntity[]>} - The list of pointsTable data for dropdowns.
   */
  @Get('dropdown')
  @ApiQuery({
    name: 'fields',
    required: false,
    type: String,
    description: 'Optional fields for filtering',
  })
  @ApiQuery({
    name: 'keyword',
    required: false,
    type: String,
    description: 'Optional keyword for filtering',
  })
  async getPointsTableDropdownData(
    @Req() req,
    @Query('fields') fields?: string,
    @Query('keyword') keyword?: string,
  ): Promise<PointsTableEntity[]> {
    const fieldArray = fields ? fields.split(',') : [
      'id',
    ]
    return this.pointsTableService.findAllDropdownData(
      req.user.userId,
      fieldArray, 
      keyword
    );
  }

  /**
   * Get a pointsTable by ID.
   *
   * @param {Request} req - The Express request object.
   * @param {number} id - The id of the pointsTable to retrieve.
   * @returns {Promise<PointsTableEntity>} - The pointsTable object.
   */
  @Get(':id')
  async getPointsTableById(
    @Req() req,
    @Param('id') id: number
  ): Promise<PointsTableEntity> {
    return this.pointsTableService.getPointsTableById(
      req.user.userId,
      id
    );
  }

  /**
   * Create a new pointsTable.
   *
   * @param {Request} req - The Express request object.
   * @param {CreatePointsTableDto} createPointsTableDto - The DTO for creating a pointsTable.
   * @returns {Promise<PointsTableEntity>} - The newly created pointsTable object.
   */
  @Post()
  async createPointsTable(
    @Req() req,
    @Body() createPointsTableDto: CreatePointsTableDto
  ): Promise<PointsTableEntity> {
    return this.pointsTableService.createPointsTable(
      req.user.userId,
      createPointsTableDto
    );
  }

  /**
   * Update an existing pointsTable.
   *
   * @param {Request} req - The Express request object.
   * @param {number} id - The id of the pointsTable to update.
   * @param {UpdatePointsTableDto} updatePointsTableDto - The DTO for updating a pointsTable.
   * @returns {Promise<PointsTableEntity>} - The updated pointsTable object.
   */
  @Put(':id')
  async updatePointsTable(
    @Req() req,
    @Param('id') id: number,
    @Body() updatePointsTableDto: UpdatePointsTableDto,
  ): Promise<PointsTableEntity> {
    return this.pointsTableService.updatePointsTable(
      req.user.userId,
      id, 
      updatePointsTableDto
    );
  }


  /**
   * Delete a pointsTable by ID.
   *
   * @param {Request} req - The Express request object.
   * @param {number} id - The id of the pointsTable to delete.
   * @returns {Promise<void>}
   */
  @Delete(':id')
  async deletePointsTable(
    @Req() req,
    @Param('id') id: number
  ): Promise<void> {
    return this.pointsTableService.deletePointsTable(
      req.user.userId,
      id
    );
  }
}
