---
title: 選擇題測驗卷網站講義（學生版）.md

---

---
title: 選擇題測驗卷網站講義（學生版）

---

---
title: 選擇題測驗卷網站講義（學生版）
tags: [114程式設計與實習_上學期]

---

# 選擇題測驗卷網站講義（學生版）

學號：＿＿＿＿＿＿＿＿　　姓名：＿＿＿＿＿＿＿＿

> **填寫方式**
> 1. 每個學習都要放：**執行截圖**、**三次問 AI 的提示詞**、**最後採用的程式碼**。
> 2. 問 AI 的提示詞請**逐字貼上**自己實際輸入的內容（不要寫摘要），第一次、第二次、第三次依序記錄。
> 3. 程式碼貼在「點開貼上」的收合區塊裡，貼上**你最後真正採用、而且能執行**的版本。

---

## 學習1：產生一個選擇題測驗卷網站

https://cfchen58.synology.me/115/week4/stage1/

**這個階段的目標：** 用 p5.js 做出一個一次顯示一題、四個選項、答完會顯示對錯與總分的測驗網站（題目先寫在程式裡）。
**這個階段會修改的檔案：** index.html、sketch.js

### 執行截圖

### 答對的畫面
![image](https://hackmd.io/_uploads/SJZNvhVsMx.png)

### 答錯的畫面
![20261008_1](https://hackmd.io/_uploads/SyEpvn4iGl.gif)

### 第一次問 AI

```tex!
使用p5.js撰寫一個選擇題網頁測驗系統，我已經產生一個p5.js專案，請把程式碼寫到sketch.js檔案內，每條指令都需要加上中文註解。測驗系統題目設定為五題，測驗題目的內容為程式設計p5.js簡易指令練習測驗，系統採用全螢幕畫布，使用者答錯時，系統會在正確答案選項上，加上fdffb6背景顏色，該選項要上下跳動，答錯的選項採用ff4d6d背景顏色，選項左右移動。選擇題選項共有四個選項，當五題結束後，需要顯示答對的題數，每次顯示一個題目，需要有下一題的按鈕。
```

### 第二次問 AI

```tex!
題目的顯示到整個視窗畫布的右邊，造成無法全部正確顯示，題目請顯示在整個視窗的中間，並加上方框，方框的背景顏色為bdb2ff。
```

### 程式碼內容

:::info
:::spoiler 點開貼上學習1的程式碼
```javascript=
//學習1程式碼所在
// 宣告測驗題目陣列
let questions = [
  // 建立第一題資料
  {
    // 設定第一題題目文字
    question: '在 p5.js 中，要繪製橢圓形應該使用哪一個函式？',
    // 設定第一題的四個選項
    options: ['rect()', 'ellipse()', 'line()', 'triangle()'],
    // 設定正確答案索引值
    answer: 1
  },

  // 建立第二題資料
  {
    // 設定第二題題目文字
    question: '哪一個函式可以設定圖形的填滿顏色？',
    // 設定第二題的四個選項
    options: ['stroke()', 'noFill()', 'fill()', 'background()'],
    // 設定正確答案索引值
    answer: 2
  },

  // 建立第三題資料
  {
    // 設定第三題題目文字
    question: 'background(0) 會產生什麼效果？',
    // 設定第三題的四個選項
    options: ['白色背景', '黑色背景', '紅色背景', '透明背景'],
    // 設定正確答案索引值
    answer: 1
  },

  // 建立第四題資料
  {
    // 設定第四題題目文字
    question: '哪一個函式可以在畫布上繪製直線？',
    // 設定第四題的四個選項
    options: ['circle()', 'point()', 'line()', 'text()'],
    // 設定正確答案索引值
    answer: 2
  },

  // 建立第五題資料
  {
    // 設定第五題題目文字
    question: 'p5.js 中的 setup() 函式通常會執行幾次？',
    // 設定第五題的四個選項
    options: ['每一幀一次', '只執行一次', '滑鼠點擊時執行', '鍵盤按下時執行'],
    // 設定正確答案索引值
    answer: 1
  }
];

// 設定目前顯示的題目編號
let currentQuestion = 0;

// 設定使用者是否已經作答
let hasAnswered = false;

// 設定使用者本題是否答對
let currentAnswerCorrect = false;

// 設定使用者本題選擇的答案索引
let selectedAnswer = -1;

// 設定使用者總答對題數
let score = 0;

// 設定動畫開始的時間
let animationStartFrame = 0;

// 設定下一題按鈕的位置與大小
let nextButton = {
  // 設定按鈕的水平位置
  x: 0,
  // 設定按鈕的垂直位置
  y: 0,
  // 設定按鈕寬度
  width: 220,
  // 設定按鈕高度
  height: 60
};

// p5.js 初始化函式
function setup() {
  // 建立符合瀏覽器視窗大小的畫布
  createCanvas(windowWidth, windowHeight);

  // 設定畫布文字水平置中
  textAlign(CENTER, CENTER);

  // 設定畫布使用無邊框模式
  noStroke();

  // 設定預設文字大小
  textSize(24);

  // 設定畫布使用觸控時不觸發瀏覽器預設行為
  document.body.style.touchAction = 'none';

  // 計算下一題按鈕的位置
  updateLayout();
}

// 當瀏覽器視窗大小改變時執行
function windowResized() {
  // 重新調整畫布大小
  resizeCanvas(windowWidth, windowHeight);

  // 重新計算畫面元件位置
  updateLayout();
}

// 更新畫面版面配置
function updateLayout() {
  // 設定下一題按鈕的水平位置
  nextButton.x = width / 2 - nextButton.width / 2;

  // 設定下一題按鈕的垂直位置
  nextButton.y = height - 100;
}

// 將題目文字依照可用寬度切成多行
function wrapQuestionText(questionText, maxTextWidth) {
  // 建立存放每一行文字的陣列
  let lines = [];
  // 建立目前正在組合的文字行
  let currentLine = "";
  // 逐字檢查題目文字
  for (let i = 0; i < questionText.length; i++) {
    // 取得目前檢查的字元
    let character = questionText.charAt(i);
    // 判斷目前字元是否為手動換行符號
    if (character === "\n") {
      // 將目前文字行加入多行文字陣列
      lines.push(currentLine);
      // 清空目前文字行以準備下一行
      currentLine = "";
      // 跳過本次迴圈後續程式
      continue;
    }
    // 建立加入目前字元後的預覽文字行
    let previewLine = currentLine + character;
    // 判斷預覽文字是否超過可用寬度
    if (currentLine.length > 0 && textWidth(previewLine) > maxTextWidth) {
      // 將尚未超出的文字行加入多行文字陣列
      lines.push(currentLine);
      // 讓目前字元成為下一行的第一個字元
      currentLine = character;
    } else {
      // 將目前字元加入目前文字行
      currentLine = previewLine;
    }
  }
  // 將最後尚未加入陣列的文字行加入多行文字陣列
  if (currentLine.length > 0 || lines.length === 0) {
    // 儲存最後一行文字
    lines.push(currentLine);
  }
  // 回傳切分完成的多行文字陣列
  return lines;
}

// 計算題目方框的響應式版面資料
function getQuestionLayout() {
  // 取得依照視窗寬度與高度縮放的題目文字大小
  let questionTextSize = min(width * 0.045, height * 0.06, 30);
  // 設定題目文字大小供 textWidth() 正確測量文字寬度
  textSize(questionTextSize);
  // 設定題目方框寬度並保留左右邊界
  let questionBoxWidth = min(width * 0.88, 900);
  // 設定題目方框內側留白距離
  let questionPadding = max(14, min(width * 0.035, 28));
  // 計算題目文字可使用的最大寬度
  let questionTextWidth = questionBoxWidth - questionPadding * 2;
  // 將題目文字依照方框內可用寬度切成多行
  let questionLines = wrapQuestionText(questions[currentQuestion].question, questionTextWidth);
  // 設定每一行題目文字的行高
  let questionLineHeight = questionTextSize * 1.45;
  // 依照行數與上下留白計算方框高度
  let questionBoxHeight = questionLines.length * questionLineHeight + questionPadding * 2;
  // 設定題目方框的頂端位置
  let questionBoxY = height * 0.18;
  // 回傳題目方框與文字繪製所需的所有資料
  return {
    // 回傳方框水平位置
    x: width / 2 - questionBoxWidth / 2,
    // 回傳方框垂直位置
    y: questionBoxY,
    // 回傳方框寬度
    width: questionBoxWidth,
    // 回傳方框高度
    height: questionBoxHeight,
    // 回傳方框內側留白
    padding: questionPadding,
    // 回傳題目文字大小
    textSize: questionTextSize,
    // 回傳題目文字行高
    lineHeight: questionLineHeight,
    // 回傳切分後的題目文字
    lines: questionLines
  };
}

// p5.js 每一幀都會執行的函式
function draw() {
  // 設定畫布背景顏色
  background('#f7f7f7');

  // 判斷是否已經完成所有題目
  if (currentQuestion >= questions.length) {
    // 顯示測驗結束畫面
    drawResultScreen();

    // 結束本次 draw 函式
    return;
  }

  // 繪製測驗標題
  drawTitle();

  // 繪製目前題目
  drawQuestion();

  // 繪製選項
  drawOptions();

  // 如果使用者已作答，繪製下一題按鈕
  if (hasAnswered) {
    // 繪製下一題按鈕
    drawNextButton();
  }
}

// 繪製測驗標題
function drawTitle() {
  // 設定標題文字顏色
  fill('#222222');

  // 設定標題文字大小
  textSize(min(width * 0.05, 36));

  // 顯示目前題數
  text(
    'p5.js 程式設計指令練習測驗',
    width / 2,
    height * 0.07
  );

  // 設定題數文字大小
  textSize(min(width * 0.035, 22));

  // 顯示目前答題進度
  text(
    `第 ${currentQuestion + 1} 題，共 ${questions.length} 題`,
    width / 2,
    height * 0.13
  );
}

// 繪製目前題目
function drawQuestion() {
  // 取得題目方框的響應式版面資料
  let questionLayout = getQuestionLayout();
  // 設定題目方框背景顏色
  fill("#bdb2ff");
  // 繪製水平置中的題目方框
  rect(questionLayout.x, questionLayout.y, questionLayout.width, questionLayout.height, 12);
  // 設定題目文字顏色
  fill("#222222");
  // 設定題目文字大小
  textSize(questionLayout.textSize);
  // 設定題目文字水平與垂直置中
  textAlign(CENTER, CENTER);
  // 計算題目文字區域的水平中心位置
  let questionTextCenterX = questionLayout.x + questionLayout.width / 2;
  // 計算題目文字區域的垂直中心位置
  let questionTextCenterY = questionLayout.y + questionLayout.height / 2;
  // 逐行繪製題目文字以確保繁體中文完整顯示
  for (let i = 0; i < questionLayout.lines.length; i++) {
    // 計算目前文字行的垂直中心位置
    let lineY = questionTextCenterY + (i - (questionLayout.lines.length - 1) / 2) * questionLayout.lineHeight;
    // 將目前文字行繪製在方框水平中央
    text(questionLayout.lines[i], questionTextCenterX, lineY);
  }
}

// 繪製四個選項
function drawOptions() {
  // 取得目前題目資料
  let question = questions[currentQuestion];
  // 取得題目方框的響應式版面資料
  let questionLayout = getQuestionLayout();
  // 設定選項寬度
  let optionWidth = min(width * 0.82, 720);
  // 設定選項高度
  let optionHeight = min(height * 0.085, 65);
  // 設定選項之間的間距
  let optionGap = min(height * 0.025, 22);
  // 設定第一個選項的位置並避免與題目方框重疊
  let firstOptionY = max(height * 0.38, questionLayout.y + questionLayout.height + min(height * 0.04, 30));
  // 逐一繪製四個選項
  for (let i = 0; i < question.options.length; i++) {
    // 計算選項的原始水平位置
    let optionX = width / 2 - optionWidth / 2;
    // 計算選項的原始垂直位置
    let optionY = firstOptionY + i * (optionHeight + optionGap);
    // 設定選項水平動畫偏移量
    let horizontalOffset = 0;
    // 設定選項垂直動畫偏移量
    let verticalOffset = 0;
    // 判斷使用者是否已經作答
    if (hasAnswered) {
      // 計算動畫經過的時間
      let elapsedFrames = frameCount - animationStartFrame;
      // 判斷目前答案是否答錯
      if (!currentAnswerCorrect) {
        // 如果是正確答案，讓選項上下跳動
        if (i === question.answer) {
          // 使用正弦函式產生上下跳動效果
          verticalOffset = sin(elapsedFrames * 0.18) * 12;
        }
        // 如果是使用者答錯的選項，讓選項左右移動
        if (i === selectedAnswer) {
          // 使用正弦函式產生左右移動效果
          horizontalOffset = sin(elapsedFrames * 0.22) * 14;
        }
      }
    }
    // 設定選項背景顏色
    setOptionColor(i);
    // 繪製選項圓角矩形
    rect(optionX + horizontalOffset, optionY + verticalOffset, optionWidth, optionHeight, 12);
    // 設定選項文字顏色
    fill("#222222");
    // 設定選項文字大小
    textSize(min(width * 0.035, 23));
    // 顯示選項文字
    text(`${String.fromCharCode(65 + i)}. ${question.options[i]}`, width / 2 + horizontalOffset, optionY + optionHeight / 2 + verticalOffset);
  }
}

// 設定選項背景顏色
function setOptionColor(optionIndex) {
  // 判斷目前是否尚未作答
  if (!hasAnswered) {
    // 尚未作答時使用淡灰色
    fill('#e8e8e8');

    // 結束顏色設定
    return;
  }

  // 取得目前題目資料
  let question = questions[currentQuestion];

  // 如果本題答對
  if (currentAnswerCorrect) {
    // 將正確答案標示為淡綠色
    if (optionIndex === question.answer) {
      fill('#b6f2b6');
    } else {
      // 其他選項維持淡灰色
      fill('#e8e8e8');
    }

    // 結束顏色設定
    return;
  }

  // 如果本題答錯，將正確答案設定為指定淡黃色
  if (optionIndex === question.answer) {
    // 設定正確答案背景顏色
    fill('#fdffb6');

    // 結束顏色設定
    return;
  }

  // 如果本題答錯，將使用者選取的錯誤答案設定為指定紅色
  if (optionIndex === selectedAnswer) {
    // 設定錯誤答案背景顏色
    fill('#ff4d6d');

    // 結束顏色設定
    return;
  }

  // 其他未選擇的選項使用淡灰色
  fill('#e8e8e8');
}

// 繪製下一題按鈕
function drawNextButton() {
  // 設定按鈕背景顏色
  fill('#4d96ff');

  // 繪製按鈕圓角矩形
  rect(
    nextButton.x,
    nextButton.y,
    nextButton.width,
    nextButton.height,
    12
  );

  // 設定按鈕文字顏色
  fill('#ffffff');

  // 設定按鈕文字大小
  textSize(22);

  // 判斷是否為最後一題
  if (currentQuestion === questions.length - 1) {
    // 顯示查看結果文字
    text(
      '查看結果',
      width / 2,
      nextButton.y + nextButton.height / 2
    );
  } else {
    // 顯示下一題文字
    text(
      '下一題',
      width / 2,
      nextButton.y + nextButton.height / 2
    );
  }
}

// 繪製測驗結果畫面
function drawResultScreen() {
  // 設定結果標題顏色
  fill('#222222');

  // 設定結果標題文字大小
  textSize(min(width * 0.08, 48));

  // 顯示測驗結束文字
  text(
    '測驗結束！',
    width / 2,
    height * 0.35
  );

  // 設定分數文字大小
  textSize(min(width * 0.06, 36));

  // 顯示答對題數
  text(
    `你答對了 ${score} / ${questions.length} 題`,
    width / 2,
    height * 0.47
  );

  // 設定重新開始按鈕的位置
  let restartX = width / 2 - 110;

  // 設定重新開始按鈕的垂直位置
  let restartY = height * 0.62;

  // 設定重新開始按鈕背景顏色
  fill('#4d96ff');

  // 繪製重新開始按鈕
  rect(
    restartX,
    restartY,
    220,
    60,
    12
  );

  // 設定重新開始按鈕文字顏色
  fill('#ffffff');

  // 設定重新開始按鈕文字大小
  textSize(22);

  // 顯示重新開始文字
  text(
    '重新開始',
    width / 2,
    restartY + 30
  );
}

// 處理滑鼠按下事件
function mousePressed() {
  // 呼叫統一的輸入處理函式
  handleInput(mouseX, mouseY);

  // 回傳 false，避免瀏覽器觸發額外行為
  return false;
}

// 處理觸控開始事件
function touchStarted() {
  // 呼叫統一的輸入處理函式
  handleInput(mouseX, mouseY);

  // 回傳 false，避免行動裝置畫面滾動
  return false;
}

// 處理滑鼠與觸控輸入
function handleInput(inputX, inputY) {
  // 判斷是否已經完成所有題目
  if (currentQuestion >= questions.length) {
    // 設定重新開始按鈕的水平位置
    let restartX = width / 2 - 110;

    // 設定重新開始按鈕的垂直位置
    let restartY = height * 0.62;

    // 判斷是否點擊重新開始按鈕
    if (
      inputX >= restartX &&
      inputX <= restartX + 220 &&
      inputY >= restartY &&
      inputY <= restartY + 60
    ) {
      // 重新設定目前題目
      currentQuestion = 0;

      // 重新設定答對題數
      score = 0;

      // 重新設定作答狀態
      hasAnswered = false;

      // 重新設定答案狀態
      currentAnswerCorrect = false;

      // 重新設定選擇答案
      selectedAnswer = -1;
    }

    // 結束輸入處理
    return;
  }

  // 如果使用者已經作答，處理下一題按鈕
  if (hasAnswered) {
    // 判斷是否點擊下一題按鈕
    if (
      inputX >= nextButton.x &&
      inputX <= nextButton.x + nextButton.width &&
      inputY >= nextButton.y &&
      inputY <= nextButton.y + nextButton.height
    ) {
      // 題目編號加一
      currentQuestion++;

      // 設定為尚未作答
      hasAnswered = false;

      // 重設本題正確狀態
      currentAnswerCorrect = false;

      // 重設選擇答案
      selectedAnswer = -1;
    }

    // 結束輸入處理
    return;
  }

  // 取得目前題目資料
  let question = questions[currentQuestion];

  // 設定選項寬度
  let optionWidth = min(width * 0.82, 720);

  // 設定選項高度
  let optionHeight = min(height * 0.085, 65);

  // 設定選項之間的間距
  let optionGap = min(height * 0.025, 22);

  // 取得題目方框的響應式版面資料
  let questionLayout = getQuestionLayout();

  // 設定第一個選項的位置並避免與題目方框重疊
  let firstOptionY = max(
    height * 0.38,
    questionLayout.y + questionLayout.height + min(height * 0.04, 30)
  );

  // 逐一檢查四個選項
  for (let i = 0; i < question.options.length; i++) {
    // 計算選項水平位置
    let optionX = width / 2 - optionWidth / 2;

    // 計算選項垂直位置
    let optionY = firstOptionY + i * (optionHeight + optionGap);

    // 判斷輸入位置是否位於選項內
    if (
      inputX >= optionX &&
      inputX <= optionX + optionWidth &&
      inputY >= optionY &&
      inputY <= optionY + optionHeight
    ) {
      // 記錄使用者選擇的選項
      selectedAnswer = i;

      // 設定目前已完成作答
      hasAnswered = true;

      // 記錄動畫開始時間
      animationStartFrame = frameCount;

      // 判斷使用者答案是否正確
      currentAnswerCorrect = i === question.answer;

      // 如果答案正確，增加分數
      if (currentAnswerCorrect) {
        // 將答對題數加一
        score++;
      }

      // 停止檢查其他選項
      break;
    }
  }
}
```
:::


---

## 學習2：網頁設定為響應式網頁

https://cfchen58.synology.me/115/week4/stage2/

**這個階段的目標：** 讓網站在電腦、平板、手機（直向與橫向）都能正常顯示，視窗大小改變時版面自動調整。
**這個階段會修改的檔案：** index.html、sketch.js

### 執行截圖

![20261008_2](https://hackmd.io/_uploads/HJYPs3ViMg.gif)


### 第一次問 AI

```tex!
網頁設定為響應式網頁，主要是要讓網站在電腦、平板、手機（直向與橫向）都能正常顯示，視窗大小改變時版面自動調整。
```




### 程式碼內容

:::info
:::spoiler 點開貼上學習2的程式碼
```javascript=
// 宣告測驗題目資料陣列
let questions = [
  // 建立第一題資料
  {
    // 設定第一題題目文字
    question: "在 p5.js 中，要繪製橢圓形應該使用哪一個函式？",
    // 設定第一題的四個選項
    options: ["rect()", "ellipse()", "line()", "triangle()"],
    // 設定第一題正確答案的索引值
    answer: 1
  },
  // 建立第二題資料
  {
    // 設定第二題題目文字
    question: "哪一個函式可以設定圖形的填滿顏色？",
    // 設定第二題的四個選項
    options: ["stroke()", "noFill()", "fill()", "background()"],
    // 設定第二題正確答案的索引值
    answer: 2
  },
  // 建立第三題資料
  {
    // 設定第三題資料
    question: "background(0) 會產生什麼效果？",
    // 設定第三題的四個選項
    options: ["白色背景", "黑色背景", "紅色背景", "透明背景"],
    // 設定第三題正確答案的索引值
    answer: 1
  },
  // 建立第四題資料
  {
    // 設定第四題題目文字
    question: "哪一個函式可以在畫布上繪製直線？",
    // 設定第四題的四個選項
    options: ["circle()", "point()", "line()", "text()"],
    // 設定第四題正確答案的索引值
    answer: 2
  },
  // 建立第五題資料
  {
    // 設定第五題題目文字
    question: "p5.js 中的 setup() 函式通常會執行幾次？",
    // 設定第五題的四個選項
    options: ["每一幀一次", "只執行一次", "滑鼠點擊時執行", "鍵盤按下時執行"],
    // 設定第五題正確答案的索引值
    answer: 1
  }
];

// 設定目前顯示的題目索引值
let currentQuestion = 0;
// 設定目前題目是否已經作答
let hasAnswered = false;
// 設定目前答案是否正確
let currentAnswerCorrect = false;
// 設定目前選取的答案索引值
let selectedAnswer = -1;
// 設定目前測驗累計答對題數
let score = 0;
// 記錄答案動畫開始時的影格編號
let animationStartFrame = 0;
// 保存畫布元素，方便設定父層與觸控樣式
let canvasElement;
// 記錄最近一次觸控時間，避免行動裝置重複觸發滑鼠事件
let lastTouchTime = -1000;
// 保存目前畫布父層元素
let canvasParent;

// p5.js 初始化函式
function setup() {
  // 將整個網頁設定為無外距、不可捲動並限制觸控預設行為
  document.documentElement.style.margin = "0";
  // 將 body 設定為無外距
  document.body.style.margin = "0";
  // 將 body 設定為滿版顯示
  document.body.style.width = "100%";
  // 將 body 設定為滿版高度
  document.body.style.height = "100%";
  // 防止行動裝置觸控時捲動網頁
  document.body.style.overflow = "hidden";
  // 防止行動裝置觸控時縮放或拖曳頁面
  document.body.style.touchAction = "none";
  // 建立專用畫布父層容器
  canvasParent = document.createElement("main");
  // 設定畫布父層的識別名稱
  canvasParent.id = "p5-responsive-quiz-canvas";
  // 設定畫布父層填滿視窗寬度
  canvasParent.style.width = "100vw";
  // 設定畫布父層填滿視窗高度
  canvasParent.style.height = "100vh";
  // 設定畫布父層固定在視窗左上角
  canvasParent.style.position = "fixed";
  // 設定畫布父層的左側位置
  canvasParent.style.left = "0";
  // 設定畫布父層的上側位置
  canvasParent.style.top = "0";
  // 設定畫布父層不允許觸控手勢穿透
  canvasParent.style.touchAction = "none";
  // 將畫布父層加入網頁
  document.body.appendChild(canvasParent);
  // 取得適合目前裝置的高 DPI 倍率
  pixelDensity(getSafePixelDensity());
  // 建立符合視窗大小的 p5.js 畫布
  canvasElement = createCanvas(getViewportWidth(), getViewportHeight());
  // 將畫布放入專用父層容器
  canvasElement.parent(canvasParent);
  // 設定畫布元素的寬度由 CSS 控制
  canvasElement.elt.style.width = "100%";
  // 設定畫布元素的高度由 CSS 控制
  canvasElement.elt.style.height = "100%";
  // 設定畫布元素不接受瀏覽器預設觸控手勢
  canvasElement.elt.style.touchAction = "none";
  // 設定畫布元素不顯示空白行內元素間距
  canvasElement.elt.style.display = "block";
  // 設定畫布的無障礙標籤
  canvasElement.elt.setAttribute("aria-label", "p5.js 程式設計指令練習測驗");
  // 設定畫布文字水平與垂直皆置中
  textAlign(CENTER, CENTER);
  // 設定畫布不繪製外框線
  noStroke();
  // 設定畫布的預設文字大小
  textSize(20);
  // 設定畫布的預設文字字型
  textFont("sans-serif");
  // 先計算一次響應式版面資料
  getLayout();
}

// 取得目前瀏覽器可使用的視窗寬度
function getViewportWidth() {
  // 回傳至少一個像素的整數寬度
  return Math.max(1, Math.floor(window.innerWidth || windowWidth));
}

// 取得目前瀏覽器可使用的視窗高度
function getViewportHeight() {
  // 回傳至少一個像素的整數高度
  return Math.max(1, Math.floor(window.innerHeight || windowHeight));
}

// 取得限制在合理範圍內的裝置像素倍率
function getSafePixelDensity() {
  // 讀取瀏覽器提供的裝置像素倍率
  const deviceRatio = Number(window.devicePixelRatio) || 1;
  // 將高 DPI 畫面限制為最多兩倍以避免行動裝置效能負擔過大
  return Math.min(Math.max(deviceRatio, 1), 2);
}

// 當瀏覽器視窗大小改變時重新調整畫布
function windowResized() {
  // 重新套用目前裝置的高 DPI 倍率
  pixelDensity(getSafePixelDensity());
  // 使用新的視窗尺寸調整畫布
  resizeCanvas(getViewportWidth(), getViewportHeight());
  // 重新計算目前畫面所需的版面資料以配合新尺寸
  getCurrentInteractionLayout();
}

// 將題目或選項文字依照實際像素寬度切成多行
function wrapTextByWidth(sourceText, maxWidth, fontSize) {
  // 設定測量文字所使用的字型大小
  textSize(fontSize);
  // 建立存放換行結果的陣列
  const lines = [];
  // 建立目前正在組合的文字行
  let currentLine = "";
  // 逐一檢查文字中的每一個字元
  for (let index = 0; index < sourceText.length; index += 1) {
    // 取得目前檢查的字元
    const character = sourceText.charAt(index);
    // 遇到手動換行符號時直接結束目前文字行
    if (character === "\n") {
      // 將目前文字行加入換行結果
      lines.push(currentLine);
      // 清空目前文字行
      currentLine = "";
      // 進入下一個字元
      continue;
    }
    // 建立加入新字元後的預覽文字
    const previewLine = currentLine + character;
    // 判斷預覽文字是否超過可用寬度
    if (currentLine.length > 0 && textWidth(previewLine) > maxWidth) {
      // 將尚未超出的文字行加入結果
      lines.push(currentLine);
      // 以目前字元開始建立下一行
      currentLine = character;
    } else {
      // 將目前字元加入目前文字行
      currentLine = previewLine;
    }
  }
  // 將最後一行加入結果陣列
  if (currentLine.length > 0 || lines.length === 0) {
    // 保存最後一行文字
    lines.push(currentLine);
  }
  // 回傳完成換行的文字陣列
  return lines;
}

// 將數值限制在指定的最小值與最大值之間
function clampValue(value, minimum, maximum) {
  // 回傳限制範圍後的數值
  return Math.max(minimum, Math.min(maximum, value));
}

// 計算包含所有畫面元件與點擊區域的唯一響應式版面資料
function getLayout() {
  // 讀取目前畫布的邏輯寬度
  const canvasWidth = Math.max(1, width);
  // 讀取目前畫布的邏輯高度
  const canvasHeight = Math.max(1, height);
  // 設定畫布四周的響應式外距
  const outerMargin = clampValue(Math.min(canvasWidth * 0.05, canvasHeight * 0.035), 6, 48);
  // 判斷目前是否為橫向畫面
  const isLandscape = canvasWidth > canvasHeight;
  // 設定內容可使用的最大寬度
  const contentWidth = Math.max(1, canvasWidth - outerMargin * 2);
  // 設定初始縮放倍率，讓手機與平板的尺寸自然縮放
  let fitScale = clampValue(Math.min(canvasWidth / 480, canvasHeight / 760), 0.35, 1.15);
  // 建立最後一次計算的版面資料
  let finalLayout = null;
  // 反覆縮小元件直到全部內容能放入畫布
  for (let attempt = 0; attempt < 10; attempt += 1) {
    // 計算標題字型大小
    const titleSize = Math.max(8, Math.min(34, canvasWidth * 0.055, canvasHeight * 0.075) * fitScale);
    // 計算進度文字大小
    const progressSize = Math.max(7, Math.min(21, canvasWidth * 0.034, canvasHeight * 0.045) * fitScale);
    // 計算標題區塊的上方位置
    const headerTop = Math.max(3, outerMargin * 0.55);
    // 計算標題文字的垂直中心
    const titleY = headerTop + titleSize * 0.6;
    // 計算進度文字的垂直中心
    const progressY = titleY + titleSize * 0.72 + progressSize * 0.75;
    // 計算題目與進度文字之間的間距
    const headerGap = Math.max(3, Math.min(18, canvasHeight * 0.018) * fitScale);
    // 計算題目文字大小
    const questionTextSize = Math.max(8, Math.min(30, canvasWidth * 0.045, canvasHeight * 0.062) * fitScale);
    // 計算題目方框寬度
    const questionWidth = Math.min(contentWidth, 900);
    // 計算題目方框內側留白
    const questionPadding = Math.max(5, Math.min(28, canvasWidth * 0.035, canvasHeight * 0.04) * fitScale);
    // 計算題目文字的最大寬度
    const questionTextWidth = Math.max(1, questionWidth - questionPadding * 2);
    // 依實際字寬計算題目換行內容
    const questionLines = wrapTextByWidth(questions[currentQuestion].question, questionTextWidth, questionTextSize);
    // 計算題目每一行的高度
    const questionLineHeight = Math.max(9, questionTextSize * 1.38);
    // 計算題目方框高度
    const questionHeight = Math.max(questionLineHeight + questionPadding * 2, questionLines.length * questionLineHeight + questionPadding * 2);
    // 計算題目方框的垂直位置
    const questionY = progressY + progressSize * 0.55 + headerGap;
    // 計算選項文字大小
    const optionTextSize = Math.max(7, Math.min(23, canvasWidth * 0.035, canvasHeight * 0.043) * fitScale);
    // 計算選項方框寬度
    const optionWidth = Math.min(contentWidth, 720);
    // 計算選項內側留白
    const optionPadding = Math.max(4, Math.min(20, canvasWidth * 0.025) * fitScale);
    // 計算選項文字可使用寬度
    const optionTextWidth = Math.max(1, optionWidth - optionPadding * 2);
    // 計算選項的預設行高
    const optionLineHeight = Math.max(8, optionTextSize * 1.25);
    // 建立選項換行內容陣列
    const optionLines = [];
    // 記錄所有選項中最多的行數
    let maximumOptionLines = 1;
    // 逐一計算四個選項的換行內容
    for (let optionIndex = 0; optionIndex < questions[currentQuestion].options.length; optionIndex += 1) {
      // 組合選項字母與文字
      const optionLabel = String.fromCharCode(65 + optionIndex) + ". " + questions[currentQuestion].options[optionIndex];
      // 計算目前選項需要的行數
      const currentLines = wrapTextByWidth(optionLabel, optionTextWidth, optionTextSize);
      // 保存目前選項換行內容
      optionLines.push(currentLines);
      // 更新所有選項中的最大行數
      maximumOptionLines = Math.max(maximumOptionLines, currentLines.length);
    }
    // 計算選項高度並確保多行文字不會超出方框
    const optionHeight = Math.max(12, Math.min(64, Math.max(canvasHeight * 0.075, maximumOptionLines * optionLineHeight + optionPadding * 2)) * fitScale);
    // 計算選項之間的垂直間距
    const optionGap = Math.max(2, Math.min(20, canvasHeight * 0.019) * fitScale);
    // 計算選項區塊與題目方框的間距
    const questionToOptionsGap = Math.max(4, Math.min(28, canvasHeight * 0.035) * fitScale);
    // 計算選項第一列的理想位置
    const firstOptionY = questionY + questionHeight + questionToOptionsGap;
    // 計算下一題按鈕的高度
    const buttonHeight = Math.max(20, Math.min(60, canvasHeight * 0.075) * fitScale);
    // 計算下一題按鈕的寬度
    const buttonWidth = Math.min(optionWidth, Math.max(110, Math.min(280, canvasWidth * 0.46)) * fitScale);
    // 計算按鈕與選項之間的間距
    const buttonGap = Math.max(4, Math.min(24, canvasHeight * 0.03) * fitScale);
    // 計算畫布底部的安全間距
    const bottomMargin = Math.max(3, outerMargin * 0.55);
    // 計算四個選項的總高度
    const optionsHeight = questions[currentQuestion].options.length * optionHeight + (questions[currentQuestion].options.length - 1) * optionGap;
    // 計算作答後按鈕所需的區域高度
    const buttonAreaHeight = hasAnswered ? buttonGap + buttonHeight : 0;
    // 計算本版面需要的總高度
    const requiredHeight = firstOptionY + optionsHeight + buttonAreaHeight + bottomMargin;
    // 計算目前畫面可容納的高度比例
    const availableHeight = Math.max(1, canvasHeight);
    // 保存本次計算結果
    finalLayout = {
      // 保存畫布寬度
      canvasWidth: canvasWidth,
      // 保存畫布高度
      canvasHeight: canvasHeight,
      // 保存是否為橫向畫面
      isLandscape: isLandscape,
      // 保存標題字型大小
      titleSize: titleSize,
      // 保存標題位置
      titleY: titleY,
      // 保存進度文字大小
      progressSize: progressSize,
      // 保存進度文字位置
      progressY: progressY,
      // 保存題目方框資料
      question: {
        // 保存題目方框左側位置
        x: (canvasWidth - questionWidth) / 2,
        // 保存題目方框上側位置
        y: questionY,
        // 保存題目方框寬度
        width: questionWidth,
        // 保存題目方框高度
        height: questionHeight,
        // 保存題目內距
        padding: questionPadding,
        // 保存題目字型大小
        textSize: questionTextSize,
        // 保存題目行高
        lineHeight: questionLineHeight,
        // 保存題目換行結果
        lines: questionLines
      },
      // 保存選項共同資料
      options: [],
      // 保存每個選項的換行內容
      optionLines: optionLines,
      // 保存選項文字大小
      optionTextSize: optionTextSize,
      // 保存選項文字行高
      optionLineHeight: optionLineHeight,
      // 保存選項內距
      optionPadding: optionPadding,
      // 保存選項寬度
      optionWidth: optionWidth,
      // 保存選項高度
      optionHeight: optionHeight,
      // 保存選項間距
      optionGap: optionGap,
      // 保存下一題按鈕資料
      nextButton: {
        // 保存按鈕水平位置
        x: (canvasWidth - buttonWidth) / 2,
        // 保存按鈕垂直位置，並限制在畫布內
        y: Math.min(canvasHeight - bottomMargin - buttonHeight, firstOptionY + optionsHeight + buttonGap),
        // 保存按鈕寬度
        width: buttonWidth,
        // 保存按鈕高度
        height: buttonHeight
      },
      // 保存按鈕文字大小
      buttonTextSize: Math.max(8, Math.min(22, buttonHeight * 0.38)),
      // 保存底部安全間距
      bottomMargin: bottomMargin,
      // 保存目前縮放倍率
      scale: fitScale,
      // 保存本次所需總高度
      requiredHeight: requiredHeight
    };
    // 計算是否需要進一步縮小內容
    if (requiredHeight <= availableHeight - 1) {
      // 當內容已經放入畫布時結束縮放迴圈
      break;
    }
    // 計算下一次縮放倍率並保留最低可用倍率
    fitScale = Math.max(0.22, fitScale * Math.min(0.92, (availableHeight - bottomMargin) / Math.max(requiredHeight, 1)));
  }
  // 重新依據最後版面資料建立所有選項的實際矩形與動畫位置
  const finalQuestion = questions[currentQuestion];
  // 計算動畫經過的影格數
  const elapsedFrames = frameCount - animationStartFrame;
  // 計算正確答案上下跳動幅度
  const verticalAmplitude = hasAnswered && !currentAnswerCorrect ? Math.min(finalLayout.optionGap * 0.35, finalLayout.optionHeight * 0.18) : 0;
  // 計算錯誤答案左右移動幅度
  const horizontalAmplitude = hasAnswered && !currentAnswerCorrect ? Math.min(14 * finalLayout.scale, Math.max(0, (canvasWidth - finalLayout.optionWidth) / 2 - 2)) : 0;
  // 逐一建立每個選項的完整幾何資料
  for (let optionIndex = 0; optionIndex < finalQuestion.options.length; optionIndex += 1) {
    // 計算目前選項的原始上側位置
    const baseY = firstOptionYFromLayout(finalLayout, optionIndex);
    // 設定選項初始水平動畫位移
    let horizontalOffset = 0;
    // 設定選項初始垂直動畫位移
    let verticalOffset = 0;
    // 答錯時讓正確選項上下跳動
    if (hasAnswered && !currentAnswerCorrect && optionIndex === finalQuestion.answer) {
      // 使用正弦函式計算上下跳動位移
      verticalOffset = Math.sin(elapsedFrames * 0.18) * verticalAmplitude;
    }
    // 答錯時讓使用者選錯的選項左右移動
    if (hasAnswered && !currentAnswerCorrect && optionIndex === selectedAnswer) {
      // 使用正弦函式計算左右移動位移
      horizontalOffset = Math.sin(elapsedFrames * 0.22) * horizontalAmplitude;
    }
    // 保存選項文字與矩形共用的實際幾何資料
    finalLayout.options.push({
      // 保存選項索引值
      index: optionIndex,
      // 保存選項左側位置
      x: (canvasWidth - finalLayout.optionWidth) / 2 + horizontalOffset,
      // 保存選項上側位置
      y: baseY + verticalOffset,
      // 保存選項寬度
      width: finalLayout.optionWidth,
      // 保存選項高度
      height: finalLayout.optionHeight,
      // 保存選項水平動畫位移
      horizontalOffset: horizontalOffset,
      // 保存選項垂直動畫位移
      verticalOffset: verticalOffset,
      // 保存該選項的換行文字
      lines: finalLayout.optionLines ? finalLayout.optionLines[optionIndex] : wrapTextByWidth(String.fromCharCode(65 + optionIndex) + ". " + finalQuestion.options[optionIndex], finalLayout.optionWidth - finalLayout.optionPadding * 2, finalLayout.optionTextSize)
    });
  }
  // 回傳完整的響應式版面資料
  return finalLayout;
}

// 依照版面資料計算指定選項的原始垂直位置
function firstOptionYFromLayout(layout, optionIndex) {
  // 取得題目方框下方的安全間距
  const questionToOptionsGap = Math.max(4, Math.min(28, layout.canvasHeight * 0.035) * layout.scale);
  // 回傳指定選項沒有動畫時的垂直位置
  return layout.question.y + layout.question.height + questionToOptionsGap + optionIndex * (layout.optionHeight + layout.optionGap);
}

// 繪製 p5.js 每一幀的畫面
function draw() {
  // 以淺灰色清除整個畫布
  background("#f7f7f7");
  // 取得本幀繪製與互動共用的版面資料
  const layout = getCurrentInteractionLayout();
  // 判斷是否已經完成所有題目
  if (currentQuestion >= questions.length) {
    // 繪製測驗結果畫面
    drawResultScreen(layout);
    // 結束本幀繪製
    return;
  }
  // 繪製測驗標題與進度
  drawTitle(layout);
  // 繪製題目方框與題目文字
  drawQuestion(layout);
  // 繪製四個選項
  drawOptions(layout);
  // 作答後才顯示下一題按鈕
  if (hasAnswered) {
    // 繪製下一題按鈕
    drawNextButton(layout);
  }
}

// 繪製測驗標題與答題進度
function drawTitle(layout) {
  // 設定標題文字顏色
  fill("#222222");
  // 設定標題文字大小
  textSize(layout.titleSize);
  // 設定文字水平與垂直置中
  textAlign(CENTER, CENTER);
  // 繪製測驗標題
  text("p5.js 程式設計指令練習測驗", layout.canvasWidth / 2, layout.titleY);
  // 設定進度文字大小
  textSize(layout.progressSize);
  // 繪製目前題目進度
  text("第 " + (currentQuestion + 1) + " 題，共 " + questions.length + " 題", layout.canvasWidth / 2, layout.progressY);
}

// 繪製目前題目的紫色方框與自動換行文字
function drawQuestion(layout) {
  // 設定題目方框背景顏色
  fill("#bdb2ff");
  // 繪製水平置中的題目方框
  rect(layout.question.x, layout.question.y, layout.question.width, layout.question.height, Math.min(14, layout.question.height * 0.18));
  // 設定題目文字顏色
  fill("#222222");
  // 設定題目文字大小
  textSize(layout.question.textSize);
  // 設定題目文字置中對齊
  textAlign(CENTER, CENTER);
  // 取得題目文字區域的水平中心
  const centerX = layout.question.x + layout.question.width / 2;
  // 取得題目文字區域的垂直中心
  const centerY = layout.question.y + layout.question.height / 2;
  // 逐行繪製題目文字
  for (let lineIndex = 0; lineIndex < layout.question.lines.length; lineIndex += 1) {
    // 計算目前文字行的垂直位置
    const lineY = centerY + (lineIndex - (layout.question.lines.length - 1) / 2) * layout.question.lineHeight;
    // 繪製目前文字行
    text(layout.question.lines[lineIndex], centerX, lineY);
  }
}

// 繪製四個選項並套用答題動畫
function drawOptions(layout) {
  // 取得目前題目資料
  const question = questions[currentQuestion];
  // 設定選項文字大小
  textSize(layout.optionTextSize);
  // 設定選項文字置中對齊
  textAlign(CENTER, CENTER);
  // 逐一繪製每一個選項
  for (let optionIndex = 0; optionIndex < layout.options.length; optionIndex += 1) {
    // 取得目前選項的共用幾何資料
    const option = layout.options[optionIndex];
    // 設定目前選項的背景顏色
    setOptionColor(optionIndex);
    // 繪製目前選項矩形
    rect(option.x, option.y, option.width, option.height, Math.min(14, option.height * 0.22));
    // 設定選項文字顏色
    fill("#222222");
    // 取得目前選項文字的換行結果
    const lines = option.lines || [String.fromCharCode(65 + optionIndex) + ". " + question.options[optionIndex]];
    // 計算目前選項文字的總高度
    const textBlockHeight = lines.length * layout.optionLineHeight;
    // 計算目前選項文字區塊的垂直中心
    const textCenterY = option.y + option.height / 2;
    // 逐行繪製目前選項文字
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
      // 計算目前選項文字行的垂直位置
      const lineY = textCenterY + (lineIndex - (lines.length - 1) / 2) * layout.optionLineHeight;
      // 繪製目前選項文字行
      text(lines[lineIndex], option.x + option.width / 2, lineY);
    }
  }
}

// 依照目前作答狀態設定選項顏色
function setOptionColor(optionIndex) {
  // 尚未作答時所有選項使用淡灰色
  if (!hasAnswered) {
    // 設定尚未作答選項顏色
    fill("#e8e8e8");
    // 結束顏色判斷
    return;
  }
  // 取得目前題目資料
  const question = questions[currentQuestion];
  // 答對時將正確答案標示為淡綠色
  if (currentAnswerCorrect) {
    // 判斷目前選項是否為正確答案
    if (optionIndex === question.answer) {
      // 設定正確答案顏色
      fill("#b6f2b6");
    } else {
      // 設定其他選項顏色
      fill("#e8e8e8");
    }
    // 結束顏色判斷
    return;
  }
  // 答錯時將正確選項設定為指定淡黃色
  if (optionIndex === question.answer) {
    // 設定正確答案的淡黃色
    fill("#fdffb6");
    // 結束顏色判斷
    return;
  }
  // 答錯時將使用者選取的錯誤選項設定為指定紅色
  if (optionIndex === selectedAnswer) {
    // 設定錯誤答案的紅色
    fill("#ff4d6d");
    // 結束顏色判斷
    return;
  }
  // 其他選項維持淡灰色
  fill("#e8e8e8");
}

// 繪製作答後的下一題或查看結果按鈕
function drawNextButton(layout) {
  // 設定按鈕背景顏色
  fill("#4d96ff");
  // 繪製下一題按鈕
  rect(layout.nextButton.x, layout.nextButton.y, layout.nextButton.width, layout.nextButton.height, Math.min(14, layout.nextButton.height * 0.22));
  // 設定按鈕文字顏色
  fill("#ffffff");
  // 設定按鈕文字大小
  textSize(layout.buttonTextSize);
  // 設定按鈕文字置中
  textAlign(CENTER, CENTER);
  // 判斷目前是否為最後一題
  const buttonLabel = currentQuestion === questions.length - 1 ? "查看結果" : "下一題";
  // 繪製按鈕文字
  text(buttonLabel, layout.nextButton.x + layout.nextButton.width / 2, layout.nextButton.y + layout.nextButton.height / 2);
}

// 計算並繪製測驗結果畫面
function drawResultScreen(layout) {
  // 設定結果標題文字顏色
  fill("#222222");
  // 設定結果標題字型大小
  textSize(layout.resultTitleSize);
  // 設定結果文字置中
  textAlign(CENTER, CENTER);
  // 繪製測驗結束標題
  text("測驗結束！", layout.canvasWidth / 2, layout.resultTitleY);
  // 設定分數文字大小
  textSize(layout.resultScoreSize);
  // 繪製答對題數
  text("你答對了 " + score + " / " + questions.length + " 題", layout.canvasWidth / 2, layout.resultScoreY);
  // 設定重新開始按鈕背景顏色
  fill("#4d96ff");
  // 繪製重新開始按鈕
  rect(layout.restartButton.x, layout.restartButton.y, layout.restartButton.width, layout.restartButton.height, Math.min(14, layout.restartButton.height * 0.22));
  // 設定重新開始文字顏色
  fill("#ffffff");
  // 設定重新開始文字大小
  textSize(layout.resultButtonTextSize);
  // 繪製重新開始文字
  text("重新開始", layout.restartButton.x + layout.restartButton.width / 2, layout.restartButton.y + layout.restartButton.height / 2);
}

// 建立測驗結果頁面所使用的響應式版面資料
function getResultLayout() {
  // 讀取目前畫布寬度
  const canvasWidth = Math.max(1, width);
  // 讀取目前畫布高度
  const canvasHeight = Math.max(1, height);
  // 設定結果頁面的按鈕寬度
  const buttonWidth = Math.min(Math.max(120, canvasWidth * 0.46), 280);
  // 設定結果頁面的按鈕高度
  const buttonHeight = clampValue(Math.min(canvasHeight * 0.09, 60), 24, 60);
  // 回傳結果頁面所有元件的幾何資料
  return {
    // 保存結果頁面畫布寬度
    canvasWidth: canvasWidth,
    // 保存結果頁面畫布高度
    canvasHeight: canvasHeight,
    // 保存結果標題大小
    resultTitleSize: clampValue(Math.min(canvasWidth * 0.08, canvasHeight * 0.12), 12, 48),
    // 保存結果標題位置
    resultTitleY: canvasHeight * 0.29,
    // 保存結果分數文字大小
    resultScoreSize: clampValue(Math.min(canvasWidth * 0.06, canvasHeight * 0.08), 10, 36),
    // 保存結果分數位置
    resultScoreY: canvasHeight * 0.43,
    // 保存重新開始按鈕資料
    restartButton: {
      // 保存按鈕左側位置
      x: (canvasWidth - buttonWidth) / 2,
      // 保存按鈕上側位置
      y: Math.min(canvasHeight * 0.62, canvasHeight - buttonHeight - 8),
      // 保存按鈕寬度
      width: buttonWidth,
      // 保存按鈕高度
      height: buttonHeight
    },
    // 保存結果按鈕文字大小
    resultButtonTextSize: clampValue(buttonHeight * 0.38, 9, 22)
  };
}

// 取得目前畫面應使用的版面資料
function getCurrentInteractionLayout() {
  // 判斷是否已經完成所有題目
  if (currentQuestion >= questions.length) {
    // 回傳結果畫面的版面資料
    return getResultLayout();
  }
  // 回傳測驗畫面的版面資料
  return getLayout();
}

// 處理滑鼠按下事件
function mousePressed() {
  // 忽略觸控後瀏覽器模擬產生的重複滑鼠事件
  if (millis() - lastTouchTime < 500) {
    // 阻止瀏覽器預設行為
    return false;
  }
  // 使用 p5.js 的畫布座標處理滑鼠輸入
  handleInput(mouseX, mouseY);
  // 阻止瀏覽器預設行為
  return false;
}

// 處理觸控開始事件
function touchStarted() {
  // 記錄本次觸控發生時間
  lastTouchTime = millis();
  // 使用 p5.js 的畫布座標處理觸控輸入
  handleInput(mouseX, mouseY);
  // 阻止行動裝置瀏覽器的捲動與縮放行為
  return false;
}

// 判斷座標是否位於指定矩形內
function isPointInsideRectangle(inputX, inputY, rectangle) {
  // 回傳座標是否同時落在矩形的四個邊界內
  return inputX >= rectangle.x && inputX <= rectangle.x + rectangle.width && inputY >= rectangle.y && inputY <= rectangle.y + rectangle.height;
}

// 統一處理滑鼠與觸控的點擊輸入
function handleInput(inputX, inputY) {
  // 取得目前畫面與點擊區域共用的版面資料
  const layout = getCurrentInteractionLayout();
  // 判斷是否已經完成全部題目
  if (currentQuestion >= questions.length) {
    // 判斷是否點擊重新開始按鈕
    if (isPointInsideRectangle(inputX, inputY, layout.restartButton)) {
      // 將題目索引重設為第一題
      currentQuestion = 0;
      // 將答對題數歸零
      score = 0;
      // 將作答狀態重設為未作答
      hasAnswered = false;
      // 將正確狀態重設為否
      currentAnswerCorrect = false;
      // 將選擇答案重設為無
      selectedAnswer = -1;
      // 將動畫起始影格重設為目前影格
      animationStartFrame = frameCount;
    }
    // 結束結果頁面的輸入處理
    return;
  }
  // 作答後只允許點擊下一題按鈕
  if (hasAnswered) {
    // 判斷點擊是否位於下一題按鈕內
    if (isPointInsideRectangle(inputX, inputY, layout.nextButton)) {
      // 將目前題目索引加一
      currentQuestion += 1;
      // 將作答狀態重設為未作答
      hasAnswered = false;
      // 將正確狀態重設為否
      currentAnswerCorrect = false;
      // 將選擇答案重設為無
      selectedAnswer = -1;
      // 將動畫起始影格更新為目前影格
      animationStartFrame = frameCount;
    }
    // 結束作答後的輸入處理
    return;
  }
  // 逐一檢查點擊是否落在某一個選項內
  for (let optionIndex = 0; optionIndex < layout.options.length; optionIndex += 1) {
    // 取得目前選項的實際動畫後矩形
    const option = layout.options[optionIndex];
    // 判斷輸入座標是否位於目前選項內
    if (isPointInsideRectangle(inputX, inputY, option)) {
      // 記錄使用者選擇的答案
      selectedAnswer = optionIndex;
      // 設定本題已完成作答
      hasAnswered = true;
      // 記錄動畫開始影格
      animationStartFrame = frameCount;
      // 判斷使用者答案是否正確
      currentAnswerCorrect = optionIndex === questions[currentQuestion].answer;
      // 答案正確時增加總分
      if (currentAnswerCorrect) {
        // 將答對題數加一
        score += 1;
      }
      // 停止檢查其他選項
      break;
    }
  }
}


```
:::


---

## 學習3：設定嵌入 Google 字型，網頁文字採用這些字型

https://cfchen58.synology.me/115/week4/stage3/

**這個階段的目標：** 從 Google Fonts 嵌入繁體中文字型，並讓畫布上的題目與選項文字使用這些字型。
**這個階段會修改的檔案：** index.html、sketch.js

### 執行截圖

（把截圖拖曳到這裡，或貼上圖片連結）

![學習3截圖](請貼上截圖)

### 第一次問 AI

```tex!
（逐字貼上你第一次問 AI 的提示詞）
```

### 第二次問 AI

```tex!
（逐字貼上你第二次問 AI 的提示詞）
```

### 第三次問 AI

```tex!
（逐字貼上你第三次問 AI 的提示詞）
```

### 程式碼內容

:::info
:::spoiler 點開貼上學習3的程式碼
```javascript=
//學習3程式碼所在

```
:::


---

## 學習4：設定題庫並抽題顯示題目網頁（CSV 檔案）

https://cfchen58.synology.me/115/week4/stage4/

**這個階段的目標：** 把題目移到 questions.csv，網站讀取題庫後每次隨機抽出 5 題。
**這個階段會修改的檔案：** index.html、sketch.js、questions.csv

### 執行截圖

（把截圖拖曳到這裡，或貼上圖片連結）

![學習4截圖](請貼上截圖)

### 第一次問 AI

```tex!
（逐字貼上你第一次問 AI 的提示詞）
```

### 第二次問 AI

```tex!
（逐字貼上你第二次問 AI 的提示詞）
```

### 第三次問 AI

```tex!
（逐字貼上你第三次問 AI 的提示詞）
```

### 程式碼內容

:::info
:::spoiler 點開貼上學習4的程式碼
```javascript=
//學習4程式碼所在

```
:::


---

## 學習5：利用 Google Sheets 當題庫

https://cfchen58.synology.me/115/week4/stage5/

**這個階段的目標：** 把題庫放在 Google 試算表，網站直接讀取，老師改試算表，網站題目就跟著更新。
**這個階段會修改的檔案：** index.html、sketch.js（questions.csv 當備用題庫）

### 執行截圖

（把截圖拖曳到這裡，或貼上圖片連結）

![學習5截圖](請貼上截圖)

### 第一次問 AI

```tex!
（逐字貼上你第一次問 AI 的提示詞）
```

### 第二次問 AI

```tex!
（逐字貼上你第二次問 AI 的提示詞）
```

### 第三次問 AI

```tex!
（逐字貼上你第三次問 AI 的提示詞）
```

### 程式碼內容

:::info
:::spoiler 點開貼上學習5的程式碼
```javascript=
//學習5程式碼所在

```
:::


---

## 我的心得

這五個學習中，哪一個最困難？你是怎麼解決的？（請寫出實際發生的事）

＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿
