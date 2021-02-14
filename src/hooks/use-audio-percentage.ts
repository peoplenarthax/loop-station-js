import { useContext, useState, useEffect } from 'react';
import type { ChannelId } from '../managers/AudioManager';
import { AudioManagerContext } from '../providers/audio';

export const useAudioPercentage = (
  channelId: ChannelId,
  isPlaying: boolean,
): number => {
  const [percentage, setPercentage] = useState(0);
  const { audioManager } = useContext(AudioManagerContext);
  useEffect(() => {
    if (audioManager.getChannel(channelId)) {
      const audio = audioManager.getChannel(channelId).source.mediaElement;
      const duration = audio.duration;

      const onTimeUpdate = () => {
        const currentTime = audio.currentTime;

        setPercentage(currentTime / duration);
      };

      audio.addEventListener('timeupdate', onTimeUpdate);
    }
  }, [channelId, audioManager, isPlaying]);

  return percentage;
};
