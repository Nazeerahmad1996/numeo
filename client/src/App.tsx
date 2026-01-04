// import { useState } from 'react'

import './App.css'
import useMediaRecorder from './hook/useMediaRecorder';

function App() {
  const { recordedUrl, startRecording, stopRecording, result, isConnected, isRecording } = useMediaRecorder();
  return (
    <div className="App">
      {isConnected ? (
        <p>Connected</p>
      ) : (
        <p>Not Connected</p>
      )}
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px', alignItems: 'center', justifyContent: 'center' }}>
        <button onClick={startRecording} disabled={isRecording}>
          Start Recording
        </button>
        <button onClick={stopRecording} disabled={!isRecording}>
          Stop Recording
        </button>
        {isRecording && <p>Recording...</p>}
        {!isRecording && recordedUrl && (
          <audio src={recordedUrl} controls />
        )}

      </div>
      {result && <p>Translation: {result}</p>}
    </div>
  )
}

export default App
