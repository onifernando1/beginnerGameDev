export function drawStatusText(context, input, player) {
  context.font = "28px Helvetica";
  context.fillText("Last Input:" + input.lastKey, 20, 50);
  context.fillText("CURRENT STATE:" + player.currentState.state, 20, 100);
}

// not default so import {}
