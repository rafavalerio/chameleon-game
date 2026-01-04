"use client";

import { motion } from "framer-motion";
import { Trophy, RotateCcw, Home, Check, X, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGame } from "@/lib/game-context";
import { GAME_CONFIG } from "@/lib/game-config";

export function FinalResults() {
  const { state, newRound, resetGame } = useGame();

  const chameleon = state.players.find((p) => p.isChameleon);
  const eliminatedPlayer = state.players.find(
    (p) => p.id === state.eliminatedPlayerId
  );
  const chameleonWasCaught = eliminatedPlayer?.isChameleon ?? false;

  // Sort players by score for leaderboard
  const sortedPlayers = [...state.players].sort((a, b) => b.score - a.score);
  const topScore = sortedPlayers[0]?.score ?? 0;

  return (
    <div className="h-full flex flex-col max-w-md mx-auto">
      {/* Fixed Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-shrink-0 pt-4 pb-4 px-4 text-center space-y-4 border-b border-border/50 bg-background/95 backdrop-blur-sm"
        style={{ paddingTop: 'max(1rem, calc(env(safe-area-inset-top) + 1rem))', paddingLeft: 'max(1rem, env(safe-area-inset-left))', paddingRight: 'max(1rem, env(safe-area-inset-right))' }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
        >
          <div className="text-6xl">
            {chameleonWasCaught ? "🎉" : "🦎"}
          </div>
        </motion.div>
        <h2 className="text-2xl font-bold">
          {chameleonWasCaught ? "Chameleon Caught!" : "Chameleon Wins!"}
        </h2>
      </motion.div>

      {/* Scrollable Content */}
      <div 
        className="flex-1 overflow-y-auto px-4 py-6 space-y-6"
        style={{ paddingLeft: 'max(1rem, env(safe-area-inset-left))', paddingRight: 'max(1rem, env(safe-area-inset-right))' }}
      >

      {/* Chameleon reveal */}
      <Card className="border-2 border-chameleon/30 bg-gradient-to-br from-chameleon/10 to-chameleon/5 overflow-hidden">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-chameleon/20 flex items-center justify-center">
                <span className="text-2xl">🦎</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">The chameleon was</p>
                <p className="text-xl font-bold text-chameleon">
                  {chameleon?.name}
                </p>
              </div>
            </div>
            <Badge
              variant={chameleonWasCaught ? "destructive" : "default"}
              className="text-sm"
            >
              {chameleonWasCaught ? "Caught!" : "Escaped!"}
            </Badge>
          </div>

          {/* Secret word */}
          <div className="p-4 rounded-xl bg-background/80 text-center">
            <p className="text-sm text-muted-foreground mb-1">
              The secret word was:
            </p>
            <p className="text-2xl font-bold text-primary">{state.secretWord}</p>
          </div>

          {/* Chameleon's guess result (if applicable) */}
          {chameleonWasCaught && state.chameleonGuessedCorrectly !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                state.chameleonGuessedCorrectly
                  ? "bg-success/10 border border-success/20"
                  : "bg-destructive/10 border border-destructive/20"
              }`}
            >
              {state.chameleonGuessedCorrectly ? (
                <>
                  <Check className="w-5 h-5 text-success" />
                  <div>
                    <p className="font-medium text-success">Correct guess!</p>
                    <p className="text-sm text-muted-foreground">
                      {chameleon?.name} earned +
                      {GAME_CONFIG.POINTS_CHAMELEON_GUESSES_WORD} bonus points
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <X className="w-5 h-5 text-destructive" />
                  <div>
                    <p className="font-medium text-destructive">Wrong guess!</p>
                    <p className="text-sm text-muted-foreground">
                      No bonus points for {chameleon?.name}
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Scoreboard */}
      <Card className="border-2 border-primary/40">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Trophy className="w-5 h-5 text-game-yellow" />
            <h3 className="font-semibold text-lg">Scoreboard</h3>
          </div>

          <div className="space-y-2">
            {sortedPlayers.map((player, index) => {
              const isLeader = player.score === topScore && topScore > 0;
              const isChameleon = player.isChameleon;

              return (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center justify-between p-3 rounded-xl ${
                    isLeader
                      ? "bg-gradient-to-r from-game-yellow/20 to-game-orange/10 border border-game-yellow/30"
                      : "bg-muted/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center font-bold text-muted-foreground">
                      {index + 1}
                    </span>
                    <span className="font-medium">{player.name}</span>
                    {isChameleon && (
                      <span className="text-sm">🦎</span>
                    )}
                    {isLeader && (
                      <Crown className="w-4 h-4 text-game-yellow" />
                    )}
                  </div>
                  <span className="font-bold text-lg">{player.score}</span>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Points breakdown */}
      <div className="text-center text-sm text-muted-foreground space-y-1">
        <p>
          {chameleonWasCaught ? (
            <>
              Non-chameleons earned{" "}
              <span className="font-semibold text-foreground">
                +{GAME_CONFIG.POINTS_CHAMELEON_CAUGHT}
              </span>{" "}
              points each
            </>
          ) : (
            <>
              {chameleon?.name} earned{" "}
              <span className="font-semibold text-foreground">
                +{GAME_CONFIG.POINTS_CHAMELEON_SURVIVES}
              </span>{" "}
              points for escaping
            </>
          )}
        </p>
        {chameleonWasCaught && state.chameleonGuessedCorrectly && (
          <p>
            {chameleon?.name} earned{" "}
            <span className="font-semibold text-foreground">
              +{GAME_CONFIG.POINTS_CHAMELEON_GUESSES_WORD}
            </span>{" "}
            bonus points
          </p>
        )}
      </div>

      </div>

      {/* Fixed Footer */}
      <div 
        className="flex-shrink-0 px-4 pt-4 pb-6 border-t border-border/50 bg-background/95 backdrop-blur-sm space-y-3"
        style={{ paddingBottom: 'max(1.5rem, calc(env(safe-area-inset-bottom) + 1.5rem))', paddingLeft: 'max(1rem, env(safe-area-inset-left))', paddingRight: 'max(1rem, env(safe-area-inset-right))' }}
      >
        <Button
          onClick={newRound}
          className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-chameleon to-chameleon-dark hover:from-chameleon-dark hover:to-chameleon border-2 border-chameleon-dark/30"
          size="lg"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Play Another Round
        </Button>
        <Button
          onClick={resetGame}
          variant="outline"
          className="w-full h-12 text-base"
        >
          <Home className="w-5 h-5 mr-2" />
          New Game
        </Button>
      </div>
    </div>
  );
}
