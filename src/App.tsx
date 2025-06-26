'use client';

import { useRef, useState, useEffect } from 'react';

export default function VideoPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [autoplayAttempted, setAutoplayAttempted] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);

  // Replace with your own video file path or public URL
  const videoSrc = '/video/jet.mp4';


  const handleCanPlay = () => {
    console.log('CanPlay event fired');
    if (videoRef.current) {
      setIsVideoReady(true);
      setDuration(videoRef.current.duration);
      console.log('Video is now ready for playback and seeking');
      if (!autoplayAttempted) {
        setAutoplayAttempted(true);
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((error) => {
          console.log('Autoplay failed:', error);
        });
      }
    }
  };

  const handleCanPlayThrough = () => {
    console.log('CanPlayThrough event fired');
    if (videoRef.current) {
      setIsVideoReady(true);
      setDuration(videoRef.current.duration);
      if (!autoplayAttempted) {
        setAutoplayAttempted(true);
        videoRef.current.play().then(() => {
          setIsPlaying(true);
          }).catch((error) => {
          console.log('Autoplay failed:', error);
          });
      }
    }
  };

  const handleError = (e: any) => {
    console.error('Video error:', e);
  };

  const handleUnmute = () => {
    if (videoRef.current && isVideoReady) {
      videoRef.current.muted = false;
      setIsMuted(false);
      setShowOverlay(false);
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
      videoRef.current.play();
      if (!isPlaying) {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(console.log);
      }
    }
  };

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    if (videoRef.current && isVideoReady) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(console.log);
      }
    }
  };

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const newTime = videoRef.current.currentTime;
      setCurrentTime(newTime);
      console.log('Time update:', newTime, 'Duration:', duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current && isVideoReady && duration > 0) {
      const time = parseFloat(e.target.value);
      console.log('Seeking to:', time, 'Duration:', duration, 'Ready:', isVideoReady);
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleSeekMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleSeekMouseUp = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleContainerClick = () => {
    if (videoRef.current && isVideoReady) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(console.log);
      }
    }
  };

  useEffect(() => {
    const autoPlay = () => {
      if (videoRef.current) {
        if (videoRef.current.duration > 0 && !isVideoReady) {
          console.log('Forcing ready state - duration available');
          setIsVideoReady(true);
          setDuration(videoRef.current.duration);
          if (!autoplayAttempted) {
            setAutoplayAttempted(true);
            videoRef.current.play().then(() => {
              setIsPlaying(true);
            }).catch((error) => {
              console.log('Autoplay failed:', error);
            });
          }
        }
      }
    }
    autoPlay();
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="relative w-full max-w-4xl aspect-video">
        <div 
          className="relative w-full h-full transform origin-center"
          onClick={handleContainerClick}
        >
          <video
            ref={videoRef}
            autoPlay
            className="w-full h-full rounded-lg bg-black"
            src={videoSrc}
            muted={isMuted}
            playsInline
            preload="auto"
            loop 
            onCanPlay={handleCanPlay}
            onCanPlayThrough={handleCanPlayThrough}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={handleTimeUpdate}
            onError={handleError}
          />
        </div>
        
        {showOverlay && (
          <div
            className="absolute left-1/2 top-1/2 w-32 h-32 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 xl:w-[260px] xl:h-[260px] -translate-x-1/2 -translate-y-1/2 rounded-lg flex items-center justify-center bg-black bg-opacity-70 cursor-pointer z-20"
            onClick={handleUnmute}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="text-center text-white px-2">
              <div className="mb-2 sm:mb-4 md:mb-6">
                <div className="relative w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 mx-auto mb-1 sm:mb-2 md:mb-4">
                  <svg
                    className="absolute inset-0 w-full h-full"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                  </svg>
                </div>
              </div>
              <p className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold mb-1 sm:mb-2 animate-pulse">🔊 Click to Unmute</p>
              <p className="text-xs sm:text-sm opacity-80">Video is muted by default</p>
              {isVideoReady && !isPlaying && (
                <p className="text-xs opacity-60 mt-1 sm:mt-2">Click anywhere to start playing</p>
              )}
            </div>
          </div>
        )}
        {/* Custom Controls */}
        <div 
          className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex flex-col items-center w-full px-2 sm:px-4 z-30"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime || 0}
            onChange={handleSeek}
            onMouseDown={handleSeekMouseDown}
            onMouseUp={handleSeekMouseUp}
            className="w-full h-1 sm:h-2 accent-green-500 cursor-pointer"
            style={{ pointerEvents: 'auto' }}
            disabled={!isVideoReady || duration <= 0}
          />
          <div className="flex items-center justify-between w-full mt-1 sm:mt-2">
            <button
              onClick={handlePlayPause}
              className="text-white bg-neutral-800 rounded-full p-1.5 sm:p-2 hover:bg-neutral-700 focus:outline-none disabled:opacity-50"
              disabled={!isVideoReady}
            >
              {isPlaying ? (
                <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              )}
            </button>
            <button
              onClick={handleMuteToggle}
              className="text-white bg-neutral-800 rounded-full p-1.5 sm:p-2 hover:bg-neutral-700 focus:outline-none ml-1 sm:ml-2"
            >
              {isMuted ? (
                <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
              )}
            </button>
            <span className="text-white ml-2 sm:ml-4 text-xs sm:text-sm">
              {Math.floor(currentTime / 60)}:{('0' + Math.floor(currentTime % 60)).slice(-2)} / {Math.floor(duration / 60)}:{('0' + Math.floor(duration % 60)).slice(-2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 