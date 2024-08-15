import { Controller, Get, Post, Put, Delete, Param, Body, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { DailyToDoListService } from './daily-to-do-list.service';
import { DailyToDoListEntity } from './daily-to-do-list.entity';
import { CreateDailyToDoListDto } from './create-daily-to-do-list.dto';
import { UpdateDailyToDoListDto } from './update-daily-to-do-list.dto';

@ApiBearerAuth('BearerAuth')
@ApiTags('DailyToDoLists')
@Controller('dailyToDoLists')
export class DailyToDoListController {
  constructor(
    private dailyToDoListService: DailyToDoListService,
  ) {}


  /**
   * Get all dailyToDoLists with pagination support.
   *
   * @param {Request} req - The Express request object.
   * @param {number} page - The page number for pagination (optional, default: 1).
   * @param {number} limit - The number of items per page (optional, default: 10).
   * @param {string} search - Optional search term for filtering dailyToDoLists.
   * @returns {Promise<{ result: DailyToDoListEntity[]; total: number }>} - The list of dailyToDoLists and the total count.
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
  async getAllDailyToDoLists(
    @Req() req,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ): Promise<{ result: DailyToDoListEntity[]; total: number }> {
    // Convert page and limit to numbers and ensure they are positive values
    const pageNumber = Math.max(1, Number(page));
    const itemsPerPage = Math.max(1, Number(limit));

    // Calculate the number of items to skip based on the current page and items per page
    const skip = (pageNumber - 1) * itemsPerPage;

    return this.dailyToDoListService.getAllDailyToDoLists(
      req.user.userId,
      skip,
      itemsPerPage,
      search
    );
  }

  /**
   * Get dailyToDoList data for dropdowns.
   *
   * @param {Request} req - The Express request object.
   * @param {string} fields - Comma-separated list of fields to retrieve (optional).
   * @param {string} keyword - The keyword for filtering data (optional).
   * @returns {Promise<DailyToDoListEntity[]>} - The list of dailyToDoList data for dropdowns.
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
  async getDailyToDoListDropdownData(
    @Req() req,
    @Query('fields') fields?: string,
    @Query('keyword') keyword?: string,
  ): Promise<DailyToDoListEntity[]> {
    const fieldArray = fields ? fields.split(',') : [
      'id',
    ]
    return this.dailyToDoListService.findAllDropdownData(
      req.user.userId,
      fieldArray, 
      keyword
    );
  }

  /**
   * Get a dailyToDoList by ID.
   *
   * @param {Request} req - The Express request object.
   * @param {number} id - The id of the dailyToDoList to retrieve.
   * @returns {Promise<DailyToDoListEntity>} - The dailyToDoList object.
   */
  @Get(':id')
  async getDailyToDoListById(
    @Req() req,
    @Param('id') id: number
  ): Promise<DailyToDoListEntity> {
    return this.dailyToDoListService.getDailyToDoListById(
      req.user.userId,
      id
    );
  }

  /**
   * Create a new dailyToDoList.
   *
   * @param {Request} req - The Express request object.
   * @param {CreateDailyToDoListDto} createDailyToDoListDto - The DTO for creating a dailyToDoList.
   * @returns {Promise<DailyToDoListEntity>} - The newly created dailyToDoList object.
   */
  @Post()
  async createDailyToDoList(
    @Req() req,
    @Body() createDailyToDoListDto: CreateDailyToDoListDto
  ): Promise<DailyToDoListEntity> {
    return this.dailyToDoListService.createDailyToDoList(
      req.user.userId,
      createDailyToDoListDto
    );
  }

  /**
   * Update an existing dailyToDoList.
   *
   * @param {Request} req - The Express request object.
   * @param {number} id - The id of the dailyToDoList to update.
   * @param {UpdateDailyToDoListDto} updateDailyToDoListDto - The DTO for updating a dailyToDoList.
   * @returns {Promise<DailyToDoListEntity>} - The updated dailyToDoList object.
   */
  @Put(':id')
  async updateDailyToDoList(
    @Req() req,
    @Param('id') id: number,
    @Body() updateDailyToDoListDto: UpdateDailyToDoListDto,
  ): Promise<DailyToDoListEntity> {
    return this.dailyToDoListService.updateDailyToDoList(
      req.user.userId,
      id, 
      updateDailyToDoListDto
    );
  }


  /**
   * Delete a dailyToDoList by ID.
   *
   * @param {Request} req - The Express request object.
   * @param {number} id - The id of the dailyToDoList to delete.
   * @returns {Promise<void>}
   */
  @Delete(':id')
  async deleteDailyToDoList(
    @Req() req,
    @Param('id') id: number
  ): Promise<void> {
    return this.dailyToDoListService.deleteDailyToDoList(
      req.user.userId,
      id
    );
  }
}
