const s = (p) => {
  let demo4Shader, img, d_map, fft, audio, toggleBtn;
  let isAudioPlaying = false;

  p.preload = () => {
    audio = p.loadSound('audio/demo4.mp3');
    demo4Shader = p.loadShader('shaders/base.vert', 'shaders/d4.frag');
    img = p.loadImage('img/Texture1.png');
    d_map = p.loadImage('img/clouds.jpg');
  }

  p.setup = () => {
    p.pixelDensity(1);
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);

    toggleBtn = document.querySelector('#toggle-btn');
    toggleBtn.addEventListener('click', toggleAudio);

    fft = new p5.FFT();
    p.shader(demo4Shader);
    demo4Shader.setUniform('u_resolution', [p.windowWidth, p.windowHeight]);
    demo4Shader.setUniform('d_map', d_map);
    demo4Shader.setUniform('img', img);
    demo4Shader.setUniform('u_tResolution', [img.width, img.height]);

    // Don't start audio initially
    isAudioPlaying = false;
  }

  p.draw = () => {
    p.background(0);

    let bass = 0;
    let mid = 0;

    if (isAudioPlaying) {
      fft.analyze();
      bass = fft.getEnergy("bass");
      mid = fft.getEnergy("mid");
    }

    const mapBass = p.map(bass, 0, 255, 0, 0.02);
    const mapMid = p.map(mid, 0, 70, 0, 10.001);

    const tc = isAudioPlaying ? p.map(audio.currentTime(), 0, audio.duration(), 2.0, 2.0) : p.frameCount * 0.01;
    demo4Shader.setUniform('u_time', tc);
    demo4Shader.setUniform('u_bass', mapBass);
    demo4Shader.setUniform('u_mid', mapMid);

    p.rect(0, 0, p.width, p.height);
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    demo4Shader.setUniform('u_resolution', [p.windowWidth, p.windowHeight]);
  }

  function toggleAudio() {
    isAudioPlaying = !isAudioPlaying;
    if (isAudioPlaying) {
      audio.loop();
      toggleBtn.classList.add('toggle--on');
    } else {
      audio.pause();
      toggleBtn.classList.remove('toggle--on');
    }
  }
};

new p5(s);
