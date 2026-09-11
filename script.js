const mailBtn = document.getElementById('openMailBtn');
const letterContainer = document.getElementById('letterContainer');
const envelopeWrapper = document.getElementById('envelopeWrapper');
const revealBtn = document.getElementById('revealBtn');
const photoReveal = document.getElementById('photoReveal');
const message = document.querySelector('.message');
const signature = document.querySelector('.signature');
const visitorCount = document.getElementById('visitorCount');

const updateVisitorCount = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/visits');
    const data = await response.json();
    visitorCount.textContent = Number(data.total || 0).toLocaleString();
  } catch (error) {
    visitorCount.textContent = '0';
  }
};

const openLetter = () => {
  envelopeWrapper.classList.add('opened');
  letterContainer.classList.remove('hidden');
  letterContainer.classList.add('visible');
  mailBtn.disabled = true;
  mailBtn.style.opacity = '0.7';

  setTimeout(() => {
    message.classList.add('visible');
    signature.classList.add('visible');
  }, 300);
};

const loadLiveVisitorCount = async () => {
  await updateVisitorCount();

  const eventSource = new EventSource('http://localhost:3000/events');
  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    visitorCount.textContent = Number(data.total || 0).toLocaleString();
  };
  eventSource.onerror = () => {
    visitorCount.textContent = '0';
  };
};

mailBtn.addEventListener('click', openLetter);
loadLiveVisitorCount();

revealBtn.addEventListener('click', () => {
  message.classList.toggle('hidden');
  signature.classList.toggle('hidden');

  requestAnimationFrame(() => {
    message.classList.toggle('visible');
    signature.classList.toggle('visible');
  });

  photoReveal.classList.remove('hidden-photo');
  photoReveal.classList.add('visible-photo');

  revealBtn.textContent = 'I love you endlessly';
  revealBtn.disabled = true;
  revealBtn.style.opacity = '0.9';
});

const hearts = document.querySelectorAll('.bg-hearts span');
hearts.forEach((heart, index) => {
  heart.style.animationDelay = `${index * 0.7}s`;
  heart.style.fontSize = `${1.5 + index * 0.2}rem`;
});
