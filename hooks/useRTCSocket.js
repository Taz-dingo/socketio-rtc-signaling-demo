'use client'

import { useEffect, useRef, useState } from 'react';
import { useSocket } from './useSocket'; // 引入 useSocket

const ICE_SERVERS = {
    iceServers: [
        {
            urls: 'stun:openrelay.metered.ca:80',
        }
    ],
};

export const useRTCSocket = (roomName) => {
    const [micActive, setMicActive] = useState(true);
    const [cameraActive, setCameraActive] = useState(true);

    const userVideoRef = useRef();
    const peerVideoRef = useRef();
    const rtcConnectionRef = useRef(null);
    const userStreamRef = useRef();
    const hostRef = useRef(false);

    const socket = useSocket(); // 使用 SocketContext 提供的 socket 实例

    useEffect(() => {
        
        if (socket) {
            // socket.on('connect', () => {
            //     console.log('Socket connected');
            //     socket.emit('join', roomName);
            // });
            console.log('Socket connected');
            socket.emit('join', roomName);

            socket.on('joined', handleRoomJoined);
            socket.on('created', handleRoomCreated);
            socket.on('ready', initiateCall);
            socket.on('leave', onPeerLeave);
            socket.on('full', () => {
                window.location.href = '/';
            });
            socket.on('offer', handleReceivedOffer);
            socket.on('answer', handleAnswer);
            socket.on('ice-candidate', handlerNewIceCandidateMsg);
        } else {
            console.log("socket unavailable")
        }

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [socket, roomName]);

    const handleRoomJoined = () => {
        navigator.mediaDevices
            .getUserMedia({
                audio: true,
                video: { width: 500, height: 500 },
            })
            .then((stream) => {
                userStreamRef.current = stream;
                userVideoRef.current.srcObject = stream;
                userVideoRef.current.onloadedmetadata = () => {
                    userVideoRef.current.play();
                };
                socket.emit('ready', roomName);
            })
            .catch((err) => {
                console.log('error', err);
            });
    };

    const handleRoomCreated = () => {
        hostRef.current = true;
        navigator.mediaDevices
            .getUserMedia({
                audio: true,
                video: { width: 500, height: 500 },
            })
            .then((stream) => {
                userStreamRef.current = stream;
                userVideoRef.current.srcObject = stream;
                userVideoRef.current.onloadedmetadata = () => {
                    userVideoRef.current.play();
                };
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const initiateCall = () => {
        if (hostRef.current) {
            rtcConnectionRef.current = createPeerConnection();
            rtcConnectionRef.current.addTrack(
                userStreamRef.current.getTracks()[0],
                userStreamRef.current,
            );
            rtcConnectionRef.current.addTrack(
                userStreamRef.current.getTracks()[1],
                userStreamRef.current,
            );
            rtcConnectionRef.current
                .createOffer()
                .then((offer) => {
                    rtcConnectionRef.current.setLocalDescription(offer);
                    socket.emit('offer', offer, roomName);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const onPeerLeave = () => {
        hostRef.current = true;
        if (peerVideoRef.current.srcObject) {
            peerVideoRef.current.srcObject
                .getTracks()
                .forEach((track) => track.stop());
        }

        if (rtcConnectionRef.current) {
            rtcConnectionRef.current.ontrack = null;
            rtcConnectionRef.current.onicecandidate = null;
            rtcConnectionRef.current.close();
            rtcConnectionRef.current = null;
        }
    };

    const createPeerConnection = () => {
        const connection = new RTCPeerConnection(ICE_SERVERS);
        connection.onicecandidate = handleICECandidateEvent;
        connection.ontrack = handleTrackEvent;
        return connection;
    };

    const handleReceivedOffer = (offer) => {
        if (!hostRef.current) {
            rtcConnectionRef.current = createPeerConnection();
            rtcConnectionRef.current.addTrack(
                userStreamRef.current.getTracks()[0],
                userStreamRef.current,
            );
            rtcConnectionRef.current.addTrack(
                userStreamRef.current.getTracks()[1],
                userStreamRef.current,
            );
            rtcConnectionRef.current.setRemoteDescription(offer);

            rtcConnectionRef.current
                .createAnswer()
                .then((answer) => {
                    rtcConnectionRef.current.setLocalDescription(answer);
                    socket.emit('answer', answer, roomName);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const handleAnswer = (answer) => {
        rtcConnectionRef.current
            .setRemoteDescription(answer)
            .catch((err) => console.log(err));
    };

    const handleICECandidateEvent = (event) => {
        if (event.candidate) {
            socket.emit('ice-candidate', event.candidate, roomName);
        }
    };

    const handlerNewIceCandidateMsg = (incoming) => {
        const candidate = new RTCIceCandidate(incoming);
        rtcConnectionRef.current
            .addIceCandidate(candidate)
            .catch((e) => console.log(e));
    };

    const handleTrackEvent = (event) => {
        if (peerVideoRef.current) {
            peerVideoRef.current.srcObject = event.streams[0];
        } else {
            console.error('peerVideoRef.current 是 undefined');
        }
    };

    const toggleMediaStream = (type, state) => {
        userStreamRef.current.getTracks().forEach((track) => {
            if (track.kind === type) {
                track.enabled = !state;
            }
        });
    };

    const toggleMic = () => {
        toggleMediaStream('audio', micActive);
        setMicActive((prev) => !prev);
    };

    const toggleCamera = () => {
        toggleMediaStream('video', cameraActive);
        setCameraActive((prev) => !prev);
    };

    const leaveRoom = () => {
        socket.emit('leave', roomName);
        if (userVideoRef.current.srcObject) {
            userVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        }
        if (peerVideoRef.current.srcObject) {
            peerVideoRef.current.srcObject
                .getTracks()
                .forEach((track) => track.stop());
        }

        if (rtcConnectionRef.current) {
            rtcConnectionRef.current.ontrack = null;
            rtcConnectionRef.current.onicecandidate = null;
            rtcConnectionRef.current.close();
        }
    };

    return {
        micActive,
        cameraActive,
        toggleMic,
        toggleCamera,
        leaveRoom,
        userVideoRef,
        peerVideoRef,
    };
};
