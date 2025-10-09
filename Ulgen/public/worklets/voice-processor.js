class VoiceProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const input = inputs[0];
    if (input && input[0]) {
      // Mono kanal verisini ana threade gönder
      this.port.postMessage(input[0]);
    }
    return true; // çalışmaya devam et
  }
}

registerProcessor('voice-processor', VoiceProcessor);
