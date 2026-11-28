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

function updateResetButton() {
  resetButton.disabled = !getReadyPlayer();
}

gameFrame.addEventListener("load", updateResetButton);
// iframeのload後も、ゲームデータの読み込みは続くため定期的に確認します。
const readyCheck = window.setInterval(() => {
  updateResetButton();
  if (!resetButton.disabled) window.clearInterval(readyCheck);
}, 300);
updateResetButton();

resetButton.addEventListener("click", () => {
  const gameWindow = getReadyPlayer();
  if (!gameWindow) {
    resetButton.disabled = true;
    playerStatus.textContent = "ゲームの読み込み後に、ページを再読み込みしてください。";
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
