import { useState, useEffect } from 'react';
import socket from '../socket/socket';

const useMediaRecorder = () => {
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [recordedUrl, setRecordedUrl] = useState<string>("");
    const [result, setResult] = useState<string>("");
    const [isConnected, setIsConnected] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        socket.on("translationResult", (data: string) => {
            console.log("Received translation result from server:", data);
            setResult(data);
            setIsLoading(false);
        });
        function onConnect() {
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
        }
        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        return () => {
            if (mediaRecorder) {
                mediaRecorder.stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
            }
            socket.off("translationResult");
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
        }
    }, []);

    useEffect(() => {
        if (navigator.mediaDevices) {
            console.log("getUserMedia supported.");

            const constraints = { audio: true };
            let chunks: BlobPart[] = [];
            navigator.mediaDevices
                .getUserMedia(constraints)
                .then((stream: MediaStream) => {
                    const mediaRecorder = new MediaRecorder(stream);
                    setMediaRecorder(mediaRecorder);
                    mediaRecorder.onstop = (e: Event) => {
                        const blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
                        chunks = [];
                        const audioURL = window.URL.createObjectURL(blob);
                        setRecordedUrl(audioURL);
                    }
                    mediaRecorder.ondataavailable = (e: BlobEvent) => {
                        setIsLoading(true);
                        socket.emit("translate", e.data);
                        chunks.push(e.data);
                    };
                }).catch((err: unknown) => {
                    console.error('The following getUserMedia error occurred: ' + err);
                });
        }
    }, []);

    const startRecording = () => {
        if (mediaRecorder) {
            setIsRecording(true);
            mediaRecorder.start();
            console.log(mediaRecorder.state);
            console.log("recorder started");
        }
    }

    const stopRecording = () => {
        if (mediaRecorder) {
            setIsRecording(false);
            mediaRecorder.stop();
            console.log(mediaRecorder.state);
            console.log("recorder stopped");
        }
    }

    return {
        mediaRecorder,
        recordedUrl,
        startRecording,
        stopRecording,
        result,
        isConnected,
        isRecording,
        isLoading
    }
}

export default useMediaRecorder;