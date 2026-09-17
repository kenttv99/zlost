import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';
import './LessonPlayer.css';

interface LessonPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  autoPlay?: boolean;
}

export const LessonPlayer: React.FC<LessonPlayerProps> = ({
  src,
  poster,
  title = 'Фрагменты из уроков',
  autoPlay = false
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const hideTimerRef = useRef<number | null>(null);

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, []);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const targetTime = Number(e.target.value);
    video.currentTime = targetTime;
    setCurrentTime(targetTime);
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen?.().catch(() => {
        videoRef.current?.requestFullscreen?.().catch(() => {});
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleMouseMove = () => {
    setIsHovered(true);
    if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    hideTimerRef.current = window.setTimeout(() => {
      if (isPlaying) setIsHovered(false);
    }, 2400);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onLoadedMetadata = () => setDuration(video.duration);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('ended', onEnded);

    if (autoPlay) {
      video.play().catch(() => {});
    }

    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('ended', onEnded);
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    };
  }, [autoPlay]);

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className={`lesson-player-root ${isPlaying ? 'is-playing' : ''} ${isHovered ? 'show-controls' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setIsHovered(false)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.code === 'Space') {
          e.preventDefault();
          togglePlay();
        } else if (e.key === 'm' || e.key === 'M' || e.key === 'ь' || e.key === 'Ь') {
          toggleMute();
        }
      }}
    >
      <video
        ref={videoRef}
        className="lesson-player-video"
        src={src}
        poster={poster}
        playsInline
        preload="metadata"
        onClick={togglePlay}
      />

      {/* Top Glass Badge */}
      <div className="player-top-bar">
        <span className="player-badge">{title}</span>
        <span className="player-duration-badge">{formatTime(duration || 79)}</span>
      </div>

      {/* Central Tactile Play Overlay */}
      <button
        type="button"
        className={`player-center-btn ${!isPlaying ? 'visible' : ''}`}
        onClick={togglePlay}
        aria-label={isPlaying ? 'Пауза' : 'Воспроизведение'}
      >
        <span className="player-center-icon">
          {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
        </span>
      </button>

      {/* Bottom Floating Glass Controls */}
      <div className="player-bottom-bar" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="player-ctrl-btn"
          onClick={togglePlay}
          aria-label={isPlaying ? 'Пауза' : 'Воспроизведение'}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>

        <div className="player-timeline-wrapper">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="player-range-input"
            aria-label="Перемотка видео"
          />
          <div className="player-progress-bar" style={{ width: `${progressPercent}%` }} />
        </div>

        <div className="player-time-display">
          <span>{formatTime(currentTime)}</span>
          <span className="player-time-divider">/</span>
          <span>{formatTime(duration || 79)}</span>
        </div>

        <button
          type="button"
          className="player-ctrl-btn"
          onClick={toggleMute}
          aria-label={isMuted ? 'Включить звук' : 'Выключить звук'}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        <button
          type="button"
          className="player-ctrl-btn"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? 'Выйти из полноэкранного режима' : 'Полноэкранный режим'}
        >
          {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
      </div>
    </div>
  );
};
