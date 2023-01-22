"use strict";
//flagが"pen-flag"の時penguinsのターン、"bear-flag"の時penguinsのターン
let flag = "duck-flag";

//ターン数カウンター
let counter = 9;

//class="square"を取得
const squares = document.getElementsByClassName("square");

//Array に変換
const squaresArray = Array.from(squares);
//squeresの要素を取得
const a_1 = document.getElementById("a_1");
const a_2 = document.getElementById("a_2");
const a_3 = document.getElementById("a_3");
const b_1 = document.getElementById("b_1");
const b_2 = document.getElementById("b_2");
const b_3 = document.getElementById("b_3");
const c_1 = document.getElementById("c_1");
const c_2 = document.getElementById("c_2");
const c_3 = document.getElementById("c_3");
//NewGameボタン取得
const newgamebtn_display = document.getElementById("newgame-btn");
const newgamebtn = document.getElementById("btn90");
//Win or Lose Judgment Line
const line1 = JudgLine(squaresArray, ["a_1","a_2","a_3"]);
const line2 = JudgLine(squaresArray, ["b_1","b_2","b_3"]);
const line3 = JudgLine(squaresArray, ["c_1","c_2","c_3"]);
const line4 = JudgLine(squaresArray, ["a_1","b_1","c_1"]);
const line5 = JudgLine(squaresArray, ["a_2","b_2","c_2"]);
const line6 = JudgLine(squaresArray, ["a_3","b_3","c_3"]);
const line7 = JudgLine(squaresArray, ["a_1","b_2","c_3"]);
const line8 = JudgLine(squaresArray, ["a_3","b_2","c_1"]);

const lineArray = [line1,line2,line3,line4,line5,line6,line7,line8];

let winningLine = null;

//メッセージ
const msgtxt1 = '<p class="image"><img src ="img/duck.png" width=61px height=61px></p><p class="text">Duckguins Attack!(your turn)</p>';
const msgtxt2 = '<p class="image"><img src ="img/dog.png" width=61px height=61px></p><p class="text">BlackDog Attack!(computer turn)</p>';
const msgtxt3 = '<p class="image"><img src ="img/duckwin.gif" width=61px height=61px></p><p class="text animate__animated animate__lightSpeedInRight">Duckguins Win!!</p>';
const msgtxt4 = '<p class="image"><img src ="img/dogwin.gif" width=61px height=61px></p><p class="text animate__animated animate__lightSpeedInLeft">BlackDog Win!!</p>';
const msgtxt5 = '<p class="image"><img src ="img/duck.png" width=61px height=61px><img src ="img/dog.png" width=61px height=61px></p><p class="text animate__bounceIn">Draw!!</p>';

// *********サウンド *********//
let gameSound = ["sound/click_sound1.mp3","sound/click_sound2.mp3","sound/duckwin_sound.mp3","sound/dogwin_sound.mp3","sound/draw_sound.mp3"];


// **************************************
//ページ本体が読み込まれたタイミングで実行するコード
// **************************************
window.addEventListener("DOMContentLoaded",
    function() {
        //メッセージ(最初はpenguinsのターンから)
        setMessage("duck-turn");
        
        //squareがクリック可能かを判断するクラス追加
        squaresArray.forEach(function(square){
            square.classList.add("js-clickable");
        });
    },false
);

// **************************************
//Win or Lose Judgment Line を配列化
// **************************************
//JavaScriptでfilterを使う方法：https:/techacademy.jp/magazine/15575
function JudgLine(targetArray, idArray){
    return targetArray.filter(function(e) {
        return(e.id === idArray[0] || e.id === idArray[1] || e.id === idArray[2]);
    });
}


// **************************************
//squareをクリックした時にイベント発火
// **************************************
//クリックしたsquareに、duckかdogを表示。画像を表示したsquareはクリックできないようにする、win or lose Judgementの呼び出し
squaresArray.forEach(function(square){
    square.addEventListener('click',() => {
        let gameOverFlg = isSelect(square);

        //GameOverではない場合、クマのターン(auto)
        if (gameOverFlg === "0") {
            const squaresBox = document.getElementById("squaresBox");
            squaresBox.classList.add("js-unclickable");
            setTimeout(
                function() {
                    dogTurn(" ");
                },
                "2000"
            );
        
        }
    });
});


// **************************************
//クリックしたsquareにはpenguinsかbearか表示。
// ・表示したところはクリックできないようにする。
// ・Win or Lose 判定の呼び出し。
// **************************************
function isSelect(selectSquare) {
    let gameOverFlg = "0";
    if(flag === "duck-flag"){
        //クリックサウンド
        let music = new Audio(gameSound[0]);
        music.currentTime = 0;
        music.play();
        selectSquare.classList.add("js-duck-checked");
        selectSquare.classList.add("js-unclickable");
        selectSquare.classList.remove("js-clickable");
        //duck win
        if(isWinner("duckguins")){
            setMessage("duck-win");
            gameOver("duckguins");
            return gameOverFlg = "1";
        }
        setMessage("dog-turn");
        flag = "dog-flag";    
    }else {
        //クリックサウンド
        let music = new Audio(gameSound[1]);
        music.currentTime = 0;
        music.play();
        selectSquare.classList.add("js-dog-checked");
        selectSquare.classList.add("js-unclickable");
        selectSquare.classList.remove("js-clickable");
        //dog win
        if(isWinner("dog")){
            setMessage("dog-win");
            gameOver("dog");
            return gameOverFlg = "1";
        }     
        setMessage("duck-turn");
        flag = "duck-flag";
    }
    //ターン数カウンターを−１する
    counter--;
    //ターン数=0になったらdraw
    if(counter === 0) {
        setMessage("draw");
        gameOver("draw");
        return gameOverFlg = "1";
    }
    return gameOverFlg = "0";
}
// **************************************
//勝敗判定。
// **************************************
//classListの使い方まとめ
function isWinner(symbol) {
    const result = lineArray.some(function (line){
        const subResult = line.every(function (square){
            if (symbol === "duckguins"){
                return square.classList.contains("js-duck-checked");
            } 
            if (symbol === "dog"){
                return square.classList.contains("js-dog-checked");
            }
        });
        if(subResult){winningLine = line}
        return subResult;
    });
    return result;
}

// **************************************
//メッセージ切り替え関数
// **************************************
function setMessage(id) {
    switch (id) {
        case "duck-turn":
            document.getElementById("msgtext").innerHTML=msgtxt1;
            break;
        case "dog-turn":
            document.getElementById("msgtext").innerHTML=msgtxt2;
            break;   
        case "duck-win":
            document.getElementById("msgtext").innerHTML=msgtxt3;
            break;
        case "dog-win":
            document.getElementById("msgtext").innerHTML=msgtxt4;
            break;
        case "draw":
            document.getElementById("msgtext").innerHTML=msgtxt5;
            break;
        default:
            document.getElementById("msgtext").innerHTML=msgtxt1;
    }
}
// **************************************
//ゲーム終了時の処理
// **************************************
function gameOver(status) {
    //GameOver サウンド
    let w_sound
    switch (status) {
        case "duckguins":
            w_sound = gameSound[2];
            break;
        case "dog":
            w_sound = gameSound[3];
            break;
        case "draw":
            w_sound = gameSound[4];
            break;
    }
    let music = new Audio(w_sound);
    music.currentTime = 0;
    music.play();
    
    // all square unclickable
    //squaresArray.forEach(function(square){
    //    square.classList.add("js-unclickable");
    //});
    squaresBox.classList.add("js-unclickable");
    // display New Game button : display
    newgamebtn_display.classList.remove("js-hidden");

    // winEffect
    if(status === "duckguins") {
        //winner-line duckguins high-light
        if(winningLine){
            winningLine.forEach(function(square){
                square.classList.add("js-duck_highLight");   
            })
        }
        // duckguins win!! ==> snow color is pink
        $(document).snowfall({
            flakeColor : "rgb(255,240,245)",
            maxSpeed :3,
            minSpeed :1,
            maxSize :20,
            minSize :10,
            round :true
        });
    }else if(status === "dog"){
        //winner-line duckguins high-light
        if(winningLine){
            winningLine.forEach(function(square){
                square.classList.add("js-dog_highLight");   
            })
        }
        $(document).snowfall({
            flakeColor : "rgb(175,238,238)",
            maxSpeed :3,
            minSpeed :1,
            maxSize :20,
            minSize :10,
            round :true
        });
    }
}

// New Game ボタンをクリック時、ゲーム初期化
/****************************************/
newgamebtn.addEventListener("click", function(){
    //duckのターン
    flag = "duck-flag";
    //ターン数カウンター
    counter = 9;
    winningLine = null;
    squaresArray.forEach(function (square){
        square.classList.remove("js-duck-checked");
        square.classList.remove("js-dog-checked");
        square.classList.remove("js-unclickable");
        square.classList.remove("js-duck_highLight");
        square.classList.remove("js-dog_highLight");
        square.classList.add("js-clickable");
    });

    squaresBox.classList.remove("js-unclickable");
    setMessage("duck-turn");
    newgamebtn_display.classList.add("js-hidden");

    // snowfall stop
    $(document).snowfall("clear");

})

function dogTurn(){
    let gameOverFlg = "0";
    const dogSquare = squaresArray.filter(function(square) {
        return square.classList.contains("js-clickable");
    });
    /*console.log(dogSquare);*/
    
    let n = Math.floor(Math.random()*dogSquare.length);
    gameOverFlg = isSelect(dogSquare[n]);
    if(gameOverFlg === "0") {
        squaresBox.classList.remove("js-unclickable");
    }
}
