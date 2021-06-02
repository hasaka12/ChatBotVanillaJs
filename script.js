const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");

const BOT_IMG = "bot.png";
const PERSON_IMG = "child.png";
const BOT_NAME = "CHAI BOT";
const PERSON_NAME = "ME";
const ENDPOINT = 'https://segoht28o9.execute-api.us-east-1.amazonaws.com/Predict/296faa51-2501-4855-b4ba-677e6c276915';

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();

mic.continuous = true;
mic.interimResults = true;
mic.lang = 'en-US';

let isEnableSpeak = true;
let isListening = false;

msgerForm.addEventListener("submit", event => {
  event.preventDefault();

  const msgText = msgerInput.value;
  if (!msgText) return;

  appendMessage(PERSON_NAME, PERSON_IMG, "right", msgText);
  msgerInput.value = "";

  botResponse();
  if (isListening) {
    document.getElementById("listning-btn").onclick();
  }
});

function handleListning(x) {
  x.classList.toggle("fa-microphone-slash");
  console.log('yoo');
    isListening = !isListening;
    if (isListening) {
      mic.start();
    } else {
      mic.stop();
    }

    mic.onresult = event => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      msgerInput.value = transcript;
      mic.onerror = eventEr => {
        mic.stop();
        isListening = false;
        console.error(eventEr.error);
      };
    };
  };

function handleSpeak(x) {
  isEnableSpeak = !isEnableSpeak;
  x.classList.toggle("fa-volume-up");
}

function handleClear() {
  window.location.reload(true);
}

function appendMessage(name, img, side, text) {
  const msgHTML = `
    <div class="msg ${side}-msg">
      <div class="msg-img" style="background-image: url(${img})"></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>

        <div class="msg-text">${text}</div>
      </div>
    </div>
  `;

  msgerChat.insertAdjacentHTML("beforeend", msgHTML);
  msgerChat.scrollTop += 500;
}

const botResponse = async () => {
  try {
      const url = ENDPOINT;
      var reqBody = `{"sentence":"${msgerInput.value}"}`;
      const res = await fetch(url, {
        method: 'POST',
        body: reqBody,
      })
      .then(re => re.json())
      .then(response => JSON.parse(response.body))
      .then(function(data) {
        return data;
      })
      .catch(err => console.log('err', err));

      if (res && res.predicted_label) {
        appendMessage(BOT_NAME, BOT_IMG, "left", res.predicted_label);
        if (isEnableSpeak) {
          speakChaiBot(res.predicted_label);
        }
      }
    } catch (err) {
      console.error(err);
    }
}

// Utils
function get(selector, root = document) {
  return root.querySelector(selector);
}

function getId(selector, root = document) {
  return root.getElementById(selector);
}

function formatDate(date) {
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();

  return `${h.slice(-2)}:${m.slice(-2)}`;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function speakChaiBot (text) {
  if ('speechSynthesis' in window) {
    const synthesis = window.speechSynthesis;
    const voice = synthesis.getVoices()[20];
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.voice = voice;
    utterance.pitch = 0.9;
    utterance.rate = 0.7;
    utterance.volume = 0.9;

    synthesis.speak(utterance);
  }
};
