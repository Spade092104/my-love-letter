const mailBtn = document.getElementById('openMailBtn');
const letterContainer = document.getElementById('letterContainer');
const envelopeWrapper = document.getElementById('envelopeWrapper');
const revealBtn = document.getElementById('revealBtn');
const photoReveal = document.getElementById('photoReveal');
const message = document.querySelector('.message');
const signature = document.querySelector('.signature');
const visitorCount = document.getElementById('visitorCount');

const getSessionCookie = () => {
  const match = document.cookie.match(/(?:^|; )loveLetterVisit=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

const setSessionCookie = () => {
  document.cookie = 'loveLetterVisit=seen; path=/; max-age=86400; SameSite=Lax';
};

const updateVisitorCount = async () => {
  if (getSessionCookie()) {
    visitorCount.textContent = '1';
    return;
  }

  const counterUrl = 'https://api.countapi.xyz/hit/my-love-letter/visits';

  try {
    const response = await fetch(counterUrl);
    const data = await response.json();
    visitorCount.textContent = Number(data.value || 0).toLocaleString();
    setSessionCookie();
  } catch (error) {
    visitorCount.textContent = '1';
    setSessionCookie();
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
