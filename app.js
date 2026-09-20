const animals = [
  {
    name: 'American Robin',
    scientific: 'Turdus migratorius',
    kind: 'Bird',
    icon: '🐦',
    description: 'Warm, cheerful dawn calls echo through open woodlands and suburban edges.',
    baseFrequency: 660,
    wave: 'triangle',
    pattern: [0, 2, 5, 3, 0]
  },
  {
    name: 'White-tailed Deer',
    scientific: 'Odocoileus virginianus',
    kind: 'Mammal',
    icon: '🦌',
    description: 'Alert snorts and rustling footsteps hint at movement near woodland trails.',
    baseFrequency: 180,
    wave: 'sine',
    pattern: [0, 1, 2, 1, 0]
  },
  {
    name: 'Monarch Butterfly',
    scientific: 'Danaus plexippus',
    kind: 'Insect',
    icon: '🦋',
    description: 'Delicate wingbeats and soft motion create a quiet summer meadow soundscape.',
    baseFrequency: 540,
    wave: 'sawtooth',
    pattern: [0, 3, 5, 3, 0]
  },
  {
    name: 'Barred Owl',
    scientific: 'Strix varia',
    kind: 'Bird',
    icon: '🦉',
    description: 'Deep, rhythmic calls drift through the forest at dusk and after sunset.',
    baseFrequency: 240,
    wave: 'square',
    pattern: [0, 1, 2, 0, 1]
  },
  {
    name: 'Gray Squirrel',
    scientific: 'Sciurus carolinensis',
    kind: 'Mammal',
    icon: '🐿️',
    description: 'A quick burst of chatter cuts across a quiet canopy in the afternoon.',
    baseFrequency: 310,
    wave: 'triangle',
    pattern: [0, 1, 4, 2, 0]
  },
  {
    name: 'Cricket Chorus',
    scientific: 'Gryllidae spp.',
    kind: 'Insect',
    icon: '🦗',
    description: 'A layered evening chorus rises and settles with the cool nighttime air.',
    baseFrequency: 900,
    wave: 'square',
    pattern: [0, 3, 6, 4, 2]
  }
];

const animalList = document.getElementById('animal-list');

function renderAnimals() {
  animalList.innerHTML = animals
    .map(
      (animal) => `
        <article class="animal-card">
          <div class="animal-top">
            <div class="animal-icon" aria-hidden="true">${animal.icon}</div>
            <div class="animal-meta">
              <h4>${animal.name}</h4>
              <p>${animal.scientific}</p>
            </div>
          </div>
          <p>${animal.description}</p>
          <div class="card-actions">
            <button class="play-button" type="button" data-name="${animal.name}">Play sound</button>
            <span class="tag">${animal.kind}</span>
          </div>
        </article>
      `
    )
    .join('');

  document.querySelectorAll('.play-button').forEach((button) => {
    button.addEventListener('click', () => {
      const animal = animals.find((item) => item.name === button.dataset.name);
      playSoundPreview(animal);
    });
  });
}

function playSoundPreview(animal) {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) {
    return;
  }

  const ctx = new AudioCtx();
  const master = ctx.createGain();
  master.gain.value = 0.08;
  master.connect(ctx.destination);

  const start = ctx.currentTime;

  animal.pattern.forEach((offset, index) => {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    const delay = index * 0.18;

    oscillator.type = animal.wave;
    oscillator.frequency.setValueAtTime(animal.baseFrequency + offset * 24, start + delay);

    gain.gain.setValueAtTime(0.0001, start + delay);
    gain.gain.exponentialRampToValueAtTime(0.12, start + delay + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + delay + 0.24);

    oscillator.connect(gain);
    gain.connect(master);
    oscillator.start(start + delay);
    oscillator.stop(start + delay + 0.3);
  });

  setTimeout(() => ctx.close(), 600);
}

renderAnimals();
