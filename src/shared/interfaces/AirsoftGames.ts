import { AirsoftGameType } from "../enums/AirsoftGameType";

export interface AirsoftGames {
  id: string;
  type: AirsoftGameType;
  createdAt: Date;
  updatedAt: Date;
  displayName: string;
  description: string;
  title: string;
  startDate: Date;
  endDate: Date;
  location: string;
  maxPlayers: Number;
  visibility: string;
  status: string;
  gameType: string;
  price: Number;
}
