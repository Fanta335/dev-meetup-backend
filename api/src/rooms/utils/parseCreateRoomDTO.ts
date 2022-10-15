import { CreateRoomDTO, ParsedCreateRoomDTO } from '../dto/createRoom.dto';

export const parseCreateRoomDTO = (
  createRoomDTO: CreateRoomDTO,
): ParsedCreateRoomDTO => {
  const parsedCreateRoomDTO = new ParsedCreateRoomDTO();
  for (const key in createRoomDTO) {
    const parsedValue = JSON.parse(createRoomDTO[key]);
    Object.assign(parsedCreateRoomDTO, {
      [key]: parsedValue,
    });
  }
  return parsedCreateRoomDTO;
};
