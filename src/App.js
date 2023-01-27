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

  window.onkeydown = (e) => {
    if (e.key === "r" || e.key === "R") gameSet();
  };

  const maps = Array.from(Array(18), () => Array(25).fill(""));
  const [n, m] = [maps.length, maps[0].length];

  const bombLength = (n * m) / 2 - 150;

  const [unlockCount, setUnlockCount] = useState(0);
  const [lastSelect, setLastSelect] = useState({ X: 0, Y: 0 });

  // 배열 초기화
  const initArray = () => {
    return Array.from(Array(n), () => Array(m).fill(0));
  };

  const [visited, setVisited] = useState([]);
  const [active, setActive] = useState([]);
  const [mineStatus, setMineStatus] = useState([]);
  const [flag, setFlag] = useState([]);

  const [finish, setFinish] = useState(false);
  const [success, setSuccess] = useState(false);

  const [ready, setReady] = useState(false);

  const gameSet = () => {
    setReady(false);
    setRandomMine();
  };

  const setRandomMine = () => {
    const randomValue = [];

    let newActive = initArray();
    let newMineStatus = initArray();

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

    setVisited(initArray());
    setFlag(initArray());

    setUnlockCount(0);
    setLastSelect({ X: 0, Y: 0 });

    setActive([...newActive]);
    setMineStatus([...newMineStatus]);

    setFinish(false);
    setSuccess(false);
    setReady(true);
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
    gameSet();
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
        className={`type-${visited[X][Y] === 1 ? mineStatus[X][Y] : "0"}`}
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
        <CSS.StatusFont>
          {finish ? `실패 !!` : success ? "성공 !!" : "지뢰 찾기"}
          {` - 남은 칸 : ${n * m - bombLength} / ${n * m - bombLength - unlockCount}`}
        </CSS.StatusFont>
      </CSS.MineStatus>

      <CSS.MineWrapper x={n} y={m}>
        {ready && maps.map(getMaps)}
      </CSS.MineWrapper>

      <CSS.BottomStatus>
        <CSS.RestartButton onClick={setRandomMine}>{`다시 시작 ( R )`}</CSS.RestartButton>
      </CSS.BottomStatus>
    </CSS.Container>
  );
};

export default App;
