"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Plus, X, Users, Play, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGame } from "@/lib/game-context";
import { GAME_CONFIG } from "@/lib/game-config";
import { PageContainer, PageHeader, PageContent, PageFooter } from "./shared/page-layout";
import { ConfirmDialog } from "./shared/confirm-dialog";
import { PlayerAvatar } from "./shared/player-avatar";

export function PlayerSetup() {
  const { state, addPlayer, removePlayer, clearPlayers, startTopicSelection } = useGame();
  const [newPlayerName, setNewPlayerName] = useState("");
  const [showClearDialog, setShowClearDialog] = useState(false);

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
    <PageContainer>
      <PageHeader showReset={false}>
        <div className="flex justify-center">
          <Image
            src="/chameleon-logo.png"
            alt="Chameleon"
            width={80}
            height={80}
            className="w-20 h-20"
            priority
          />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-chameleon-dark to-chameleon bg-clip-text text-transparent">
          Chameleon
        </h1>
        <p className="text-muted-foreground">Add players to start the game</p>
      </PageHeader>

      <PageContent>
        <Card className="border border-border/60">
          <CardHeader className="pb-1">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-5 h-5 text-primary" />
                Players ({state.players.length}/{GAME_CONFIG.MAX_PLAYERS})
              </CardTitle>
              {state.players.length > 0 && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowClearDialog(true)}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted border border-border/60"
                  aria-label="Clear all players"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
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
                    <PlayerAvatar name={player.name} index={index} size="sm" />
                    <span className="flex-1 font-medium">{player.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removePlayer(player.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
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
      </PageContent>

      <PageFooter>
        <Button
          onClick={startTopicSelection}
          disabled={!canStart}
          className="w-full h-14 text-lg font-semibold bg-chameleon-dark text-white hover:bg-chameleon-dark/90 disabled:opacity-50"
          size="lg"
        >
          <Play className="w-5 h-5 mr-2" />
          Start Game
        </Button>
      </PageFooter>

      <ConfirmDialog
        open={showClearDialog}
        onOpenChange={setShowClearDialog}
        title="Clear All Players?"
        description="Are you sure you want to remove all players? This action cannot be undone."
        confirmLabel="Clear All Players"
        onConfirm={clearPlayers}
      />
    </PageContainer>
  );
}
