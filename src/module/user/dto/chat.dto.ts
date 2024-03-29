import { UserDto } from 'src/module/user/dto/user.dto';
import { MessageDto } from './message.dto';

export class ChatDto {
  constructor(parameters: ChatDto) {
    Object.assign(this, parameters);
  }

  chat_id: string;
  users: UserDto[];
  messages: MessageDto[];
}
