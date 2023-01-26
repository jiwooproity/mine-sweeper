import React, { useEffect, useState } from "react";
import { App as CSS } from "./AppStyle";

const search = [
  [1, 0],
  [0, 1],
  [1, 1],
  [-1, -1],
  [1, -1],
  [-1, 1],
  [-1, 0],
  [0, -1],
];

const App = () => {
  document.addEventListener(
    "contextmenu",
    (e) => {
      e.preventDefault();
    },
    false
  );

  const bombLength = 100;
  const maps = Array.from(Array(25), () => Array(25).fill(""));
  const [n, m] = [maps.length, maps[0].length];
  const [unlockCount, setUnlockCount] = useState(0);
  const [lastSelect, setLastSelect] = useState({ X: 0, Y: 0 });

  const [visited, setVisited] = useState(Array.from(Array(n), () => Array(m).fill(0)));
  const [active, setActive] = useState(Array.from(Array(n), () => Array(m).fill(0)));
  const [mineStatus, setMineStatus] = useState(Array.from(Array(n), () => Array(m).fill(0)));
  const [flag, setFlag] = useState(Array.from(Array(n), () => Array(m).fill(0)));

  const [finish, setFinish] = useState(false);
  const [success, setSuccess] = useState(false);

  const onResetGame = () => {
    setRandomMine({ reset: true });
  };

  const setRandomMine = ({ reset }) => {
    const randomValue = [];

    let newActive = reset ? Array.from(Array(n), () => Array(m).fill(0)) : [...active];
    let newMineStatus = reset ? Array.from(Array(n), () => Array(m).fill(0)) : [...mineStatus];

    for (let i = 0; i < bombLength; i++) {
      const [X, Y] = [Math.floor(Math.random() * n), Math.floor(Math.random() * m)];

      if (newActive[X][Y] !== "mine") {
        newActive[X][Y] = "mine";
        randomValue.push([X, Y]);
      } else i--;
    }

    for (let r = 0; r < randomValue.length; r++) {
      const [randomX, randomY] = randomValue[r];

      for (let s = 0; s < search.length; s++) {
        const [nextX, nextY] = [randomX + search[s][0], randomY + search[s][1]];

        if (nextX < 0 || nextY < 0 || nextX >= n || nextY >= m || newActive[nextX][nextY] === "mine") continue;
        else newMineStatus[nextX][nextY] = newMineStatus[nextX][nextY] + 1;
      }
    }

    if (reset) {
      setVisited(Array.from(Array(n), () => Array(m).fill(0)));
      setFlag(Array.from(Array(n), () => Array(m).fill(0)));

      setUnlockCount(0);
      setLastSelect({ X: 0, Y: 0 });

      setFinish(false);
      setSuccess(false);
    }

    setActive([...newActive]);
    setMineStatus([...newMineStatus]);
  };

  const onHandleClick = ({ X, Y }) => {
    if (finish) return;

    if (flag[X][Y] === 1) {
      return;
    }

    if (visited[X][Y] === 1) {
      return;
    }

    let newVisited = visited;
    let newUnlockCount = unlockCount;
    newVisited[X][Y] = 1;

    if (active[X][Y] === "mine") {
      setVisited([...newVisited]);
      setLastSelect({ X, Y });

      setTimeout(() => {
        setFinish(true);
      }, 1);
      return;
    }

    const queue = [[X, Y]];

    if (mineStatus[X][Y] === 0) {
      while (queue.length) {
        const [nowX, nowY] = queue.shift();

        for (let i = 0; i < search.length; i++) {
          const [nextX, nextY] = [nowX + search[i][0], nowY + search[i][1]];

          if (nextX < 0 || nextY < 0 || nextX >= n || nextY >= m) continue;

          if (!newVisited[nextX][nextY] && active[nextX][nextY] !== "mine" && mineStatus[nowX][nowY] === 0) {
            newVisited[nextX][nextY] = 1;
            queue.push([nextX, nextY]);

            newUnlockCount++;
          }
        }
      }
    } else {
      newVisited[X][Y] = 1;
    }

    setVisited([...newVisited]);
    setUnlockCount(newUnlockCount + 1);
  };

  const onFlag = ({ X, Y }) => {
    if (finish) return;

    let newFlag = flag;
    newFlag[X][Y] = newFlag[X][Y] === 0 ? 1 : 0;

    setFlag([...newFlag]);
  };

  useEffect(() => {
    if (unlockCount === n * m - bombLength) {
      setTimeout(() => {
        setSuccess(true);
      }, 1);
    }

    // eslint-disable-next-line
  }, [unlockCount]);

  useEffect(() => {
    setRandomMine({ reset: false });
    // eslint-disable-next-line
  }, []);

  const getMineBlock = ({ inValue, X, Y }) => {
    const setMine = ({ X, Y }) => {
      if (active[X][Y] === "mine") {
        return <CSS.ObjectImage className={`${lastSelect.X === X && lastSelect.Y === Y ? "bomb_red" : "bomb"}`} />;
      } else {
        return "";
      }
    };

    const showFlagOrMine = ({ X, Y }) => {
      if (finish) {
        return flag[X][Y] === 1 ? (
          <CSS.ObjectImage className={`${active[X][Y] === "mine" ? "flag" : "flag_red"}`} />
        ) : active[X][Y] === "mine" ? (
          <CSS.ObjectImage className={`${lastSelect.X === X && lastSelect.Y === Y ? "bomb_red" : "bomb"}`} />
        ) : (
          ""
        );
      } else {
        return flag[X][Y] === 1 ? <CSS.ObjectImage className="flag" /> : "";
      }
    };

    return (
      <CSS.MineBox
        key={Y}
        className={`type-${mineStatus[X][Y]}`}
        length={m}
        active={visited[X][Y] === 1}
        onClick={() => onHandleClick({ X, Y })}
        onContextMenu={() => onFlag({ X, Y })}
      >
        {visited[X][Y] !== 1 ? showFlagOrMine({ X, Y }) : mineStatus[X][Y] === 0 ? setMine({ X, Y }) : ""}
      </CSS.MineBox>
    );
  };

  const getMaps = (value, X) => {
    return (
      <CSS.MineLine key={X} length={n}>
        {value.map((inValue, Y) => getMineBlock({ inValue, X, Y }))}
      </CSS.MineLine>
    );
  };

  return (
    <CSS.Container>
      {/* <CSS.Background src={background} /> */}
      <CSS.MineStatus>
        <CSS.RestartButton onClick={onResetGame}>다시 시작</CSS.RestartButton>
      </CSS.MineStatus>
      <CSS.MineStatus>
        <CSS.StatusFont>
          {finish ? `실패 !!` : success ? "성공 !!" : "지뢰 찾기"}
          {` - 남은 칸 : ${n * m - bombLength} / ${n * m - bombLength - unlockCount}`}
        </CSS.StatusFont>
      </CSS.MineStatus>
      <CSS.MineWrapper>{maps.map(getMaps)}</CSS.MineWrapper>
    </CSS.Container>
  );
};

export default App;
