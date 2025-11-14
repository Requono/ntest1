import { AirsoftEventType } from "../enums/AirsoftEventType";

export interface AirsoftEventsInput {
  title: string;
  description: string;
  startDate: string | Date;
  endDate: string | Date;
  location: string;
  maxPlayers: number | string;
  visibility: string;
  status: string;
  gameType: AirsoftEventType;
  price: number;
}

export interface AirsoftEvents {
  id: string;
  createdById: string;
  type: AirsoftEventType;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  maxPlayers: number;
  visibility: string;
  status: string;
  gameType: AirsoftEventType;
  price: number;
}
