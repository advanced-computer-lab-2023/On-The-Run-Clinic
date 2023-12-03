import React, { useEffect, useRef } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';

const Videocall = () => {
  const containerRef = useRef();
  const localContainerRef = useRef();
  const subscribedUsers = useRef(new Set());
  const userCount = useRef(0);

  useEffect(() => {
    const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

    async function startCall() {
      await client.join('7c70f94de2964203a8ffc3bc67a8e21b', 'OnTheRunClinic', '007eJxTYNCwff2r+vSH0vQl3lZ3dn20r04SKJtV+ULp9nKJyQ5Mog8VGMyTzQ3SLE1SUo0szUyMDIwTLdLSko2Tks3MEy1SjQyTON9mpjYEMjL0rXZiZGSAQBCfj8E/LyQjNag0zzknMy8zmYEBAOrVI8M=');
      const localTrack = await AgoraRTC.createCameraVideoTrack();
      localTrack.play(localContainerRef.current.id);
      await client.publish([localTrack]);
      userCount.current += 1;

      client.on('user-published', async (user, mediaType) => {
        if (user.uid === client.uid || subscribedUsers.current.has(user.uid) || userCount.current >= 2) {
          // Don't subscribe to our own published tracks, to already subscribed users, or if user limit is reached
          return;
        }
        await client.subscribe(user, mediaType);
        console.log('subscribe success');
        if (mediaType === 'video') {
          const remoteVideoTrack = user.videoTrack;
          const playerContainer = document.createElement('div');
          playerContainer.id = user.uid.toString();
          playerContainer.style.width = '320px';
          playerContainer.style.height = '240px';
          if (containerRef.current) {
            containerRef.current.appendChild(playerContainer);
            remoteVideoTrack.play(playerContainer.id);
          }
          subscribedUsers.current.add(user.uid);
          userCount.current += 1;
        }
      });

      return () => {
        localTrack.close();
        client.leave();
      };
    }

    startCall();
  }, []);

  return (
    <div>
      <div ref={localContainerRef} id="local-container" style={{width: '320px', height: '240px'}}></div>
      <div ref={containerRef}></div>
    </div>
  );
};

export default Videocall;