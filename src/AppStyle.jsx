import styled, { css } from "styled-components";

const App = {};

App.Container = styled.div`
  width: 100%;
  height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  position: relative;
`;

App.Background = styled.img`
  width: 100%;
  height: 100%;

  object-fit: cover;

  position: absolute;
  top: 0;
  left: 0;

  z-index: -1;

  opacity: 0.1;
`;

App.MineStatus = styled.div`
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  padding-bottom: 15px;
`;

App.RestartButton = styled.button`
  border: none;

  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
`;

App.StatusFont = styled.span`
  font-size: 20px;
  line-height: 20px;
`;

App.MineWrapper = styled.div`
  width: 600px;
  height: 600px;

  box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px,
    rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;

  background-color: white;
`;

App.MineLine = styled.div`
  width: 100%;
  height: ${({ length }) => `calc(600px / ${length})`};

  display: flex;
`;

App.MineBox = styled.div`
  width: ${({ length }) => `calc(600px / ${length})`};
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  ${({ active }) =>
    active
      ? css`
          /* box-shadow: rgba(50, 50, 93, 0.25) 0px 15px 30px -12px inset, rgba(0, 0, 0, 0.3) 0px 9px 18px -30px inset; */

          &.type-0 {
            background-image: url("https://minesweeper.online/img/skins/hd/type0.svg?v=3");
            background-size: 100%;
          }

          &.type-1 {
            background-image: url("https://minesweeper.online/img/skins/hd/type1.svg?v=3");
            background-size: 100%;
          }

          &.type-2 {
            background-image: url("https://minesweeper.online/img/skins/hd/type2.svg?v=3");
            background-size: 100%;
          }

          &.type-3 {
            background-image: url("https://minesweeper.online/img/skins/hd/type3.svg?v=3");
            background-size: 100%;
          }

          &.type-4 {
            background-image: url("https://minesweeper.online/img/skins/hd/type4.svg?v=3");
            background-size: 100%;
          }

          &.type-5 {
            background-image: url("https://minesweeper.online/img/skins/hd/type5.svg?v=3");
            background-size: 100%;
          }

          &.type-6 {
            background-image: url("https://minesweeper.online/img/skins/hd/type6.svg?v=3");
            background-size: 100%;
          }

          &.type-7 {
            background-image: url("https://minesweeper.online/img/skins/hd/type7.svg?v=3");
            background-size: 100%;
          }

          &.type-8 {
            background-image: url("https://minesweeper.online/img/skins/hd/type8.svg?v=3");
            background-size: 100%;
          }
        `
      : css`
          /* box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px; */
          background-image: url("https://minesweeper.online/img/skins/hd/closed.svg?v=3");
          background-size: 100%;
        `}
`;

App.ObjectImage = styled.div`
  width: 100%;
  height: 100%;

  object-fit: cover;

  &.bomb {
    background-image: url("https://minesweeper.online/img/skins/hd/mine.svg?v=3");
    background-size: 100%;
  }

  &.bomb_red {
    background-image: url("https://minesweeper.online/img/skins/hd/mine_red.svg?v=3");
    background-size: 100%;
  }

  &.flag {
    background-image: url("https://minesweeper.online/img/skins/hd/flag.svg?v=3");
    background-size: 100%;
  }

  &.flag_red {
    background-image: url("https://minesweeper.online/img/skins/hd/mine_wrong.svg?v=3");
    background-size: 100%;
  }
`;

export { App };
