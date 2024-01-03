import { useState, useRef, MouseEvent } from "react";
import classNames from "classnames";
import { Box } from "@mui/material";
import GameCard from "./GameCard";
import CodeLabel from "./CodeLabel";
import useClickOutside from "../../hooks/useClickOutside";
import { CARD_REVEAL_TRANSITION } from "../../constants/transitions";
import { StyledTurnIndicator } from "./StyledTurnIndicator.styled";
import { TeamColor } from "../../enums/TeamColor";
import { useTurnTimeManager } from "../../hooks/useTurnTimeManager";
import { useGameContext } from "../../context/GameStateProvider";
import { useAuthContext } from "../../context/AuthProvider";
import CodeForm from "./CodeForm";
import ActionsMenu from "./ActionsMenu";
import ToggleV2 from "../../components/ToggleV2";
import TeamPanel from "./TeamPanel";
import { Team } from "../../enums/Team";
import { getUserTurnMetadata, toggleTeamTurn } from "../../helpers/turn";
import { IUser } from "../../interfaces/user.interface";
import bgTurnRed from "../../assets/bg-turn-red.png";
import bgTurnBlue from "../../assets/bg-turn-blue.png";
import { useRoomContext } from "../../context/RoomProvider";
import { Role } from "../../enums/Role";
import useInitUsersRoom from "../../hooks/state/useInitUsersRoom";
import "./GamePage.scss";
import DevTools from "../../components/DevTools";

const GamePage = () => {
  useTurnTimeManager();
  useInitUsersRoom();
  const [isLeaderViewToggled, setIsLeaderViewToggled] = useState(false);
  const activeCardRef = useRef(null);
  const { user } = useAuthContext();
  const { turn, code, increaseFoundCards, handleTurnOver } = useGameContext();
  const { room, setRoom } = useRoomContext();
  const cardsData = room?.cardsData || [];
  const activeCard = room?.activeCard;
  const hasActiveCard = activeCard !== null;

  const {
    remainingTime,
    isUserTUrn,
    isLeader,
    isCardsDisabled,
    teamColor,
    muiColor,
  } = getUserTurnMetadata({ user: user as IUser, turn });

  const setActiveCard = (activeCard: number | null) => {
    setRoom((prev) => ({ ...prev, activeCard }));
  };
  const toggleLeaderView = () => {
    setIsLeaderViewToggled((prevState) => !prevState);
  };
  const onCardClick = (cardKey: number) => {
    setActiveCard(cardKey);
  };
  const handleCardSelection = (cardKey: number) => {
    setRoom((prevRoom) => {
      const prevCardsDatta = prevRoom.cardsData;
      const newCardsData = prevCardsDatta.map((card) => {
        const isRevealedCard = card.key === cardKey;
        return {
          ...card,
          ...(isRevealedCard && { revealed: true }),
        };
      });

      return {
        ...prevRoom,
        cardsData: newCardsData,
      };
    });

    const isUserTeamCard =
      cardsData.find((card) => card.key === cardKey)?.color === teamColor;
    if (isUserTeamCard) {
      increaseFoundCards();
      if (code && code.codeLength === code.foundCards + 1) {
        handleTurnOver();
      }
    } else {
      handleTurnOver();
    }

    setTimeout(() => {
      setActiveCard(null);
    }, CARD_REVEAL_TRANSITION);
  };
  const handleOutsideClick = () => !isCardsDisabled && setActiveCard(null);
  useClickOutside(activeCardRef, handleOutsideClick);

  const attentionCardKey =
    !isCardsDisabled && cardsData.find((card) => !card.revealed)?.key;
  const cards = cardsData.map((cardData) => {
    const { key, revealed } = cardData;
    const isActive = key === activeCard;
    const isRevealed = isLeaderViewToggled || revealed;
    const attention = key === attentionCardKey;
    const handleCardClick = (event: MouseEvent) => {
      event.stopPropagation();
      onCardClick(key);
    };

    return (
      <GameCard
        key={key}
        handleCardClick={handleCardClick}
        handleCardSelection={(event: MouseEvent) => {
          handleCardSelection(key);
          event.stopPropagation();
        }}
        revealed={isRevealed}
        active={isActive}
        cardData={cardData}
        ref={isActive ? activeCardRef : null}
        attention={attention}
        disabled={isCardsDisabled}
      />
    );
  });

  return (
    <>
      {/* <DevTools /> */}
      <StyledTurnIndicator
        className={`${turn.team}-${turn.role}`}
        active_team_color={TeamColor[turn.team]}
        remaining_time={remainingTime}
        team={turn.team}
      >
        <div className="border-timer" />
        <img className="turn-bg-blue" src={bgTurnBlue} />
        <img className="turn-bg-red" src={bgTurnRed} />
      </StyledTurnIndicator>
      <div
        className={classNames("cards-container", {
          hasActiveCard,
        })}
      >
        {cards}
      </div>

      <ActionsMenu>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            position: "absolute",
            left: 24,
            alignItems: "center",
          }}
        >
          <TeamPanel team={user?.team || Team.Red} />
          {isLeader && [
            <ToggleV2
              key="toogle"
              onToggle={toggleLeaderView}
              text={{ off: "תראה תצבעים", on: "תסתיר תצבעים" }}
              width="120px"
              color={muiColor}
            ></ToggleV2>,
            <CodeForm
              key="card-form"
              disabled={!isUserTUrn}
              color={muiColor}
            />,
          ]}
        </Box>
        <Box>
          {code ? (
            <CodeLabel />
          ) : (
            `${
              room?.users?.find(
                (user) => user.role === Role.Leader && user.team === turn.team
              )?.displayName || "מישהו"
            }  על הקוד..`
          )}
        </Box>
        <Box sx={{ display: "flex", gap: 1, position: "absolute", right: 24 }}>
          <TeamPanel team={toggleTeamTurn(user?.team || Team.Red)} />
        </Box>
      </ActionsMenu>
    </>
  );
};

export default GamePage;
