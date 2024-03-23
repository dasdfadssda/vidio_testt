import React, { useState, useRef } from "react";

function App() {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const videoRef = useRef();

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: { mediaSource: "screen" },
    });
    const recorder = new MediaRecorder(stream);
    const chunks = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = async () => {
      const completeBlob = new Blob(chunks, { type: chunks[0].type });
      videoRef.current.src = URL.createObjectURL(completeBlob);

      // MP4 다운로드 기능 추가
      const videoURL = window.URL.createObjectURL(completeBlob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = videoURL;
      a.download = "recorded-video.mp4"; // MP4 형식으로 다운로드될 파일명 설정
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(videoURL);
    };

    recorder.start();
    setRecording(true);
    setMediaRecorder(recorder);
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    setRecording(false);
  };

  return (
    <div>
      <button onClick={startRecording} disabled={recording}>
        녹화 시작
      </button>
      <button onClick={stopRecording} disabled={!recording}>
        녹화 중지
      </button>
      <video ref={videoRef} controls></video>
    </div>
  );
}

export default App;
