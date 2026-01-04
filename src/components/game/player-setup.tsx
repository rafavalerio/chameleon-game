"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Users, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGame } from "@/lib/game-context";
import { GAME_CONFIG } from "@/lib/game-config";

const playerColors = [
  "bg-game-purple",
  "bg-game-pink",
  "bg-game-blue",
  "bg-game-orange",
  "bg-game-green",
  "bg-game-yellow",
  "bg-primary",
  "bg-accent",
  "bg-chart-1",
  "bg-chart-2",
];

export function PlayerSetup() {
  const { state, addPlayer, removePlayer, startTopicSelection } = useGame();
  const [newPlayerName, setNewPlayerName] = useState("");

  const handleAddPlayer = () => {
    const trimmedName = newPlayerName.trim();
    if (
      trimmedName.length >= GAME_CONFIG.MIN_NAME_LENGTH &&
      trimmedName.length <= GAME_CONFIG.MAX_NAME_LENGTH &&
      state.players.length < GAME_CONFIG.MAX_PLAYERS
    ) {
      addPlayer(trimmedName);
      setNewPlayerName("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddPlayer();
    }
  };

  const canStart = state.players.length >= GAME_CONFIG.MIN_PLAYERS;
  const canAddMore = state.players.length < GAME_CONFIG.MAX_PLAYERS;

  return (
    <div className="h-full flex flex-col max-w-md mx-auto">
      {/* Fixed Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-shrink-0 pt-6 pb-4 px-4 text-center space-y-2 border-b border-border/50 bg-background/95 backdrop-blur-sm"
        style={{ paddingTop: 'max(1.5rem, calc(env(safe-area-inset-top) + 1.5rem))', paddingLeft: 'max(1rem, env(safe-area-inset-left))', paddingRight: 'max(1rem, env(safe-area-inset-right))' }}
      >
        <div className="text-6xl" style={{ fontVariantEmoji: 'emoji' }}>
          🦎
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-chameleon to-game-purple bg-clip-text text-transparent">
          Chameleon
        </h1>
        <p className="text-muted-foreground">Add players to start the game</p>
      </motion.div>

      {/* Scrollable Content */}
      <div 
        className="flex-1 overflow-y-auto px-4 py-6"
        style={{ paddingLeft: 'max(1rem, env(safe-area-inset-left))', paddingRight: 'max(1rem, env(safe-area-inset-right))' }}
      >
        <Card className="border-2 border-border/80">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="w-5 h-5 text-primary" />
              Players ({state.players.length}/{GAME_CONFIG.MAX_PLAYERS})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add player input */}
            <div className="flex gap-3 items-stretch">
              <Input
                placeholder="Enter player name..."
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                onKeyPress={handleKeyPress}
                maxLength={GAME_CONFIG.MAX_NAME_LENGTH}
                disabled={!canAddMore}
                className="flex-1 text-lg h-14 px-5 py-4"
              />
              <Button
                onClick={handleAddPlayer}
                disabled={
                  !canAddMore ||
                  newPlayerName.trim().length < GAME_CONFIG.MIN_NAME_LENGTH
                }
                className="shrink-0 h-14 w-14"
              >
                <Plus className="w-6 h-6" />
              </Button>
            </div>

            {/* Player list */}
            <div className="space-y-2 min-h-[120px]">
              <AnimatePresence mode="popLayout">
                {state.players.length === 0 ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-muted-foreground py-8"
                  >
                    No players yet. Add at least {GAME_CONFIG.MIN_PLAYERS} players.
                  </motion.p>
                ) : (
                state.players.map((player, index) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 group"
                  >
                    <div
                      className={`w-10 h-10 rounded-full ${playerColors[index % playerColors.length]} flex items-center justify-center text-white font-semibold text-sm border-2 border-white/20`}
                    >
                      {player.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="flex-1 font-medium">{player.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removePlayer(player.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
                      aria-label={`Remove ${player.name}`}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))
                )}
              </AnimatePresence>
            </div>

            {/* Minimum players hint */}
            {!canStart && state.players.length > 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-center text-muted-foreground"
              >
                Need {GAME_CONFIG.MIN_PLAYERS - state.players.length} more player
                {GAME_CONFIG.MIN_PLAYERS - state.players.length !== 1 ? "s" : ""} to start
              </motion.p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Fixed Footer */}
      <div 
        className="flex-shrink-0 px-4 pt-4 pb-6 border-t border-border/50 bg-background/95 backdrop-blur-sm"
        style={{ paddingBottom: 'max(1.5rem, calc(env(safe-area-inset-bottom) + 1.5rem))', paddingLeft: 'max(1rem, env(safe-area-inset-left))', paddingRight: 'max(1rem, env(safe-area-inset-right))' }}
      >
        <Button
          onClick={startTopicSelection}
          disabled={!canStart}
          className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-chameleon to-chameleon-dark hover:from-chameleon-dark hover:to-chameleon border-2 border-chameleon-dark/30 disabled:opacity-50"
          size="lg"
        >
          <Play className="w-5 h-5 mr-2" />
          Start Game
        </Button>
      </div>
    </div>
  );
}
