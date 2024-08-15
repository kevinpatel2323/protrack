import { Controller, Get, Post, Put, Delete, Param, Body, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { TaskService } from './task.service';
import { DailyToDoListService } from 'src/modules/daily-to-do-list/daily-to-do-list.service';
import { PointsTableService } from 'src/modules/points-table/points-table.service';
import { TaskEntity } from './task.entity';
import { DailyToDoListEntity } from 'src/modules/daily-to-do-list/daily-to-do-list.entity';
import { PointsTableEntity } from 'src/modules/points-table/points-table.entity';
import { CreateTaskDto } from './create-task.dto';
import { UpdateTaskDto } from './update-task.dto';

@ApiBearerAuth('BearerAuth')
@ApiTags('Tasks')
@Controller('tasks')
export class TaskController {
  constructor(
    private taskService: TaskService,
    private dailyToDoListService: DailyToDoListService,
    private pointsTableService: PointsTableService,
  ) {}

  /**
   * Get all dailyToDoLists by tasks with pagination support.
   *
   * @param {Request} req - The Express request object.
   * @param {number} taskId - The taskId of the dailyToDoList to retrieve.
   * @param {number} page - The page number for pagination (optional, default: 1).
   * @param {number} limit - The number of items per page (optional, default: 10).
   * @param {string} search - Optional search term for filtering dailyToDoLists.
   * @returns {Promise<{ result: TaskEntity[]; total: number }>} - The list of tasks and the total count.
   */
  @Get(':taskId/dailyToDoList')
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
  async getDailyToDoListsByTaskId(
    @Req() req,
    @Param('taskId') taskId: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ): Promise<{ result: DailyToDoListEntity[]; total: number }> {
    // Convert page and limit to numbers and ensure they are positive values
    const pageNumber = Math.max(1, Number(page));
    const itemsPerPage = Math.max(1, Number(limit));

    // Calculate the number of items to skip based on the current page and items per page
    const skip = (pageNumber - 1) * itemsPerPage;

    return this.dailyToDoListService.getDailyToDoListsByTaskId(
      req.user.userId,
      taskId,
      skip,
      itemsPerPage,
      search
    );
  }
  
  /**
   * Get all pointsTables by tasks with pagination support.
   *
   * @param {Request} req - The Express request object.
   * @param {number} taskId - The taskId of the pointsTable to retrieve.
   * @param {number} page - The page number for pagination (optional, default: 1).
   * @param {number} limit - The number of items per page (optional, default: 10).
   * @param {string} search - Optional search term for filtering pointsTables.
   * @returns {Promise<{ result: TaskEntity[]; total: number }>} - The list of tasks and the total count.
   */
  @Get(':taskId/pointsTable')
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
  async getPointsTablesByTaskId(
    @Req() req,
    @Param('taskId') taskId: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ): Promise<{ result: PointsTableEntity[]; total: number }> {
    // Convert page and limit to numbers and ensure they are positive values
    const pageNumber = Math.max(1, Number(page));
    const itemsPerPage = Math.max(1, Number(limit));

    // Calculate the number of items to skip based on the current page and items per page
    const skip = (pageNumber - 1) * itemsPerPage;

    return this.pointsTableService.getPointsTablesByTaskId(
      req.user.userId,
      taskId,
      skip,
      itemsPerPage,
      search
    );
  }
  

  /**
   * Get all tasks with pagination support.
   *
   * @param {Request} req - The Express request object.
   * @param {number} page - The page number for pagination (optional, default: 1).
   * @param {number} limit - The number of items per page (optional, default: 10).
   * @param {string} search - Optional search term for filtering tasks.
   * @returns {Promise<{ result: TaskEntity[]; total: number }>} - The list of tasks and the total count.
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
  async getAllTasks(
    @Req() req,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ): Promise<{ result: TaskEntity[]; total: number }> {
    // Convert page and limit to numbers and ensure they are positive values
    const pageNumber = Math.max(1, Number(page));
    const itemsPerPage = Math.max(1, Number(limit));

    // Calculate the number of items to skip based on the current page and items per page
    const skip = (pageNumber - 1) * itemsPerPage;

    return this.taskService.getAllTasks(
      req.user.userId,
      skip,
      itemsPerPage,
      search
    );
  }

  /**
   * Get task data for dropdowns.
   *
   * @param {Request} req - The Express request object.
   * @param {string} fields - Comma-separated list of fields to retrieve (optional).
   * @param {string} keyword - The keyword for filtering data (optional).
   * @returns {Promise<TaskEntity[]>} - The list of task data for dropdowns.
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
  async getTaskDropdownData(
    @Req() req,
    @Query('fields') fields?: string,
    @Query('keyword') keyword?: string,
  ): Promise<TaskEntity[]> {
    const fieldArray = fields ? fields.split(',') : [
      'id',
      'taskName',
    ]
    return this.taskService.findAllDropdownData(
      req.user.userId,
      fieldArray, 
      keyword
    );
  }

  /**
   * Get a task by ID.
   *
   * @param {Request} req - The Express request object.
   * @param {number} id - The id of the task to retrieve.
   * @returns {Promise<TaskEntity>} - The task object.
   */
  @Get(':id')
  async getTaskById(
    @Req() req,
    @Param('id') id: number
  ): Promise<TaskEntity> {
    return this.taskService.getTaskById(
      req.user.userId,
      id
    );
  }

  /**
   * Create a new task.
   *
   * @param {Request} req - The Express request object.
   * @param {CreateTaskDto} createTaskDto - The DTO for creating a task.
   * @returns {Promise<TaskEntity>} - The newly created task object.
   */
  @Post()
  async createTask(
    @Req() req,
    @Body() createTaskDto: CreateTaskDto
  ): Promise<TaskEntity> {
    return this.taskService.createTask(
      req.user.userId,
      createTaskDto
    );
  }

  /**
   * Update an existing task.
   *
   * @param {Request} req - The Express request object.
   * @param {number} id - The id of the task to update.
   * @param {UpdateTaskDto} updateTaskDto - The DTO for updating a task.
   * @returns {Promise<TaskEntity>} - The updated task object.
   */
  @Put(':id')
  async updateTask(
    @Req() req,
    @Param('id') id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<TaskEntity> {
    return this.taskService.updateTask(
      req.user.userId,
      id, 
      updateTaskDto
    );
  }


  /**
   * Delete a task by ID.
   *
   * @param {Request} req - The Express request object.
   * @param {number} id - The id of the task to delete.
   * @returns {Promise<void>}
   */
  @Delete(':id')
  async deleteTask(
    @Req() req,
    @Param('id') id: number
  ): Promise<void> {
    return this.taskService.deleteTask(
      req.user.userId,
      id
    );
  }
}
