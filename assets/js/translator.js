function changeLanguage(languageCode) {
  switch (languageCode) {
    case "no":
      myKeyboard.setOptions({
        layout: {
          default: [
            "q w e r t y u i o p å",
            "a s d f g h j k l ø æ",
            "z x c v b n m",
            "", 
            "Q W E R T Y U I O P Å",
            "A S D F G H J K L Ø Æ",
            "Z X C V B N M",
          ],
        },
      });
      break;
    case "fr":
      myKeyboard.setOptions({
        layout: {
          default: [
            "a z e r t y u i o p",
            "q s d f g h j k l m",
            "", 
            "A Z E R T Y U I O P",
            "Q S D F G H J K L M",
          ],
        },
      });
      break;
    case "sv":
      myKeyboard.setOptions({
        layout: {
          default: [
            "a s d f g h j k l ö",
            "z x c v b n m",
            "q w e r t y u i o p å",
            "", 
            "A S D F G H J K L Ö",
            "Z X C V B N M",
            "Q W E R T Y U I O P Å",
          ],
        },
      });
      break;
    case "da":
      myKeyboard.setOptions({
        layout: {
          default: [
            "a b c d e f g h i j",
            "k l m n o p q r s t",
            "u v w x y z æ ø å",
            "", 
            "A B C D E F G H I J",
            "K L M N O P Q R S T",
            "U V W X Y Z Æ Ø Å",
          ],
        },
      });
      break;
    case "fi":
      myKeyboard.setOptions({
        layout: {
          default: [
            "a s d f g h j k l",
            "z x c v b n m",
            "q w e r t y u i o p å",
            "", 
            "A S D F G H J K L",
            "Z X C V B N M",
            "Q W E R T Y U I O P Å",
          ],
        },
      });
      break;

    case "it":
      myKeyboard.setOptions({
        layout: {
          default: [
            "q w e r t y u i o p è +",
            "a s d f g h j k l ò à",
            "z x c v b n m",
            "", 
            "Q W E R T Y U I O P È",
            "A S D F G H J K L Ò À",
            "Z X C V B N M",
          ],
        },
      });
      break;
    case "pt":
      myKeyboard.setOptions({
        layout: {
          default: [
            "a s d f g h j k l ç",
            "z x c v b n m",
            "q w e r t y u i o p",
            "", 
            "A S D F G H J K L Ç",
            "Z X C V B N M",
            "Q W E R T Y U I O P",
          ],
        },
      });
      break;
    case "nl":
      myKeyboard.setOptions({
        layout: {
          default: [
            "q w e r t y u i o p",
            "a s d f g h j k l",
            "z x c v b n m",
            "", 
            "Q W E R T Y U I O P",
            "A S D F G H J K L",
            "Z X C V B N M",
          ],
        },
      });
      break;

    case "pl":
      myKeyboard.setOptions({
        layout: {
          default: [
            "a ą s ś d ę f g h j",
            "k ł z ź c ć v b n m",
            "", 
            "A Ą S Ś D Ę F G H J",
            "K Ł Z Ź C Ć V B N",
            "M < > ?",
          ],
        },
      });
      break;
    case "ru":
      myKeyboard.setOptions({
        layout: {
          default: [
            "й ц у к е н г ш щ з х ъ",
            "ф ы в а п р о л д ж э",
            "я ч с м и т ь б ю",
            "", 
            "Й Ц У К Е Н Г Ш Щ З Х Ъ",
            "Ф Ы В А П Р О Л Д Ж Э",
            "Я Ч С М И Т Ь Б Ю",
          ],
        },
      });
      break;
    case "zh":
      myKeyboard.setOptions({
        layout: {
          default: [
            "， ； 、 。 ？ ！",
            "1 2 3 4 5 6 7 8 9 0",
            "q w e r t y u i o p",
            "a s d f g h j k l",
            "z x c v b n m",
          ],
        },
      });
      break;
    case "zh-TW":
      myKeyboard.setOptions({
        layout: {
          default: [
            "， ； 、 。 ？ ！",
            "1 2 3 4 5 6 7 8 9 0",
            "q w e r t y u i o p",
            "a s d f g h j k l",
            "z x c v b n m",
          ],
        },
      });
      break;
    case "ja":
      myKeyboard.setOptions({
        layout: {
          default: [
            "1 2 3 4 5 6 7 8 9 0",
            "q w e r t y u i o p @",
            "a s d f g h j k l ;",
            "z x c v b n m , .",
          ],
        },
      });
      break;
    case "ko":
      myKeyboard.setOptions({
        layout: {
          default: [
            "1 2 3 4 5 6 7 8 9 0",
            "ㅂ ㅈ ㄷ ㄱ ㅅ ㅛ ㅕ ㅑ ㅐ ㅔ",
            "ㅁ ㄴ ㅇ ㄹ ㅎ ㅗ ㅓ ㅏ ㅣ",
            "ㅋ ㅌ ㅊ ㅍ ㅠ ㅜ ㅡ",
          ],
        },
      });
      break;

    case "ar":
      myKeyboard.setOptions({
        layout: {
          default: [
            "ض ص ث ق ف غ ع ه خ ح ج",
            "ش س ي ب ل ا ت ن م ك",
            "ء ئ ؤ ر لا",
          ],
        },
      });
      break;
    case "tr":
      myKeyboard.setOptions({
        layout: {
          default: [
            "q w e r t y u i o p",
            "ğ ü ı o ü p ğ ü",
            "a s d f g h j k l",
            "ş i i z x c v b n m",
          ],
        },
      });
      break;
    case "hi":
      myKeyboard.setOptions({
        layout: {
          default: [
            "१ २ ३ ४ ५ ६ ७ ८ ९ ०",
            "ौ ै ा ी ू ो े ् ि प",
            "ट र त य ू ि ओ प",
            "आ स द ग ह ज क ल",
            "श ष स ड ़ त थ ध आ",
            "अ ड द ज़ ग ह ज क ल",
            "ः ा ि ी ू ृ ण च ट",
            "ॉ ं म न व ब ड़ ढ़",
            " ग़ ज़ द फ़ ग अ",
          ],
        },
      });
      break;

    case "he":
      myKeyboard.setOptions({
        layout: {
          default: [
            "ק ר א ט ו ן ם פ ע ו",
            "ש ד ג כ ע י ח ל ך צ",
            "ז ס ב ה נ מ צ ת",
          ],
        },
      });
      break;
    case "el":
      myKeyboard.setOptions({
        layout: {
          default: [
            "; ς ε ρ τ υ θ ι ο π [ ]",
            "α σ δ φ γ η ξ κ λ ' \\",
            "shift: < ζ χ ψ ω β ν μ , . /",
          ],
        },
      });
      break;
    case "id":
      myKeyboard.setOptions({
        layout: {
          default: [
            "q w e r t y u i o p",
            "a s d f g h j k l",
            "z x c v b n m",
            "", 
            "Q W E R T Y U I O P",
            "A S D F G H J K L",
            "Z X C V B N M",
          ],
        },
      });
      break;

    default:
      // Configuración para el idioma español
      myKeyboard.setOptions({
        layout: {
          default: [
            "q w e r t y u i o p",
            "a s d f g h j k l ñ",
            "z x c v b n m",
            "", 
            "Q W E R T Y U I O P",
            "A S D F G H J K L Ñ",
            "Z X C V B N M",
          ],
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
    myKeyboard.setOptions({ layoutName: layoutName });
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
