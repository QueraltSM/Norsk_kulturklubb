function changeLanguage(languageCode) {
  var isUpperCase = localStorage.getItem("keyboard_is_uppercase") === "true";
  switch (languageCode) {
    case "no":
      document.getElementById("keyboard_language").textContent = "Norweigan";
      virtual_keyboard.setOptions({
        layout: {
          default: isUpperCase
            ? [
                "Q W E R T Y U I O P Å",
                "A S D F G H J K L Ø Æ",
                "Z X C V B N M",
              ]
            : [
                "q w e r t y u i o p å",
                "a s d f g h j k l ø æ",
                "z x c v b n m",
              ],
        },
      });
      break;
    case "es":
      document.getElementById("keyboard_language").textContent = "Español";
      virtual_keyboard.setOptions({
        layout: {
          default: isUpperCase
            ? ["Q W E R T Y U I O P", "A S D F G H J K L Ñ", "Z X C V B N M"]
            : ["q w e r t y u i o p", "a s d f g h j k l ñ", "z x c v b n m"],
        },
      });
      break;
    case "fr":
      document.getElementById("keyboard_language").textContent = "Français";
      virtual_keyboard.setOptions({
        layout: {
          default: isUpperCase
            ? ["A Z E R T Y U I O P", "Q S D F G H J K L M", "W X C V B N"]
            : [
                "a z e r t y u i o p",
                "q s d f g h j k l m",
                "w x c v b n é è ç à ù",
              ],
        },
      });
      break;
    case "de":
      document.getElementById("keyboard_language").textContent = "Deutsch";
      virtual_keyboard.setOptions({
        layout: {
          default: isUpperCase
            ? [
                "Q W E R T Z U I O P Ü",
                "A S D F G H J K L Ö Ä",
                "Y X C V B N M",
              ]
            : [
                "q w e r t z u i o p ü",
                "a s d f g h j k l ö ä",
                "y x c v b n m ß",
              ],
        },
      });
      break;
    case "it":
      document.getElementById("keyboard_language").textContent = "Italiano";
      virtual_keyboard.setOptions({
        layout: {
          default: isUpperCase
            ? [
                "Q W E R T Y U I O P È +",
                "A S D F G H J K L Ì Ò À",
                "Z X C V B N M",
              ]
            : [
                "q w e r t y u i o p è ù",
                "a s d f g h j k l ì ò à",
                "z x c v b n m",
              ],
        },
      });
      break;
    case "pt":
      document.getElementById("keyboard_language").textContent = "Português";
      virtual_keyboard.setOptions({
        layout: {
          default: isUpperCase
            ? ["Q W E R T Y U I O P", "A S D F G H J K L Ç", "Z X C V B N M"]
            : ["q w e r t y u i o p", "a s d f g h j k l ç", "z x c v b n m"],
        },
      });
      break;
    case "nl":
      document.getElementById("keyboard_language").textContent = "Nederlands";
      virtual_keyboard.setOptions({
        layout: {
          default: isUpperCase
            ? ["Q W E R T Y U I O P", "A S D F G H J K L", "Z X C V B N M"]
            : ["q w e r t y u i o p", "a s d f g h j k l", "z x c v b n m"],
        },
      });
      break;
    case "pl":
      document.getElementById("keyboard_language").textContent = "Polski";
      virtual_keyboard.setOptions({
        layout: {
          default: isUpperCase
            ? [
                "Q W E R T Y U I O P ń ć ź",
                "A S D F G H J K L Ł ę",
                "Z X C V B N M",
              ]
            : [
                "q w e r t y u i o p ż ś ó",
                "a s d f g h j k l ł ą",
                "z x c v b n m",
              ],
        },
      });
      break;
    case "ru":
      document.getElementById("keyboard_language").textContent = "Русский";
      virtual_keyboard.setOptions({
        layout: {
          default: isUpperCase
            ? [
                "Й Ц У К Е Н Г Ш Щ З Х ъ",
                "Ф Ы В А П Р О Л Д Ж Э",
                "Я Ч С М И Т Ь Б Ю Ё",
              ]
            : [
                "й ц у к е н г ш щ з х ъ",
                "ф ы в а п р о л д ж э",
                "я ч с м и т ь б ю ё",
              ],
        },
      });
      break;
    case "tr":
      document.getElementById("keyboard_language").textContent = "Türkçe";
      virtual_keyboard.setOptions({
        layout: {
          default: isUpperCase
            ? [
                "F G Ğ I O D R N H P Q W X",
                "U İ E A Ü T K M L Y Ş",
                "J Ö V C Ç Z S B",
              ]
            : [
                "f g ğ ı o d r n h p q w x",
                "u i e a ü t k m l y ş",
                "j ö v c ç z s b",
              ],
        },
      });
      break;

    case "sv":
      document.getElementById("keyboard_language").textContent = "Svenska";
      virtual_keyboard.setOptions({
        layout: {
          default: isUpperCase
            ? [
                "Q W E R T Y U I O P Å",
                "A S D F G H J K L Ö Ä",
                "Z X C V B N M",
              ]
            : [
                "q w e r t y u i o p å",
                "a s d f g h j k l ö ä",
                "z x c v b n m",
              ],
        },
      });
      break;
    case "da":
      document.getElementById("keyboard_language").textContent = "Dansk";
      virtual_keyboard.setOptions({
        layout: {
          default: isUpperCase
            ? [
                "Q W E R T Y U I O P Å",
                "A S D F G H J K L Æ Ø",
                "Z X C V B N M",
              ]
            : [
                "q w e r t y u i o p å",
                "a s d f g h j k l æ ø",
                "z x c v b n m",
              ],
        },
      });
      break;
    case "fi":
      document.getElementById("keyboard_language").textContent = "Suomi";
      virtual_keyboard.setOptions({
        layout: {
          default: !isUpperCase
            ? [
                "Q W E R T Y U I O P Å",
                "A S D F G H J K L Ö Ä",
                "Z X C V B N M",
              ]
            : [
                "q w e r t y u i o p å",
                "a s d f g h j k l ö ä",
                "z x c v b n m",
              ],
        },
      });
      break;
    default:
      document.getElementById("keyboard_language").textContent = "English";
      virtual_keyboard.setOptions({
        layout: {
          default: isUpperCase
            ? ["Q W E R T Y U I O P", "A S D F G H J K L", "Z X C V B N M"]
            : ["q w e r t y u i o p", "a s d f g h j k l", "z x c v b n m"],
        },
      });
      break;
  }
}

function onChange(input) {
  document.querySelector(".input").value = input;
}

let layoutName = "default";

function onKeyPress(button) {
  setTimeout(() => {
    document.getElementById("text").focus();
  }, 100);
  document.getElementById("text").value =
    document.getElementById("text").value + button;
  if (button === "{shift}" || button === "{shiftactivated}") {
    layoutName = layoutName === "default" ? "shift" : "default";
    virtual_keyboard.setOptions({ layoutName: layoutName });
  }
}

function adjustTextareaHeight() {
  var textarea = document.getElementById("text");
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
}

function translateText() {
  var english_tab = document
    .getElementById("english_tab")
    .classList.contains("active");
  var norweigan_tab = document
    .getElementById("norweigan_tab")
    .classList.contains("active");
  var others_tab = document
    .getElementById("others_tab")
    .classList.contains("active");
  var target_language = "";
  if (english_tab) {
    target_language = "en";
  } else if (norweigan_tab) {
    target_language = "no";
  } else if (others_tab) {
    target_language = localStorage.getItem("selected_language");
  }
  var source_language = "";
  const text = document.getElementById("text").value;
  fetch(
    `http://localhost:3000/api/detectLanguage?text=${encodeURIComponent(text)}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("No se pudo realizar la solicitud al servidor");
      }
      return response.json();
    })
    .then((data) => {
      source_language = data.detectedLanguage;
      fetch(
        `http://localhost:3000/api/translateText?text=${text}&SourceLanguageCode=${source_language}&TargetLanguageCode=${target_language}`
      )
        .then((response) => response.json())
        .then((data) => {
          document.getElementById("translated_text").innerText =
            data.translatedText;
        })
        .catch((error) => {
          document.getElementById("translated_text").innerText = "Error";
        });
    })
    .catch((error) => {
      alert("Error:" + error);
    });
}
