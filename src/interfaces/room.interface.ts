import { Team } from "../enums/Team";
import { ICardData } from "./CardData.interface";
import { IUser } from "./user.interface";

export interface IRoom {
  gameStarted: boolean;
  isGameOver: boolean;
  users: IUser[];
  teamsReady?: {
    [Team.Blue]?: boolean;
    [Team.Red]?: boolean;
  };
  cardsData: ICardData[];
  activeCard: string | null;
}
