import { CreateRoomDTO, ParsedCreateRoomDTO } from '../dto/createRoom.dto';

export const parseCreateRoomDTO = (
  createRoomDTO: CreateRoomDTO,
): ParsedCreateRoomDTO => {
  const parsedCreateRoomDTO = new ParsedCreateRoomDTO();
  for (const key in createRoomDTO) {
    let parsedValue = JSON.parse(createRoomDTO[key]);
    if (Array.isArray(parsedValue)) {
      parsedValue = parsedValue.map((obj) => Number(obj.id));
    }
    Object.assign(parsedCreateRoomDTO, {
      [key]: parsedValue,
    });
  }
  return parsedCreateRoomDTO;
};
