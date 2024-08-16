'use client'

import { useRouter, useParams } from 'next/navigation';
import { useRTCSocket } from '../../../hooks/useRTCSocket';

const Room = () => {
    const router = useRouter();
    const { id: roomName } = useParams();
    const {
        userVideoRef,
        peerVideoRef,
        micActive,
        cameraActive,
        peerConnected,
        toggleMic,
        toggleCamera,
        leaveRoom
    } = useRTCSocket(roomName);

    const handleLeave = () => {
        setTimeout(() => {
            router.push('/');
        });
        leaveRoom();
    };

    return (
        <div>
            <video autoPlay ref={userVideoRef} />
            <video autoPlay ref={peerVideoRef} />
            <button onClick={toggleMic} type="button">
                {micActive ? 'Mute Mic' : 'UnMute Mic'}
            </button>
            <button onClick={handleLeave} type="button">
                Leave
            </button>
            <button onClick={toggleCamera} type="button">
                {cameraActive ? 'Stop Camera' : 'Start Camera'}
            </button>
        </div>
    );
};

export default Room;