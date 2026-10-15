// 宣告五題 p5.js 簡易指令選擇題資料。
const questions = [
  // 建立第一題資料。
  {
    // 設定第一題題目文字。
    question: "在 p5.js 中，要繪製橢圓形應該使用哪一個函式？",
    // 設定第一題的四個選項。
    options: ["rect()", "ellipse()", "line()", "triangle()"],
    // 設定正確答案索引。
    answer: 1
  },
  // 建立第二題資料。
  {
    // 設定第二題題目文字。
    question: "哪一個函式可以設定圖形的填滿顏色？",
    // 設定第二題的四個選項。
    options: ["stroke()", "noFill()", "fill()", "background()"],
    // 設定正確答案索引。
    answer: 2
  },
  // 建立第三題資料。
  {
    // 設定第三題題目文字。
    question: "background(0) 會產生什麼效果？",
    // 設定第三題的四個選項。
    options: ["白色背景", "黑色背景", "紅色背景", "透明背景"],
    // 設定正確答案索引。
    answer: 1
  },
  // 建立第四題資料。
  {
    // 設定第四題題目文字。
    question: "哪一個函式可以在畫布上繪製直線？",
    // 設定第四題的四個選項。
    options: ["circle()", "point()", "line()", "text()"],
    // 設定正確答案索引。
    answer: 2
  },
  // 建立第五題資料。
  {
    // 設定第五題題目文字。
    question: "p5.js 中的 setup() 函式通常會執行幾次？",
    // 設定第五題的四個選項。
    options: ["每一幀一次", "只執行一次", "滑鼠點擊時執行", "鍵盤按下時執行"],
    // 設定正確答案索引。
    answer: 1
  }
];

// 設定 Google Fonts 中文字型名稱，名稱中的空格不可刪除。
const CHINESE_FONT = "LXGW WenKai Mono TC";
// 設定 Google Fonts 英文字母與數字字型名稱，名稱中的空格不可刪除。
const LATIN_FONT = "Isometra";

// 集中管理畫面使用的色彩。
const COLORS = {
  // 設定畫布背景色。
  background: "#f7f7f7",
  // 設定主要文字色。
  text: "#222222",
  // 設定題目方框背景色。
  question: "#bdb2ff",
  // 設定題目方框邊框色。
  questionBorder: "#5b4bb7",
  // 設定一般選項背景色。
  option: "#e8e8e8",
  // 設定答對時的背景色。
  correct: "#b7f7c5",
  // 設定答錯時正確選項背景色。
  correctAnswer: "#fdffb6",
  // 設定答錯時錯誤選項背景色。
  wrong: "#ff4d6d",
  // 設定按鈕背景色。
  button: "#4d96ff",
  // 設定按鈕文字色。
  buttonText: "#ffffff",
  // 設定選項邊框色。
  border: "#444444"
};

// 記錄目前題目索引。
let currentQuestion = 0;
// 記錄本題是否已作答。
let hasAnswered = false;
// 記錄本題是否答對。
let currentAnswerCorrect = false;
// 記錄使用者選取的選項索引。
let selectedAnswer = -1;
// 記錄目前總答對題數。
let score = 0;
// 記錄答案動畫開始影格。
let animationStartFrame = 0;
// 記錄最近一次觸控時間，避免觸控與模擬滑鼠事件重複。
let lastTouchTime = -1000;
// 保存畫布物件，方便設定畫布樣式。
let canvasElement;

// 記錄外部字型的載入狀態；沒有本地字型檔案，因此不在 preload() 呼叫 loadFont()。
const fontLoadState = {
  // Isometra 載入前先使用 CSS 字型堆疊，避免誤用中文字型。
  latin: "pending",
  // 中文字型也透過 index.html 的 CSS / Google Fonts 載入。
  chinese: "pending"
};
// 避免初始化字型系統時重複建立載入請求。
let fontSystemInitialized = false;

// 取得拉丁字元使用的 CSS 字型堆疊；任何 fallback 都不包含 LXGW WenKai Mono TC。
function getLatinFontStack() {
  // 字型載入失敗時明確退回常見拉丁字型，而不是退回中文字型。
  if (fontLoadState.latin === "failed") {
    return '"Arial", "Helvetica Neue", sans-serif';
  }
  // 載入中或已載入時仍把 Isometra 放在 CSS canvas 字型堆疊第一位。
  return '"Isometra", "Arial", "Helvetica Neue", sans-serif';
}

// 取得中文字元使用的 CSS 字型堆疊。
function getChineseFontStack() {
  // 中文字型失敗時使用 CJK sans-serif fallback，不把中文字型套到英數字元。
  if (fontLoadState.chinese === "failed") {
    return '"Noto Sans CJK TC", "PingFang TC", sans-serif';
  }
  // 載入中或已載入時把指定中文字型放在第一位。
  return '"LXGW WenKai Mono TC", "Noto Sans CJK TC", sans-serif';
}

// 將字型載入結果公開到 window，方便在瀏覽器主控台檢查實際狀態。
function publishFontStatus() {
  // 不依賴畫面文字顯示診斷訊息，避免破壞原本測驗版面。
  window.quizFontStatus = {
    // 公開程式實際指定的拉丁字型名稱。
    latinFont: LATIN_FONT,
    // 公開程式實際指定的中文字型名稱。
    chineseFont: CHINESE_FONT,
    // 公開兩種字型目前的載入狀態。
    latin: fontLoadState.latin,
    chinese: fontLoadState.chinese,
    // 公開 canvas 文字使用的 CSS 字型堆疊。
    latinStack: getLatinFontStack(),
    chineseStack: getChineseFontStack()
  };
}

// 初始化外部 CSS 字型，且在字型尚未完成時仍使用明確的 canvas CSS font-family。
function initializeFontSystem() {
  // 只初始化一次，避免重新載入或 resize 時建立重複 Promise。
  if (fontSystemInitialized) {
    return;
  }
  // 標記字型系統已開始初始化。
  fontSystemInitialized = true;
  // 將字型資訊寫入 canvas 的 CSS，作為瀏覽器 canvas 文字繪製的明確提示。
  if (canvasElement && canvasElement.elt) {
    // canvas 本身使用拉丁字型作為 DOM/CSS 層的預設字型。
    canvasElement.elt.style.fontFamily = getLatinFontStack();
    // 保存指定字型名稱，方便檢查 index.html 與瀏覽器狀態。
    canvasElement.elt.dataset.latinFont = LATIN_FONT;
    canvasElement.elt.dataset.chineseFont = CHINESE_FONT;
  }
  // 某些舊瀏覽器沒有 Font Loading API，仍保留 CSS font-family 的明確 fallback。
  if (!document.fonts || typeof document.fonts.load !== "function") {
    // CSS 堆疊會嘗試 Isometra，失敗時由瀏覽器選擇 Arial 等拉丁 fallback。
    fontLoadState.latin = "css-fallback";
    // 中文同理，但使用獨立的 CJK fallback。
    fontLoadState.chinese = "css-fallback";
    // 立即公開目前狀態。
    publishFontStatus();
    // 在主控台清楚指出沒有可用的 Font Loading API。
    console.warn("Font Loading API unavailable; using explicit CSS font stacks.");
    return;
  }
  // 要求瀏覽器載入 index.html 所引用的 Isometra，並不引用不存在的本地檔案。
  const latinRequest = document.fonts.load(`16px "${LATIN_FONT}"`).then(() => {
    // 只有瀏覽器確認指定字型可用時才標示為 loaded。
    fontLoadState.latin = document.fonts.check(`16px "${LATIN_FONT}"`) ? "loaded" : "failed";
  }).catch(() => {
    // 失敗時切換為明確的拉丁 fallback，絕不使用 LXGW WenKai Mono TC。
    fontLoadState.latin = "failed";
  });
  // 要求瀏覽器載入 index.html 所引用的中文 Web Font。
  const chineseRequest = document.fonts.load(`16px "${CHINESE_FONT}"`).then(() => {
    // 只有瀏覽器確認指定字型可用時才標示為 loaded。
    fontLoadState.chinese = document.fonts.check(`16px "${CHINESE_FONT}"`) ? "loaded" : "failed";
  }).catch(() => {
    // 中文失敗時只退回 CJK 字型，不影響拉丁字型選擇。
    fontLoadState.chinese = "failed";
  });
  // 等待兩種字型的結果後更新 canvas CSS 與診斷資訊。
  Promise.all([latinRequest, chineseRequest]).then(() => {
    // 載入完成後讓 canvas 的 CSS 字型堆疊同步最新狀態。
    if (canvasElement && canvasElement.elt) {
      canvasElement.elt.style.fontFamily = getLatinFontStack();
    }
    // 公開結果供檢查，並在 Isometra 不可用時明確警告。
    publishFontStatus();
    if (fontLoadState.latin !== "loaded") {
      console.warn("Isometra was not confirmed; using an explicit Latin fallback instead.");
    }
  });
  // 在載入請求尚未完成前也先公開 pending 狀態。
  publishFontStatus();
}

// 每次繪製或測量文字片段前呼叫，確保 p5.js 與底層 canvas 使用同一字型。
function applyQuizFont(fontKind, fontSize) {
  // 判斷目前片段是拉丁字元還是中文字元。
  const isLatin = fontKind === "latin";
  // 使用集中設定的精確字型名稱呼叫 p5.js textFont()。
  if (isLatin) {
    // 英文字母、數字與 ASCII 符號明確呼叫 textFont('Isometra')。
    textFont(LATIN_FONT);
  } else {
    // 中文字元明確呼叫 textFont('LXGW WenKai Mono TC')。
    textFont(CHINESE_FONT);
  }
  // 以同一個大小更新 p5.js 文字狀態。
  textSize(fontSize);
  // 直接同步 2D canvas 的 CSS font，避免 p5.js 或瀏覽器 fallback 只沿用上一段字型。
  if (typeof drawingContext !== "undefined" && drawingContext) {
    // 拉丁與中文使用完全分離的 CSS font-family 堆疊。
    const fontStack = isLatin ? getLatinFontStack() : getChineseFontStack();
    // 設定 canvas 文字測量與繪製真正使用的 font 字串。
    drawingContext.font = `normal normal ${fontSize}px ${fontStack}`;
  }
}

// p5.js 初始化函式。
function setup() {
  // 移除 html 預設外距。
  document.documentElement.style.margin = "0";
  // 移除 body 預設外距。
  document.body.style.margin = "0";
  // 讓 body 寬度填滿視窗。
  document.body.style.width = "100%";
  // 讓 body 高度填滿視窗。
  document.body.style.height = "100%";
  // 禁止網頁在觸控時捲動。
  document.body.style.overflow = "hidden";
  // 禁止觸控時縮放或拖曳畫面。
  document.body.style.touchAction = "none";
  // 設定高 DPI 畫面清晰度並限制最高為兩倍。
  pixelDensity(Math.min(Math.max(Number(window.devicePixelRatio) || 1, 1), 2));
  // 建立符合瀏覽器視窗大小的全螢幕畫布。
  canvasElement = createCanvas(getViewportWidth(), getViewportHeight());
  // 讓畫布以區塊元素顯示，避免多餘空白。
  canvasElement.elt.style.display = "block";
  // 讓畫布寬度填滿視窗。
  canvasElement.elt.style.width = "100vw";
  // 讓畫布高度填滿視窗。
  canvasElement.elt.style.height = "100vh";
  // 禁止畫布觸發瀏覽器預設觸控行為。
  canvasElement.elt.style.touchAction = "none";
  // 設定畫布的無障礙說明。
  canvasElement.elt.setAttribute("aria-label", "p5.js 程式設計指令練習測驗");
  // 設定預設文字對齊方式。
  textAlign(CENTER, CENTER);
  // 設定預設文字顏色。
  fill(COLORS.text);
  // 設定預設文字大小。
  textSize(20);
  // 初始化 index.html 引用的 Web Font；沒有本地檔案時不呼叫 loadFont()。
  initializeFontSystem();
  // 設定預設英文字型；每個混排片段仍會在測量與繪製前再次套用。
  applyQuizFont("latin", 20);
  // 設定預設圖形不繪製外框。
  noStroke();
}

// 取得瀏覽器視窗寬度。
function getViewportWidth() {
  // 回傳至少一個像素的整數寬度。
  return Math.max(1, Math.floor(window.innerWidth || windowWidth));
}

// 取得瀏覽器視窗高度。
function getViewportHeight() {
  // 回傳至少一個像素的整數高度。
  return Math.max(1, Math.floor(window.innerHeight || windowHeight));
}

// 視窗尺寸或瀏覽器縮放改變時重新調整畫布。
function windowResized() {
  // 重新套用目前裝置的像素密度。
  pixelDensity(Math.min(Math.max(Number(window.devicePixelRatio) || 1, 1), 2));
  // 使用最新視窗尺寸調整畫布。
  resizeCanvas(getViewportWidth(), getViewportHeight());
}

// 判斷字元是否需要使用中文字型。
function isCjkCharacter(character) {
  // 辨識中日韓文字與 CJK 標點符號。
  return /[\u2e80-\u2fff\u3000-\u303f\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\xac00-\ud7af]/.test(character);
}

// 將一段文字分成中文字型段落與英數字型段落。
function splitTextByFont(sourceText) {
  // 建立分段結果陣列。
  const segments = [];
  // 保存目前正在組合的文字。
  let currentText = "";
  // 保存目前文字段落的字型類別。
  let currentIsCjk = null;
  // 使用 Array.from 正確處理 Unicode 字元。
  for (const character of Array.from(String(sourceText))) {
    // 判斷目前字元是否屬於中文區段。
    const isCjk = isCjkCharacter(character);
    // 字型類別改變時先保存上一段文字。
    if (currentIsCjk !== null && currentIsCjk !== isCjk) {
      // 將上一段文字存入結果。
      segments.push({ text: currentText, isCjk: currentIsCjk });
      // 清空目前文字。
      currentText = "";
    }
    // 記錄目前文字段落的字型類別。
    currentIsCjk = isCjk;
    // 將目前字元加入文字段落。
    currentText += character;
  }
  // 保存最後一段文字。
  if (currentText.length > 0) {
    // 將最後一段文字存入結果。
    segments.push({ text: currentText, isCjk: currentIsCjk });
  }
  // 回傳分段結果。
  return segments;
}

// 計算中英文混排文字的實際寬度。
function measureMixedText(sourceText, fontSize) {
  // 初始化總寬度。
  let totalWidth = 0;
  // 逐段切換字型並計算寬度，確保 textWidth() 不會沿用上一段字型。
  for (const segment of splitTextByFont(sourceText)) {
    // 中文片段使用中文設定，英數與 ASCII 符號片段使用 Isometra 設定。
    applyQuizFont(segment.isCjk ? "chinese" : "latin", fontSize);
    // 在已套用對應字型的 canvas context 上測量目前片段。
    totalWidth += textWidth(segment.text);
  }
  // 回傳整段文字寬度。
  return totalWidth;
}

// 將中文與非中文內容分段繪製在同一行。
function drawMixedText(sourceText, x, y, fontSize, alignment = CENTER) {
  // 計算整段混排文字寬度；函式內部會逐段明確套用字型。
  const totalWidth = measureMixedText(sourceText, fontSize);
  // 依照對齊方式計算文字起點。
  let cursorX = x;
  // 置中時從整段文字左側開始繪製。
  if (alignment === CENTER) {
    // 將起點向左移動半段總寬度。
    cursorX = x - totalWidth / 2;
  }
  // 靠右時從文字左側開始繪製。
  if (alignment === RIGHT) {
    // 將起點向左移動整段總寬度。
    cursorX = x - totalWidth;
  }
  // 使用左側對齊逐段繪製。
  textAlign(LEFT, CENTER);
  // 逐段套用正確字型並繪製；不可依賴 measureMixedText() 留下的最後字型。
  for (const segment of splitTextByFont(sourceText)) {
    // 中文段落使用中文設定，英數與 ASCII 符號段落使用 Isometra 設定。
    applyQuizFont(segment.isCjk ? "chinese" : "latin", fontSize);
    // 繪製目前片段。
    text(segment.text, cursorX, y);
    // 在同一個已套用字型的 context 上量測，避免游標位置使用錯誤字型。
    cursorX += textWidth(segment.text);
  }
  // 還原一般置中對齊。
  textAlign(CENTER, CENTER);
}

// 依照實際混排寬度將文字切成多行。
function wrapMixedText(sourceText, maxWidth, fontSize) {
  // 建立多行文字陣列。
  const lines = [];
  // 依照手動換行符號分割段落。
  const paragraphs = String(sourceText).split("\n");
  // 逐一處理每個段落。
  for (const paragraph of paragraphs) {
    // 建立目前文字行。
    let currentLine = "";
    // 逐字加入並測量文字寬度。
    for (const character of Array.from(paragraph)) {
      // 建立加入新字元後的預覽行。
      const previewLine = currentLine + character;
      // 判斷預覽行是否超出可用寬度。
      if (currentLine.length > 0 && measureMixedText(previewLine, fontSize) > maxWidth) {
        // 將目前行加入結果。
        lines.push(currentLine);
        // 以目前字元開始下一行。
        currentLine = character;
      } else {
        // 將目前字元加入目前行。
        currentLine = previewLine;
      }
    }
    // 保存段落最後一行。
    if (currentLine.length > 0 || paragraph.length === 0) {
      // 將最後一行加入結果。
      lines.push(currentLine);
    }
  }
  // 確保空文字也有一行可繪製。
  if (lines.length === 0) {
    // 加入空白文字行。
    lines.push("");
  }
  // 回傳多行文字。
  return lines;
}

// 將數值限制在指定範圍內。
function clampValue(value, minimum, maximum) {
  // 回傳限制後的數值。
  return Math.max(minimum, Math.min(maximum, value));
}

// 計算測驗頁面所有元件的響應式位置與尺寸。
function getQuizLayout() {
  // 取得畫布寬度。
  const canvasWidth = Math.max(1, width);
  // 取得畫布高度。
  const canvasHeight = Math.max(1, height);
  // 計算畫面安全邊界。
  const margin = clampValue(Math.min(canvasWidth * 0.045, canvasHeight * 0.03), 5, 30);
  // 計算內容最大寬度，避免文字碰到畫面邊緣。
  const contentWidth = Math.max(1, Math.min(canvasWidth - margin * 2, 900));
  // 依照畫面大小設定初始縮放比例。
  let scale = clampValue(Math.min(canvasWidth / 560, canvasHeight / 760), 0.28, 1.08);
  // 保存最後一次版面計算結果。
  let layout = null;
  // 反覆縮小版面，直到內容能放入畫布。
  for (let attempt = 0; attempt < 12; attempt += 1) {
    // 計算標題大小。
    const titleSize = Math.max(10, Math.min(34, canvasWidth * 0.055, canvasHeight * 0.08) * scale);
    // 計算進度文字大小。
    const progressSize = Math.max(8, Math.min(20, canvasWidth * 0.034, canvasHeight * 0.05) * scale);
    // 計算題目文字大小。
    const questionSize = Math.max(9, Math.min(29, canvasWidth * 0.046, canvasHeight * 0.065) * scale);
    // 計算選項文字大小。
    const optionSize = Math.max(8, Math.min(22, canvasWidth * 0.036, canvasHeight * 0.05) * scale);
    // 計算題目方框內距。
    const questionPadding = Math.max(6, Math.min(25, canvasWidth * 0.035) * scale);
    // 計算題目文字可用寬度。
    const questionTextWidth = Math.max(1, contentWidth - questionPadding * 2);
    // 計算題目自動換行結果。
    const questionLines = wrapMixedText(questions[currentQuestion].question, questionTextWidth, questionSize);
    // 計算題目行高。
    const questionLineHeight = Math.max(10, questionSize * 1.42);
    // 計算題目方框高度。
    const questionHeight = questionLines.length * questionLineHeight + questionPadding * 2;
    // 計算標題與進度位置。
    const titleY = margin + titleSize * 0.55;
    // 計算進度位置。
    const progressY = titleY + titleSize * 0.68 + progressSize * 0.7;
    // 計算標題與題目方框間距。
    const headerGap = Math.max(4, Math.min(18, canvasHeight * 0.018) * scale);
    // 計算題目方框上側位置。
    const questionY = progressY + progressSize * 0.62 + headerGap;
    // 計算選項內距。
    const optionPadding = Math.max(5, Math.min(18, canvasWidth * 0.024) * scale);
    // 計算選項文字可用寬度。
    const optionTextWidth = Math.max(1, contentWidth - optionPadding * 2);
    // 計算選項行高。
    const optionLineHeight = Math.max(9, optionSize * 1.28);
    // 建立四個選項的換行文字。
    const optionLines = [];
    // 記錄最多行數。
    let maximumOptionLines = 1;
    // 逐一建立選項文字。
    for (let optionIndex = 0; optionIndex < questions[currentQuestion].options.length; optionIndex += 1) {
      // 建立包含 A、B、C、D 標籤的選項文字。
      const optionLabel = String.fromCharCode(65 + optionIndex) + ". " + questions[currentQuestion].options[optionIndex];
      // 計算目前選項的換行結果。
      const currentLines = wrapMixedText(optionLabel, optionTextWidth, optionSize);
      // 保存目前選項換行結果。
      optionLines.push(currentLines);
      // 更新最多行數。
      maximumOptionLines = Math.max(maximumOptionLines, currentLines.length);
    }
    // 計算選項高度，避免多行內容超出方框。
    const optionHeight = Math.max(25, maximumOptionLines * optionLineHeight + optionPadding * 2, canvasHeight * 0.065 * scale);
    // 計算選項間距。
    const optionGap = Math.max(3, Math.min(17, canvasHeight * 0.018) * scale);
    // 計算題目與選項的間距。
    const questionToOptionsGap = Math.max(4, Math.min(26, canvasHeight * 0.034) * scale);
    // 計算第一個選項位置。
    const firstOptionY = questionY + questionHeight + questionToOptionsGap;
    // 計算四個選項的總高度。
    const optionsHeight = questions[currentQuestion].options.length * optionHeight + (questions[currentQuestion].options.length - 1) * optionGap;
    // 計算答題回饋文字大小。
    const feedbackSize = Math.max(8, Math.min(18, canvasWidth * 0.03) * scale);
    // 計算回饋文字區域高度。
    const feedbackHeight = hasAnswered ? feedbackSize * 1.55 : 0;
    // 計算回饋與按鈕間距。
    const feedbackGap = hasAnswered ? Math.max(2, Math.min(12, canvasHeight * 0.014) * scale) : 0;
    // 計算按鈕高度。
    const buttonHeight = Math.max(28, Math.min(58, canvasHeight * 0.075) * scale);
    // 計算按鈕寬度。
    const buttonWidth = Math.min(contentWidth, Math.max(120, Math.min(280, canvasWidth * 0.46)));
    // 計算選項與按鈕之間的間距。
    const buttonGap = hasAnswered ? Math.max(4, Math.min(18, canvasHeight * 0.022) * scale) : 0;
    // 計算底部安全留白。
    const bottomMargin = Math.max(5, margin * 0.7);
    // 計算按鈕位置。
    const buttonY = firstOptionY + optionsHeight + feedbackGap + feedbackHeight + buttonGap;
    // 保存版面資料。
    layout = {
      // 保存畫布尺寸。
      canvasWidth: canvasWidth,
      canvasHeight: canvasHeight,
      // 保存標題資料。
      titleSize: titleSize,
      titleY: titleY,
      progressSize: progressSize,
      progressY: progressY,
      // 保存題目方框資料。
      question: {
        x: (canvasWidth - contentWidth) / 2,
        y: questionY,
        width: contentWidth,
        height: questionHeight,
        textSize: questionSize,
        lineHeight: questionLineHeight,
        lines: questionLines
      },
      // 保存選項共用資料。
      optionWidth: contentWidth,
      optionHeight: optionHeight,
      optionGap: optionGap,
      optionTextSize: optionSize,
      optionLineHeight: optionLineHeight,
      optionLines: optionLines,
      firstOptionY: firstOptionY,
      // 保存回饋資料。
      feedbackSize: feedbackSize,
      feedbackY: firstOptionY + optionsHeight + feedbackGap + feedbackHeight / 2,
      // 保存下一題按鈕資料。
      nextButton: {
        x: (canvasWidth - buttonWidth) / 2,
        y: buttonY,
        width: buttonWidth,
        height: buttonHeight
      },
      // 保存按鈕文字大小。
      buttonTextSize: Math.max(9, Math.min(22, buttonHeight * 0.38)),
      // 保存縮放比例。
      scale: scale,
      // 保存內容估計總高度。
      requiredHeight: buttonY + (hasAnswered ? buttonHeight : 0) + bottomMargin
    };
    // 判斷內容是否已經完整放入畫布。
    if (layout.requiredHeight <= canvasHeight - 1) {
      // 內容沒有超出畫布時停止縮放。
      break;
    }
    // 依照超出比例縮小下一次版面。
    scale = Math.max(0.18, scale * Math.min(0.93, (canvasHeight - bottomMargin) / Math.max(layout.requiredHeight, 1)));
  }
  // 計算動畫已經經過的影格數。
  const elapsedFrames = frameCount - animationStartFrame;
  // 計算正確選項上下跳動幅度。
  const verticalAmplitude = hasAnswered && !currentAnswerCorrect ? Math.min(layout.optionHeight * 0.18, layout.optionGap * 0.55) : 0;
  // 計算錯誤選項左右搖晃幅度。
  const horizontalAmplitude = hasAnswered && !currentAnswerCorrect ? Math.min(14 * layout.scale, Math.max(0, (canvasWidth - layout.optionWidth) / 2 - 2)) : 0;
  // 建立實際的選項矩形。
  layout.options = [];
  // 逐一建立選項位置與動畫資料。
  for (let optionIndex = 0; optionIndex < questions[currentQuestion].options.length; optionIndex += 1) {
    // 計算未套用動畫的選項垂直位置。
    const baseY = layout.firstOptionY + optionIndex * (layout.optionHeight + layout.optionGap);
    // 預設水平位移為零。
    let horizontalOffset = 0;
    // 預設垂直位移為零。
    let verticalOffset = 0;
    // 答錯時讓正確選項上下跳動。
    if (hasAnswered && !currentAnswerCorrect && optionIndex === questions[currentQuestion].answer) {
      // 使用正弦函式產生上下跳動。
      verticalOffset = Math.sin(elapsedFrames * 0.18) * verticalAmplitude;
    }
    // 答錯時讓使用者選錯的選項左右搖晃。
    if (hasAnswered && !currentAnswerCorrect && optionIndex === selectedAnswer) {
      // 使用正弦函式產生左右搖晃。
      horizontalOffset = Math.sin(elapsedFrames * 0.22) * horizontalAmplitude;
    }
    // 保存目前選項的實際資料。
    layout.options.push({
      // 保存選項索引。
      index: optionIndex,
      // 保存動畫後的 X 座標。
      x: (canvasWidth - layout.optionWidth) / 2 + horizontalOffset,
      // 保存動畫後的 Y 座標。
      y: baseY + verticalOffset,
      // 保存選項寬度。
      width: layout.optionWidth,
      // 保存選項高度。
      height: layout.optionHeight,
      // 保存選項換行文字。
      lines: layout.optionLines[optionIndex]
    });
  }
  // 回傳繪圖與互動共用的版面資料。
  return layout;
}

// 計算測驗結果頁面的響應式位置與尺寸。
function getResultLayout() {
  // 取得畫布寬度。
  const canvasWidth = Math.max(1, width);
  // 取得畫布高度。
  const canvasHeight = Math.max(1, height);
  // 計算結果標題大小。
  const titleSize = clampValue(Math.min(canvasWidth * 0.09, canvasHeight * 0.13), 16, 48);
  // 計算分數文字大小。
  const scoreSize = clampValue(Math.min(canvasWidth * 0.06, canvasHeight * 0.08), 12, 34);
  // 計算重新開始按鈕寬度。
  const buttonWidth = Math.min(Math.max(130, canvasWidth * 0.46), 280);
  // 計算重新開始按鈕高度。
  const buttonHeight = clampValue(Math.min(canvasHeight * 0.09, 60), 32, 60);
  // 計算畫面垂直中心。
  const centerY = canvasHeight / 2;
  // 回傳結果頁面的版面資料。
  return {
    // 保存畫布尺寸。
    canvasWidth: canvasWidth,
    canvasHeight: canvasHeight,
    // 保存標題資料。
    titleSize: titleSize,
    titleY: centerY - titleSize * 1.8,
    // 保存分數資料。
    scoreSize: scoreSize,
    scoreY: centerY - scoreSize * 0.15,
    // 保存重新開始按鈕資料。
    restartButton: {
      x: (canvasWidth - buttonWidth) / 2,
      y: Math.min(centerY + scoreSize * 1.25, canvasHeight - buttonHeight - 10),
      width: buttonWidth,
      height: buttonHeight
    },
    // 保存按鈕文字大小。
    buttonTextSize: Math.max(10, Math.min(22, buttonHeight * 0.38))
  };
}

// 判斷輸入座標是否落在矩形內。
function isPointInsideRectangle(inputX, inputY, rectangle) {
  // 同時檢查矩形的四個邊界。
  return inputX >= rectangle.x && inputX <= rectangle.x + rectangle.width && inputY >= rectangle.y && inputY <= rectangle.y + rectangle.height;
}

// p5.js 每一幀執行的繪圖函式。
function draw() {
  // 使用淺灰色清除畫布。
  background(COLORS.background);
  // 判斷是否已經完成所有題目。
  if (currentQuestion >= questions.length) {
    // 繪製測驗結果畫面。
    drawResultScreen(getResultLayout());
    // 結束本幀繪圖。
    return;
  }
  // 取得目前測驗頁面的版面資料。
  const layout = getQuizLayout();
  // 繪製標題與進度。
  drawTitle(layout);
  // 繪製題目方框。
  drawQuestion(layout);
  // 繪製選項。
  drawOptions(layout);
  // 作答後才顯示回饋與下一題按鈕。
  if (hasAnswered) {
    // 繪製答題回饋。
    drawFeedback(layout);
    // 繪製下一題按鈕。
    drawNextButton(layout);
  }
}

// 繪製測驗標題與題目進度。
function drawTitle(layout) {
  // 設定標題顏色。
  fill(COLORS.text);
  // 繪製中英文字型混排標題。
  drawMixedText("p5.js 程式設計指令練習測驗", layout.canvasWidth / 2, layout.titleY, layout.titleSize, CENTER);
  // 繪製中英文字型混排進度。
  drawMixedText("第 " + (currentQuestion + 1) + " 題，共 " + questions.length + " 題", layout.canvasWidth / 2, layout.progressY, layout.progressSize, CENTER);
}

// 繪製置中的題目方框與題目文字。
function drawQuestion(layout) {
  // 設定題目方框背景色。
  fill(COLORS.question);
  // 設定題目方框邊框色。
  stroke(COLORS.questionBorder);
  // 設定題目方框邊框粗細。
  strokeWeight(Math.max(1, Math.min(3, layout.scale * 2)));
  // 繪製題目方框。
  rect(layout.question.x, layout.question.y, layout.question.width, layout.question.height, Math.min(14, layout.question.height * 0.18));
  // 關閉後續文字與圖形的外框。
  noStroke();
  // 設定題目文字色。
  fill(COLORS.text);
  // 計算題目文字中心位置。
  const centerX = layout.question.x + layout.question.width / 2;
  // 計算題目文字垂直中心。
  const centerY = layout.question.y + layout.question.height / 2;
  // 逐行繪製題目文字。
  for (let lineIndex = 0; lineIndex < layout.question.lines.length; lineIndex += 1) {
    // 計算目前文字行的垂直位置。
    const lineY = centerY + (lineIndex - (layout.question.lines.length - 1) / 2) * layout.question.lineHeight;
    // 使用混排函式繪製目前文字行。
    drawMixedText(layout.question.lines[lineIndex], centerX, lineY, layout.question.textSize, CENTER);
  }
}

// 繪製四個選項與作答動畫。
function drawOptions(layout) {
  // 逐一繪製每個選項。
  for (const option of layout.options) {
    // 設定目前選項背景色。
    setOptionColor(option.index);
    // 設定選項邊框色。
    stroke(COLORS.border);
    // 設定選項邊框粗細。
    strokeWeight(Math.max(1, Math.min(2, layout.scale * 1.5)));
    // 繪製選項方框。
    rect(option.x, option.y, option.width, option.height, Math.min(12, option.height * 0.2));
    // 關閉文字外框。
    noStroke();
    // 設定選項文字色。
    fill(COLORS.text);
    // 計算選項文字垂直中心。
    const textCenterY = option.y + option.height / 2;
    // 逐行繪製選項文字。
    for (let lineIndex = 0; lineIndex < option.lines.length; lineIndex += 1) {
      // 計算目前文字行位置。
      const lineY = textCenterY + (lineIndex - (option.lines.length - 1) / 2) * layout.optionLineHeight;
      // 使用混排函式繪製選項文字。
      drawMixedText(option.lines[lineIndex], option.x + option.width / 2, lineY, layout.optionTextSize, CENTER);
    }
  }
}

// 依照目前作答結果設定選項背景色。
function setOptionColor(optionIndex) {
  // 尚未作答時所有選項使用灰色。
  if (!hasAnswered) {
    // 設定一般選項色。
    fill(COLORS.option);
    // 結束顏色判斷。
    return;
  }
  // 取得目前題目。
  const question = questions[currentQuestion];
  // 答對時將正確答案標示為綠色。
  if (currentAnswerCorrect) {
    // 判斷是否為正確答案。
    fill(optionIndex === question.answer ? COLORS.correct : COLORS.option);
    // 結束顏色判斷。
    return;
  }
  // 答錯時將正確答案標示為淡黃色。
  if (optionIndex === question.answer) {
    // 套用指定的正確答案色。
    fill(COLORS.correctAnswer);
    // 結束顏色判斷。
    return;
  }
  // 答錯時將使用者錯誤選項標示為紅色。
  if (optionIndex === selectedAnswer) {
    // 套用指定的錯誤答案色。
    fill(COLORS.wrong);
    // 結束顏色判斷。
    return;
  }
  // 其他選項維持灰色。
  fill(COLORS.option);
}

// 繪製答題結果文字回饋。
function drawFeedback(layout) {
  // 答對使用綠色，答錯使用深紅色。
  fill(currentAnswerCorrect ? "#16803c" : "#b4233f");
  // 建立清楚的作答回饋訊息。
  const feedbackText = currentAnswerCorrect ? "答對！" : "答錯！正確答案已標示";
  // 使用混排函式繪製回饋文字。
  drawMixedText(feedbackText, layout.canvasWidth / 2, layout.feedbackY, layout.feedbackSize, CENTER);
}

// 繪製下一題或查看結果按鈕。
function drawNextButton(layout) {
  // 設定按鈕背景色。
  fill(COLORS.button);
  // 繪製圓角按鈕。
  rect(layout.nextButton.x, layout.nextButton.y, layout.nextButton.width, layout.nextButton.height, Math.min(13, layout.nextButton.height * 0.22));
  // 設定按鈕文字色。
  fill(COLORS.buttonText);
  // 判斷目前是否為最後一題。
  const label = currentQuestion === questions.length - 1 ? "查看結果" : "下一題";
  // 繪製混排按鈕文字。
  drawMixedText(label, layout.nextButton.x + layout.nextButton.width / 2, layout.nextButton.y + layout.nextButton.height / 2, layout.buttonTextSize, CENTER);
}

// 繪製測驗完成後的結果畫面。
function drawResultScreen(layout) {
  // 設定結果文字色。
  fill(COLORS.text);
  // 繪製測驗結束標題。
  drawMixedText("測驗結束！", layout.canvasWidth / 2, layout.titleY, layout.titleSize, CENTER);
  // 繪製答對題數。
  drawMixedText("你答對了 " + score + " / " + questions.length + " 題", layout.canvasWidth / 2, layout.scoreY, layout.scoreSize, CENTER);
  // 設定重新開始按鈕色。
  fill(COLORS.button);
  // 繪製重新開始按鈕。
  rect(layout.restartButton.x, layout.restartButton.y, layout.restartButton.width, layout.restartButton.height, Math.min(13, layout.restartButton.height * 0.22));
  // 設定按鈕文字色。
  fill(COLORS.buttonText);
  // 繪製重新開始文字。
  drawMixedText("重新開始", layout.restartButton.x + layout.restartButton.width / 2, layout.restartButton.y + layout.restartButton.height / 2, layout.buttonTextSize, CENTER);
}

// 處理滑鼠按下事件。
function mousePressed() {
  // 忽略觸控後瀏覽器模擬產生的滑鼠事件。
  if (millis() - lastTouchTime < 500) {
    // 阻止瀏覽器預設行為。
    return false;
  }
  // 將滑鼠座標交給統一輸入函式。
  handleInput(mouseX, mouseY);
  // 阻止瀏覽器預設行為。
  return false;
}

// 處理行動裝置觸控開始事件。
function touchStarted() {
  // 記錄觸控發生時間。
  lastTouchTime = millis();
  // 將觸控座標交給統一輸入函式。
  handleInput(mouseX, mouseY);
  // 阻止行動裝置預設捲動行為。
  return false;
}

// 統一處理滑鼠與觸控輸入。
function handleInput(inputX, inputY) {
  // 測驗完成後只檢查重新開始按鈕。
  if (currentQuestion >= questions.length) {
    // 取得結果頁面版面資料。
    const resultLayout = getResultLayout();
    // 判斷是否點擊重新開始。
    if (isPointInsideRectangle(inputX, inputY, resultLayout.restartButton)) {
      // 將題目重設為第一題。
      currentQuestion = 0;
      // 將分數歸零。
      score = 0;
      // 將作答狀態重設為未作答。
      hasAnswered = false;
      // 將正確狀態重設為否。
      currentAnswerCorrect = false;
      // 清除選項選取狀態。
      selectedAnswer = -1;
      // 重設動畫起始影格。
      animationStartFrame = frameCount;
    }
    // 結束結果頁面輸入處理。
    return;
  }
  // 作答後只允許按下一題按鈕。
  if (hasAnswered) {
    // 取得作答後的版面資料。
    const layout = getQuizLayout();
    // 判斷是否點擊下一題按鈕。
    if (isPointInsideRectangle(inputX, inputY, layout.nextButton)) {
      // 前往下一題或結果頁面。
      currentQuestion += 1;
      // 清除本題作答狀態。
      hasAnswered = false;
      // 清除本題正確狀態。
      currentAnswerCorrect = false;
      // 清除選項選取狀態。
      selectedAnswer = -1;
      // 重設動畫起始影格。
      animationStartFrame = frameCount;
    }
    // 結束作答後輸入處理。
    return;
  }
  // 尚未作答時逐一檢查四個選項。
  for (const option of getQuizLayout().options) {
    // 判斷輸入位置是否在目前選項中。
    if (isPointInsideRectangle(inputX, inputY, option)) {
      // 記錄使用者選項。
      selectedAnswer = option.index;
      // 設定本題已作答。
      hasAnswered = true;
      // 記錄動畫開始影格。
      animationStartFrame = frameCount;
      // 判斷答案是否正確。
      currentAnswerCorrect = option.index === questions[currentQuestion].answer;
      // 答對時增加分數。
      if (currentAnswerCorrect) {
        // 將總分加一。
        score += 1;
      }
      // 找到選項後停止檢查。
      break;
    }
  }
}
