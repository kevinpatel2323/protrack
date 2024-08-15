import { Controller, Get, Post, Put, Delete, Param, Body, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { ProgressTrackerService } from './progress-tracker.service';
import { ProgressTrackerEntity } from './progress-tracker.entity';
import { CreateProgressTrackerDto } from './create-progress-tracker.dto';
import { UpdateProgressTrackerDto } from './update-progress-tracker.dto';

@ApiBearerAuth('BearerAuth')
@ApiTags('ProgressTrackers')
@Controller('progressTrackers')
export class ProgressTrackerController {
  constructor(
    private progressTrackerService: ProgressTrackerService,
  ) {}


  /**
   * Get all progressTrackers with pagination support.
   *
   * @param {Request} req - The Express request object.
   * @param {number} page - The page number for pagination (optional, default: 1).
   * @param {number} limit - The number of items per page (optional, default: 10).
   * @param {string} search - Optional search term for filtering progressTrackers.
   * @returns {Promise<{ result: ProgressTrackerEntity[]; total: number }>} - The list of progressTrackers and the total count.
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
  async getAllProgressTrackers(
    @Req() req,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ): Promise<{ result: ProgressTrackerEntity[]; total: number }> {
    // Convert page and limit to numbers and ensure they are positive values
    const pageNumber = Math.max(1, Number(page));
    const itemsPerPage = Math.max(1, Number(limit));

    // Calculate the number of items to skip based on the current page and items per page
    const skip = (pageNumber - 1) * itemsPerPage;

    return this.progressTrackerService.getAllProgressTrackers(
      req.user.userId,
      skip,
      itemsPerPage,
      search
    );
  }

  /**
   * Get progressTracker data for dropdowns.
   *
   * @param {Request} req - The Express request object.
   * @param {string} fields - Comma-separated list of fields to retrieve (optional).
   * @param {string} keyword - The keyword for filtering data (optional).
   * @returns {Promise<ProgressTrackerEntity[]>} - The list of progressTracker data for dropdowns.
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
  async getProgressTrackerDropdownData(
    @Req() req,
    @Query('fields') fields?: string,
    @Query('keyword') keyword?: string,
  ): Promise<ProgressTrackerEntity[]> {
    const fieldArray = fields ? fields.split(',') : [
      'id',
    ]
    return this.progressTrackerService.findAllDropdownData(
      req.user.userId,
      fieldArray, 
      keyword
    );
  }

  /**
   * Get a progressTracker by ID.
   *
   * @param {Request} req - The Express request object.
   * @param {number} id - The id of the progressTracker to retrieve.
   * @returns {Promise<ProgressTrackerEntity>} - The progressTracker object.
   */
  @Get(':id')
  async getProgressTrackerById(
    @Req() req,
    @Param('id') id: number
  ): Promise<ProgressTrackerEntity> {
    return this.progressTrackerService.getProgressTrackerById(
      req.user.userId,
      id
    );
  }

  /**
   * Create a new progressTracker.
   *
   * @param {Request} req - The Express request object.
   * @param {CreateProgressTrackerDto} createProgressTrackerDto - The DTO for creating a progressTracker.
   * @returns {Promise<ProgressTrackerEntity>} - The newly created progressTracker object.
   */
  @Post()
  async createProgressTracker(
    @Req() req,
    @Body() createProgressTrackerDto: CreateProgressTrackerDto
  ): Promise<ProgressTrackerEntity> {
    return this.progressTrackerService.createProgressTracker(
      req.user.userId,
      createProgressTrackerDto
    );
  }

  /**
   * Update an existing progressTracker.
   *
   * @param {Request} req - The Express request object.
   * @param {number} id - The id of the progressTracker to update.
   * @param {UpdateProgressTrackerDto} updateProgressTrackerDto - The DTO for updating a progressTracker.
   * @returns {Promise<ProgressTrackerEntity>} - The updated progressTracker object.
   */
  @Put(':id')
  async updateProgressTracker(
    @Req() req,
    @Param('id') id: number,
    @Body() updateProgressTrackerDto: UpdateProgressTrackerDto,
  ): Promise<ProgressTrackerEntity> {
    return this.progressTrackerService.updateProgressTracker(
      req.user.userId,
      id, 
      updateProgressTrackerDto
    );
  }


  /**
   * Delete a progressTracker by ID.
   *
   * @param {Request} req - The Express request object.
   * @param {number} id - The id of the progressTracker to delete.
   * @returns {Promise<void>}
   */
  @Delete(':id')
  async deleteProgressTracker(
    @Req() req,
    @Param('id') id: number
  ): Promise<void> {
    return this.progressTrackerService.deleteProgressTracker(
      req.user.userId,
      id
    );
  }
}
