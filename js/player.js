// 同じサイト内のゲームに対して、TurboWarpの緑の旗を実行します。
const gameFrame = document.querySelector(".game-frame");
const resetButton = document.getElementById("reset-game");
const playerStatus = document.getElementById("player-status");

function getReadyPlayer() {
  try {
    const gameWindow = gameFrame.contentWindow;
    const loadingScreen = gameWindow.document.getElementById("loading");
    if (!loadingScreen?.hidden || typeof gameWindow.scaffolding?.greenFlag !== "function") {
      return null;
    }
    return gameWindow;
  } catch {
    // file://での直接表示など、ブラウザが内部へのアクセスを制限する場合があります。
    return null;
  }
}

// 内部へのアクセス制限で、ボタンが無効のままにならないようにします。
resetButton.disabled = false;

resetButton.addEventListener("click", () => {
  const gameWindow = getReadyPlayer();
  if (!gameWindow) {
    try {
      const loadingScreen = gameFrame.contentWindow.document.getElementById("loading");
      if (loadingScreen && !loadingScreen.hidden) {
        playerStatus.textContent = "ゲームを読み込んでいます。読み込み後に、もう一度押してください。";
        return;
      }
    } catch {
      // PC内のHTMLを直接開くと、iframe内部にアクセスできない場合があります。
    }
    gameFrame.src = gameFrame.getAttribute("src");
    playerStatus.textContent = "ゲーム画面を読み込み直しています。表示された緑の旗を押して開始してください。";
    return;
  }
  // 開始前に押した場合も、中央の緑の旗をクリックしたときと同じ状態にします。
  const launchScreen = gameWindow.document.getElementById("launch");
  if (launchScreen) launchScreen.hidden = true;
  gameWindow.scaffolding.greenFlag();
  gameFrame.focus();
  gameWindow.focus();
  playerStatus.textContent = "緑の旗を実行して、ゲームを再スタートしました。";
});
