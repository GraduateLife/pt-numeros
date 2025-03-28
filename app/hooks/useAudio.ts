import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

const MAX_CHUNK_LENGTH = 1000;

interface UseAudioProps {
  onPlayingChange?: (isPlaying: boolean) => void;
  text: string;
}

export const useAudio = ({ onPlayingChange, text }: UseAudioProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(
    null,
  );

  const splitTextIntoChunks = (text: string): string[] => {
    const chunks: string[] = [];
    let currentChunk = "";
    const sentences = text.split(/([.!?。！？]+\s+)/);

    for (const sentence of sentences) {
      if ((currentChunk + sentence).length <= MAX_CHUNK_LENGTH) {
        currentChunk += sentence;
      } else {
        if (currentChunk) chunks.push(currentChunk.trim());
        currentChunk = sentence;
      }
    }

    if (currentChunk) chunks.push(currentChunk.trim());
    return chunks;
  };

  const audioMutation = useMutation({
    mutationFn: async (text: string) => {
      const chunks = splitTextIntoChunks(text);
      setIsPlaying(true);
      onPlayingChange?.(true);

      try {
        for (const chunk of chunks) {
          const response = await fetch("/api/audio", {
            method: "POST",
            body: JSON.stringify({ text: chunk }),
          });

          const blob = await response.blob();
          const url = URL.createObjectURL(blob);

          await new Promise((resolve, reject) => {
            const audio = new Audio(url);
            setCurrentAudio(audio);

            audio.onended = () => {
              URL.revokeObjectURL(url);
              resolve(null);
            };

            audio.onerror = reject;
            audio.play().catch(reject);
          });
        }
      } catch (error) {
        console.error("Error playing audio:", error);
        toast.error("播放音频时出错");
        throw error;
      } finally {
        setIsPlaying(false);
        setCurrentAudio(null);
        onPlayingChange?.(false);
      }
    },
  });

  const playAudio = (text: string) => {
    if (isPlaying && currentAudio) {
      currentAudio.pause();
      setIsPlaying(false);
      setCurrentAudio(null);
      onPlayingChange?.(false);
      return;
    }

    audioMutation.mutate(text);
  };

  return {
    isPlaying,
    playAudio,
    isLoading: audioMutation.isPending,
    error: audioMutation.error,
  };
};
