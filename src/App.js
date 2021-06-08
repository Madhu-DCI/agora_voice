import React, { useState } from 'react';
import Agora from 'agora-rtc-sdk';
export default function AgoraVoice() {
  const [client, setClient] = useState(null);
  const [uid, setUid] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const join = () => {
    let chanalName = 'abc';
    let clientInstance = Agora.createClient({ mode: 'rtc', codec: 'h264' });

    clientInstance.init('6d76263dbe5f40339c641441bb6b7987', () => {
      clientInstance.join(null, chanalName, null, (uid) => {
        let localStreamInstance = Agora.createStream({
          streamID: uid,
          audio: true,
          video: false,
          screen: false,
        });
        setLocalStream(localStreamInstance);
        localStreamInstance.init(() => {
          clientInstance.publish(localStreamInstance);
          localStreamInstance.play('local_stream');
        });

        clientInstance.on('stream-added', (evt) => {
          let remoteStream = evt.stream;
          const id = remoteStream.getId();
          client.subscribed(remoteStream);
        });

        clientInstance.on('stream-subscribed', (evt) => {
          let remoteStream = evt.stream;
          remoteStream.play('remote_stream');
        });
      });
    });
    setClient(clientInstance);
  };
  return (
    <div className='App'>
      <button onClick={join}>JOIN CALL</button>
      <div id='local_stream'></div>
      <div id='remote_stream'></div>
    </div>
  );
}
