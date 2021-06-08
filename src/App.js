import React, { useState } from 'react';
import Agora from 'agora-rtc-sdk';
import AgoraRTC from 'agora-rtc-sdk-ng';
export default function AgoraVoice() {
  // const client = AgoraRTC.createClient({ mode: 'live', codec: 'vp8' });
  var rtc = {
    // For the local client.
    client: null,
    // For the local audio track.
    localAudioTrack: null,
  };

  var options = {
    // Pass your app ID here.
    appId: '8b5244443dd94ce2b08849e05eeb6598',
    // Set the channel name.
    channel: 'neospace',
    // Pass a token if your project enables the App Certificate.
    token:
      '0068b5244443dd94ce2b08849e05eeb6598IADgcO5nbfHp/n/1I1wskrU8R5YtWLVF60jbVLiOWSLnFwqFP28AAAAAEADIUmqkS7nAYAEAAQBKucBg',
  };

  async function startBasicCall() {
    /**
     * Put the following code snippets here.
     */
    rtc.client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    const uid = await rtc.client.join(
      options.appId,
      options.channel,
      options.token,
      null
    );
    // Create an audio track from the audio sampled by a microphone.
    rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    // Publish the local audio track to the channel.
    await rtc.client.publish([rtc.localAudioTrack]);

    console.log('publish success!');

    rtc.client.on('user-published', async (user, mediaType) => {
      // Subscribe to a remote user.
      await rtc.client.subscribe(user, mediaType);
      console.log('subscribe success');

      // If the subscribed track is audio.
      if (mediaType === 'audio') {
        // Get `RemoteAudioTrack` in the `user` object.
        const remoteAudioTrack = user.audioTrack;
        // Play the audio track. No need to pass any DOM element.
        remoteAudioTrack.play();
      }
    });
    rtc.client.on('user-unpublished', (user) => {
      // Get the dynamically created DIV container.
      const playerContainer = document.getElementById(user.uid);
      // Destroy the container.
      playerContainer.remove();
    });
  }
  async function leaveCall() {
    // Destroy the local audio and track.
    rtc.localAudioTrack.close();

    // Leave the channel.
    await rtc.client.leave();
  }
  //startBasicCall();
  return (
    <div className='App'>
      <button onClick={startBasicCall}>JOIN CALL</button>
      <button onClick={leaveCall}>End</button>
    </div>
  );
}
