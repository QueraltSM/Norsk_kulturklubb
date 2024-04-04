document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("translate")
    .addEventListener("click", function (event) {
      event.preventDefault();
      translate();
    });
  document
    .getElementById("keyboardButton")
    .addEventListener("click", function (event) {
      event.preventDefault();
      showKeyboard();
    });
  document
    .getElementById("copyButton")
    .addEventListener("click", function () {
      var translatedText =
        document.getElementById("translatedText").value;
      var tempInput = document.createElement("textarea");
      tempInput.value = translatedText;
      document.body.appendChild(tempInput);
      tempInput.select();
      tempInput.setSelectionRange(0, 99999);
      document.execCommand("copy");
      document.body.removeChild(tempInput);
      var alertMessage = document.createElement("div");
      alertMessage.classList.add(
        "alert",
        "alert-success",
        "mt-3",
        "p-2",
        "text-center"
      );
      alertMessage.innerHTML = "Text copied to clipboard";
      document
        .getElementById("copyMessageContainer")
        .appendChild(alertMessage);
      setTimeout(function () {
        alertMessage.style.display = "none";
      }, 3000);
    });
});
document
  .getElementById("textToTranslate")
  .addEventListener("input", function () {
    adjustTextareaHeight();
  });
adjustTextareaHeight();

function adjustTextareaHeight() {
  var textarea = document.getElementById("textToTranslate");
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
}

function showKeyboard() {
  var activeTabId_toTranslate = document.querySelector(".nav-tabs .nav-link.active").id;
  if (activeTabId_toTranslate === "englishTab") {
    $("#textToTranslate").keyboard({
      layout: "custom",
      customLayout: {
        default: [
          "q w e r t y u i o p",
          "a s d f g h j k l",
          "z x c v b n m"
        ],
        shift: [
          "Q W E R T Y U I O P",
          "A S D F G H J K L",
          "{shift} Z X C V B N M {bksp}",
          "{space}"
        ]
      },
      usePreview: false,
      autoAccept: true,
      visible: function (e, keyboard, el) {
        $("#keyboardButton").addClass("active");
      },
      beforeClose: function (e, keyboard, el, accepted) {
        $("#keyboardButton").removeClass("active");
      },
    });
  } else if (activeTabId_toTranslate === "norwegianTab") {
    $("#textToTranslate").keyboard({
      layout: "custom",
      customLayout: {
        default: [
          "q w e r t y u i o p å",
          "a s d f g h j k l ø æ"
        ],
        shift: [
          "Q W E R T Y U I O P Å",
          "A S D F G H J K L Ø Æ",
          "{shift} {space} {bksp}",
        ]
      },
      usePreview: false,
      autoAccept: true,
      visible: function (e, keyboard, el) {
        $("#keyboardButton").addClass("active");
      },
      beforeClose: function (e, keyboard, el, accepted) {
        $("#keyboardButton").removeClass("active");
      },
    });
  }
  $("#textToTranslate").getkeyboard().reveal();
}


function translate() {
  const text = document.getElementById("textToTranslate").value;
  const selectedTabId_toTranslate  = document.querySelector('#languageTabs_totranslate .nav-link.active').getAttribute('href');
  var source = "en";
  var target = "no";

  if (selectedTabId_toTranslate === "#norwegianText") {
    source = "no";
  }
  if (selectedTabId_toTranslate === "#norwegianText") {
    source = "no";
  }
  
  alert(`http://localhost:3000/api/translateText?text=${text}&SourceLanguageCode=${source}&TargetLanguageCode=${target}`); 
  /*fetch(`http://localhost:3000/api/translateText?text=${text}&SourceLanguageCode=${source}&TargetLanguageCode=${target}`)
  .then(response => response.json())
  .then(data => {
      document.getElementById("translatedText").innerText = data.translatedText;
  })
  .catch(error => {
      document.getElementById("translatedText").innerText = 'Error al traducir texto 1 ' + error;
  });*/
}