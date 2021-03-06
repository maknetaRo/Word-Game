const showDefinition = document.querySelector(".definition");
const showWord = document.querySelector(".words");
const list1 = document.querySelector(".definitions");
const reload = document.querySelector(".reload");

let win = false;
const wordArr = [];
let randomWord = "";

const fetchDefinition = async () => {
  try {
    const random = await axios.get(
      "https://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=true&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&limit=3",
      {
        params: {
          api_key: "ecfgi1h25l9ial3uiqu4e201aaor7odzentfuf3ruogimb1dc",
        },
      }
    );

    const wordArr = random.data.map((x) => x.word);
    randomWord = wordArr[Math.floor(Math.random() * 3)];
    const definitionURL = `https://api.wordnik.com/v4/word.json/${randomWord}/definitions`;

    const wordDefinition = await axios.get(definitionURL, {
      params: {
        api_key: "ecfgi1h25l9ial3uiqu4e201aaor7odzentfuf3ruogimb1dc",
      },
    });
    return {
      word: randomWord,
      definitions: wordDefinition.data.map((x) => x.text),
      wordArr: wordArr,
    };
  } catch (e) {
    openErr();
    // create a button for reload with the timer, only when the timer is run out, you can click it.

    // start a timer for 30 seconds, within that timer block the requests and show the error by default.
  }
};

const definition = fetchDefinition().then((definitions) => {
  definitions.definitions.slice(0, 3).forEach((el) => {
    let elem = document.createElement("li");
    elem.classList.add("definition");
    elem.innerHTML = el;
    list1.appendChild(elem);
  });

  definitions.wordArr.forEach((el) => {
    let elem = document.createElement("li");
    elem.classList.add("wordsItem", "pointer");
    elem.innerHTML = el;

    elem.addEventListener("click", () => {
      if (el === randomWord && win === false) {
        win = true;
        elem.innerHTML = `${el} <br> That's right!`;
        elem.classList.add("win");
        elem.classList.remove("wordsItem");
        let restart = document.createElement("li");
        restart.classList.add("win", "pointer");
        restart.innerHTML = `Play again?`;
        elem.insertAdjacentElement("afterend", restart);
        restart.addEventListener("click", () => {
          location.reload();
        });
      } else {
        if (win === false) {
          elem.innerHTML = `${el} <br><br>That's not correct... <br> Try again!`;
          elem.classList.add("failure");
          elem.classList.remove("wordsItem");
          failure = true;
        }
      }
    });
    showWord.appendChild(elem);
  });
});

const modalBgErr = document.querySelector(".modalBgErr");

modalBgErr.style.display = "none";

const openErr = () => {
  modalBgErr.style.display = "block";
};

const closeErr = () => {
  modalBgErr.style.display = "none";
};

reload.addEventListener("click", () => {
  location.reload();
});
