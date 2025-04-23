let table; // 用於存儲 CSV 資料
let currentQuestion = 0; // 當前題目索引
let question = ""; // 題目
let options; // 選項 (選擇題)
let inputBox; // 輸入框 (填空題)
let submitButton; // 按鈕
let result = ""; // 結果
let correctAnswer = ""; // 正確答案
let correctCount = 0; // 答對題數
let incorrectCount = 0; // 答錯題數
let isQuizFinished = false; // 測驗是否結束
let questionType = ""; // 題目類型 (選擇題或填空題)

function preload() {
  // 載入 CSV 檔案
  table = loadTable('questions.csv', 'csv', 'header', () => {
    console.log("CSV 檔案載入成功");
  }, () => {
    console.error("CSV 檔案載入失敗，請檢查檔案路徑或格式");
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight); // 使用視窗的寬高

  // 檢查是否成功載入 CSV 資料
  if (!table || table.getRowCount() === 0) {
    console.error("CSV 資料未正確載入或為空");
    return;
  }

  // 初始化選項 (選擇題)
  options = createRadio();
  options.style('font-size', '35px');
  options.style('color', '#3c4f76');
  options.position(width / 2 - 50, height / 2 + 50);

  // 初始化輸入框 (填空題)
  inputBox = createInput();
  inputBox.style('font-size', '35px');
  inputBox.position(width / 2 - 100, height / 2 + 50);
  inputBox.hide(); // 預設隱藏

  // 初始化按鈕
  submitButton = createButton('下一題');
  submitButton.style('font-size', '35px');
  submitButton.position(width / 2 - 50, height / 2 + 200);
  submitButton.mousePressed(handleButtonClick);

  loadQuestion(currentQuestion); // 載入第一題
}

function draw() {
  background(220);

  // 繪製方框
  fill('#d1beb0'); // 方框顏色
  noStroke();
  let rectWidth = width / 2;
  let rectHeight = height / 2;
  let rectX = (width - rectWidth) / 2;
  let rectY = (height - rectHeight) / 2;
  rect(rectX, rectY, rectWidth, rectHeight);

  if (!isQuizFinished) {
    // 顯示題目
    fill(0); // 黑色
    textSize(35);
    textAlign(CENTER, CENTER);
    text(question, width / 2, rectY + 50); // 顯示題目，放置在方框內

    // 顯示結果
    textSize(30);
    fill(result === "答對了" ? 'green' : 'red'); // 答對顯示綠色，答錯顯示紅色
    text(result, width / 2, rectY + rectHeight - 50); // 顯示結果，放置在方框內偏下
  } else {
    // 顯示測驗結果
    fill(0); // 黑色
    textSize(35);
    textAlign(CENTER, CENTER);
    text(`測驗結束！`, width / 2, rectY + 50);
    text(`答對題數: ${correctCount}`, width / 2, rectY + 100);
    text(`答錯題數: ${incorrectCount}`, width / 2, rectY + 150);
  }
}

function loadQuestion(index) {
  // 從 CSV 中讀取題目和選項
  if (table) {
    question = table.getString(index, 'question');  // 獲取題目
    questionType = table.getString(index, 'type'); // 題目類型 (choice 或 fill)
    correctAnswer = table.getString(index, 'answer');  // 獲取正確答案

    if (questionType === 'choice') {
      // 如果是選擇題
      let option1 = table.getString(index, 'option1');
      let option2 = table.getString(index, 'option2');
      let option3 = table.getString(index, 'option3');
      let option4 = table.getString(index, 'option4');

      options.html(''); // 清空選項
      options.option(option1, option1);
      options.option(option2, option2);
      options.option(option3, option3);
      options.option(option4, option4);

      options.show(); // 顯示選項
      inputBox.hide(); // 隱藏輸入框
    } else if (questionType === 'fill') {
      // 如果是填空題
      options.hide(); // 隱藏選項
      inputBox.show(); // 顯示輸入框
      inputBox.value(''); // 清空輸入框
    }
  } else {
    console.error("CSV 資料未正確載入");  // 顯示錯誤訊息
  }
}

function handleButtonClick() {
  if (!isQuizFinished) {
    checkAnswer(); // 檢查答案

    // 如果還有下一題，載入下一題
    if (currentQuestion < table.getRowCount() - 1) {  // 如果還有下一題
      currentQuestion++;  // 索引加一
      loadQuestion(currentQuestion);  // 載入下一題
      result = ""; // 清空結果
    } else {
      // 測驗結束
      isQuizFinished = true;  // 設置測驗結束狀態
      submitButton.html('再試一次'); // 修改按鈕文字為 "再試一次"
    }
  } else {
    // 重置測驗
    resetQuiz();
  }
}

function checkAnswer() {  // 檢查答案
  let selected;
  if (questionType === 'choice') {
    // 選擇題
    selected = options.value();
  } else if (questionType === 'fill') {
    // 填空題
    selected = inputBox.value().trim();
    inputBox.value(''); // 清空輸入框
  }

  if (selected === correctAnswer) {
    result = "答對了";  // 正確答案
    correctCount++;  // 答對題數加一
  } else {  // 錯誤答案
    result = "答錯了";  // 錯誤答案
    incorrectCount++;  // 答錯題數加一
  }
}

function resetQuiz() {
  // 重置測驗狀態
  currentQuestion = 0;  // 重置題目索引
  correctCount = 0;  // 重置答對題數
  incorrectCount = 0;  // 重置答錯題數
  isQuizFinished = false;  // 重置測驗狀態
  result = "";  // 清空結果
  loadQuestion(currentQuestion);  // 載入第一題
  submitButton.html('下一題'); // 修改按鈕文字為 "下一題"
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // 當視窗大小改變時調整畫布大小
  options.position(width / 2 - 50, height / 2 + 50); // 調整選項位置
  inputBox.position(width / 2 - 100, height / 2 + 50); // 調整輸入框位置
  submitButton.position(width / 2 - 50, height / 2 + 200); // 調整按鈕位置
}
