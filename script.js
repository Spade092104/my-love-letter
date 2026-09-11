const mailBtn = document.getElementById('openMailBtn');
const letterContainer = document.getElementById('letterContainer');
const envelopeWrapper = document.getElementById('envelopeWrapper');
const revealBtn = document.getElementById('revealBtn');
const photoReveal = document.getElementById('photoReveal');
const message = document.querySelector('.message');
const signature = document.querySelector('.signature');
const visitorCount = document.getElementById('visitorCount');

const updateVisitorCount = () => {
  const countKey = 'loveLetterVisitorCount';
  const currentCount = Number(localStorage.getItem(countKey) || 0);
  const nextCount = currentCount + 1;

  localStorage.setItem(countKey, String(nextCount));
  visitorCount.textContent = nextCount.toLocaleString();
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

mailBtn.addEventListener('click', openLetter);
updateVisitorCount();

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
