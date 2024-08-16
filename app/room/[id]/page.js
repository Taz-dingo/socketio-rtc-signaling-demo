'use client'

import { useRouter, useParams } from 'next/navigation';
import useRtcSocket from '../../../hooks/useRtcSocket';

const Room = () => {
    const { id: roomName } = useParams();
    const router = useRouter();
    const {
        micActive,
        cameraActive,
        toggleMic,
        toggleCamera,
        leaveRoom,
        userVideoRef,
        peerVideoRef,
    } = useRtcSocket(roomName);

    const handleLeaveRoom = () => {
        leaveRoom();
        router.push('/');
    };

    return (
        <div>
            <video autoPlay ref={userVideoRef} />
            <video autoPlay ref={peerVideoRef} />
            <button onClick={toggleMic} type="button">
                {micActive ? 'Mute Mic' : 'UnMute Mic'}
            </button>
            <button onClick={handleLeaveRoom} type="button">
                Leave
            </button>
            <button onClick={toggleCamera} type="button">
                {cameraActive ? 'Stop Camera' : 'Start Camera'}
            </button>
        </div>
    );
};

export default Room;
