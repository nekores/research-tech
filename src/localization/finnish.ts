import { surveyLocalization } from "survey-core";

export var finnishSurveyStrings = {
  pagePrevText: "Edellinen",
  pageNextText: "Seuraava",
  completeText: "Valmis",
  previewText: "Esikatselu",
  editText: "Muokkaa",
  startSurveyText: "Aloita",
  otherItemText: "Muu (tarkenna)",
  noneItemText: "Ei mitään",
  selectAllItemText: "Valitse kaikki",
  progressText: "Sivu {0} / {1}",
  panelDynamicProgressText: "Osio {0} / {1}",
  questionsProgressText: "Olet vastannut {0} / {1} kysymykseen.",
  emptySurvey:
    "Tässä kyselyssä ei ole yhtään näkyvillä olevaa sivua tai kysymystä.",
  completingSurvey: "Kiitos kyselyyn vastaamisesta!",
  completingSurveyBefore:
    "Tietojemme mukaan olet jo suorittanut tämän kyselyn.",
  loadingSurvey: "Kyselyä ladataan palvelimelta...",
  optionsCaption: "Valitse...",
  value: "arvo",
  requiredError: "Vastaa kysymykseen, kiitos.",
  requiredErrorInPanel: "Vastaa ainakin yhteen kysymykseen.",
  requiredInAllRowsError: "Vastaa kysymyksiin kaikilla riveillä.",
  numericError: "Arvon tulee olla numeerinen.",
  textMinLength: "Syötä vähintään {0} merkkiä.",
  textMaxLength: "Älä syötä yli {0} merkkiä.",
  textMinMaxLength: "Syötä vähintään {0} ja enintään {1} merkkiä.",
  minRowCountError: "Täytä vähintään {0} riviä.",
  minSelectError: "Valitse vähintään {0} vaihtoehtoa.",
  maxSelectError: "Valitse enintään {0} vaihtoehtoa.",
  numericMinMax:
    "Luvun '{0}' tulee olla vähintään {1} ja korkeintaan {2}.",
  numericMin: "Luvun '{0}' tulee olla vähintään {1}.",
  numericMax: "Luvun '{0}' tulee olla korkeintaan {1}.",
  invalidEmail: "Syötä validi sähköpostiosoite.",
  invalidExpression: "Lausekkeen: {0} pitäisi palauttaa 'true'.",
  urlRequestError: "Pyyntö palautti virheen {0}. {1}",
  urlGetChoicesError:
    "Pyyntö palautti tyhjän tiedoston tai 'path'-asetus on väärä",
  exceedMaxSize: "Tiedoston koko ei saa olla suurempi kuin {0}.",
  otherRequiredError: "Tarkenna vastaustasi tekstikenttään.",
  uploadingFile:
    "Tiedostoa lähetetään. Odota muutama sekunti ja yritä uudelleen.",
  loadingFile: "Ladataan...",
  chooseFile: "Valitse tiedosto(t)...",
  fileDragAreaPlaceholder: "Pudota tiedosto tähän tai lataa tiedosto napsauttamalla alla olevaa painiketta.",
  noFileChosen: "Ei tiedostoa valittuna",
  confirmDelete: "Haluatko poistaa osion?",
  keyDuplicationError: "Tämä arvo on jo käytössä. Syötä toinen arvo.",
  addColumn: "Lisää sarake",
  addRow: "Lisää rivi",
  removeRow: "Poista",
  emptyRowsText: "Ei rivejä",
  addPanel: "Lisää uusi",
  removePanel: "Poista",
  choices_Item: "kohde",
  matrix_column: "Sarake",
  matrix_row: "Rivi",
  savingData: "Tietoja tallennetaan palvelimelle...",
  savingDataError: "Tapahtui virhe, emmekä voineet tallentaa kyselyn tietoja.",
  savingDataSuccess: "Tiedot tallennettiin onnistuneesti!",
  saveAgainButton: "Yritä uudelleen",
  timerMin: "min",
  timerSec: "sek",
  timerSpentAll: "Olet käyttänyt {0} tällä sivulla ja yhteensä {1}.",
  timerSpentPage: "Olet käyttänyt {0} tällä sivulla.",
  timerSpentSurvey: "Olet käyttänyt yhteensä {0}.",
  timerLimitAll:
    "Olet käyttänyt tällä sivulla {0} / {1} ja yhteensä {2} / {3}.",
  timerLimitPage: "Olet käyttänyt {0} / {1} tällä sivulla.",
  timerLimitSurvey: "Olet käyttänyt yhteensä {0} / {1}.",
  cleanCaption: "Pyyhi",
  clearCaption: "Tyhjennä",
  chooseFileCaption: "Valitse tiedosto",
  removeFileCaption: "Poista tämä tiedosto",
  booleanCheckedLabel: "Kyllä",
  booleanUncheckedLabel: "Ei",
  confirmRemoveFile: "Haluatko varmasti poistaa tämän tiedoston: {0}?",
  confirmRemoveAllFiles: "Haluatko varmasti poistaa kaikki tiedostot?",
  questionTitlePatternText: "Kysymyksen otsikko",
  modalCancelButtonText: "Peruuta",
  modalApplyButtonText: "Käytä",
};

surveyLocalization.locales["fi"] = finnishSurveyStrings;
surveyLocalization.localeNames["fi"] = "suomi";
