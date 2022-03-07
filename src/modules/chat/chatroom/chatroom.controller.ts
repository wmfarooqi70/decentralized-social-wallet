import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { PaginationDto } from 'src/common/dto/PaginationDto';
import { JwtAuthGuard } from 'src/common/modules/jwt/jwt-auth.guard';
import { Roles } from 'src/common/modules/roles/roles.decorator';
import RequestWithUser from 'src/modules/auth/interfaces/request-with-user';
import { UserRole } from 'src/modules/user/user.entity';
import { UpdateMessageDto } from './dto/update-message.dto';
import { ChatroomService } from './chatroom.service';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { CreateNewMessageDto } from './dto/create-new-message.dto';

@Controller('chatrooms')
export class ChatroomController {
  constructor(private chatroomService: ChatroomService) {}

  @Get('/all')
  @Roles(UserRole.ADMIN)
  findAllChatrooms(@Query() { page, pageSize }) {
    return this.chatroomService.findAllChatrooms(page, pageSize);
  }

  @Get('/:chatroomId')
  @Roles(UserRole.ADMIN, UserRole.USER)
  findChatroomById(@Req() { user }: RequestWithUser, @Param() { chatroomId }) {
    return this.chatroomService.findChatroomById(chatroomId, user);
  }

  @Get('/:chatroomId/messages')
  @UseGuards(JwtAuthGuard)
  findMessagesByChatroomId(
    @Query() { page, pageSize }: PaginationDto,
    @Param() { chatroomId },
  ) {
    return this.chatroomService.findMessagesByChatroomId(
      chatroomId,
      page,
      pageSize,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAllChatroomsByUser(
    @Req() { user }: RequestWithUser,
    @Query() { page, pageSize },
  ) {
    return this.chatroomService.findAllChatroomsByUser(
      user.username,
      page,
      pageSize,
    );
  }

  @Post('/find-or-create')
  @UseGuards(JwtAuthGuard)
  findOrCreateChatroom(
    @Req() { user }: RequestWithUser,
    @Body() { name, icon, participants }: CreateChatroomDto,
  ) {
    return this.chatroomService.findOrCreateChatroom(
      user.username,
      participants,
      name,
      icon,
    );
  }

  @Put('/:chatroomId/add-participant/:participantId')
  @UseGuards(JwtAuthGuard)
  async addParticipantToChatroom(
    @Req() { user }: RequestWithUser,
    @Res() res: Response,
    @Param() { chatroomId, participantId },
  ) {
    const updatedChatroom = await this.chatroomService.addParticipantToChatroom(
      user,
      participantId,
      chatroomId,
    );
    res.status(HttpStatus.CREATED).json(updatedChatroom);
  }

  @Post('/:chatroomId/message')
  @UseGuards(JwtAuthGuard)
  addNewMessage(
    @Req() { user }: RequestWithUser,
    @Param() { chatroomId },
    @Body()
    { messageContent, messageRandomId, messageType }: CreateNewMessageDto,
  ) {
    return this.chatroomService.addNewMessage(
      user.username,
      chatroomId,
      messageContent,
      messageType,
      messageRandomId,
    );
  }

  @Put('/:chatroomId/messages/:messageId')
  @UseGuards(JwtAuthGuard)
  async updateMessage(
    @Req() { user }: RequestWithUser,
    @Param() { chatroomId, messageId },
    @Body() { messageContent, reactions, seenStatuses }: UpdateMessageDto,
  ) {
    return this.chatroomService.updateMessage(
      chatroomId,
      user.username,
      messageId,
      messageContent,
      reactions,
      seenStatuses,
    );
  }

  @Delete('/:chatroomId/messages/:messageId')
  @UseGuards(JwtAuthGuard)
  async deleteMessageFromChatroom(
    @Req() { user }: RequestWithUser,
    @Param() { chatroomId, messageId },
  ) {
    return this.chatroomService.deleteMessageFromChatroom(
      chatroomId,
      user.username,
      messageId,
    );
  }
}