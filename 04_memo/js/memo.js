"use strict";

//ページ本体が読み込まれたタイミングで実行するコード
window.addEventListener("DOMContentLoaded",
function() {
//1.localStorageが使えるか確認
    if (typeof localStorage === "undefined") {
        window.alert("このブラウザはLocal Storage機能が実行されていません");
        return;
    }else {
        viewStorage();         //1.localStorageからのデータ取得とテーブルへ表示
        saveLocalStorage();    //2.localStorageへの保存
        delLocalStorage();     //3.localStorageから１件削除
        allClearLocalStorage();//4.localStorageからすべて削除
        selectTable();         //5.データ選択
    }
  },false
);

//2.localStorageへの保存
function saveLocalStorage() {
    const save = document.getElementById("save");
    save.addEventListener("click",
        function(e) {
            e.preventDefault();
            const key = document.getElementById("textKey").value;
            const value = document.getElementById("textMemo").value;
            //値の入力チェック
            if (key=="" || value =="") {
                Swal.fire({ 
                    title: "Memo app" ,  //タイトルをここに設定
                    html : "Key, Memoはいずれも必須です。" , //メッセージ内容をここに設定
                    type : "error", //ダイアログにアイコンを表示したい場合に設定する引数
                    allowOutsideClick: false,  //枠外クリックは許可しない
                    backdrop:`
                    url(img/dame.gif)
                    left top
                    no-repeat
                    `
                });
                return;
            }else {
                let w_msg = "LocalStorageに\n「"+ key + " " + value +"」\nを保存しますか？"
                Swal.fire({ 
                    title: "Memo app",      //タイトルをここに設定
                   html : w_msg,           //メッセージ内容をここに設定
                   type : "question",      //ダイアログにアイコンを表示したい場合に設定する引数
                   showCancelButton: true, //キャンセルボタンの表示
                   imageUrl: 'img/question.gif',
                   imageWidth: 200,
                   imageHeight: 150,
                }).then(function(result) {
                    if (result.value === true){
                        localStorage.setItem(key, value);
                        viewStorage();      //localStorageからのデータ取得とテーブルへ表示
                        let w_msg = "LocalStorageに" + key + " " + value + "保存しました。";
                        Swal.fire({ 
                            title: "Memo app",          //タイトルをここに設定
                            html : w_msg,              //メッセージ内容をここに設定
                            type : "success",          //ダイアログにアイコンを表示したい場合に設定する引数
                            allowOutsideClick: false,  //枠外クリックは許可しない
                        });
                        document.getElementById("textKey").value = "";
                        document.getElementById("textMemo").value = "";
                    }
                });
            }
        },false
    );
};

//3.localStorageから１件削除 ==> 選択されている行を削除
function delLocalStorage() {
    const del = document.getElementById("del");
    del.addEventListener("click",
        function(e) {
            e.preventDefault();  
            const chkbox1 = document.getElementsByName("chkbox1");
            const table1 = document.getElementById("table1");
            let w_cnt = "0";
            w_cnt = selectCheckBox("del");

            if(w_cnt >= 1) {
                //const key = document.getElementById("textKey").value;
                //const value = document.getElementById("textMemo").value;
                let w_msg = "LocalStorageから選択されている" + w_cnt + "件を削除しますか？";
                Swal.fire({ 
                    title: "Memo app",       //タイトルをここに設定
                    html : w_msg,            //メッセージ内容をここに設定
                    type : "question",       //ダイアログにアイコンを表示したい場合に設定する引数
                    showCancelButton: true,  //キャンセルボタンの表示
                    imageUrl: 'img/question.gif',
                    imageWidth: 200,
                    imageHeight: 150, 
                }).then(function(result) {          
                if (result.value === true){
                    for(let i = 0; i < chkbox1.length; i++){ 
                        if(chkbox1[i].checked){ 
                        localStorage.removeItem(table1.rows[i+1].cells[1].firstChild.data)
                        }
                    }
                        viewStorage();//localStorageからデータ取得とテーブルへ表示
                        let w_msg = "localStorageから" + w_cnt + "件を削除 (delete)しました。";  
                        Swal.fire({ 
                            title: "Memo app",          //タイトルをここに設定
                            html : w_msg,              //メッセージ内容をここに設定
                            type : "success",          //ダイアログにアイコンを表示したい場合に設定する引数
                            allowOutsideClick: false,  //枠外クリックは許可しない
                        });             
                        document.getElementById("textKey").value = "";
                        document.getElementById("textMemo").value = "";              
                }    
            });
            }
        },false
    );
    // version_up 5 add-str
    const table1 = document.getElementById("table1");
    table1.addEventListener("click", (e) => {
        if(e.target.classList.contains("trash") === true) {   
            let index = e.target.parentNode.parentNode.sectionRowIndex;
            const key = table1.rows[index + 1].cells[1].firstChild.data;
            const value = table1.rows[index + 1].cells[2].firstChild.data;
            let w_delete = "LocalStorageから\n「"+ key + " " + value +"」\nを削除しますか？";
            Swal.fire({ 
                title: "Memo app",       //タイトルをここに設定
                html : w_delete,            //メッセージ内容をここに設定
                type : "question",       //ダイアログにアイコンを表示したい場合に設定する引数
                showCancelButton: true,  //キャンセルボタンの表示
                imageUrl: 'img/question.gif',
                imageWidth: 200,
                imageHeight: 150,
            }).then(result => { 
                if (result.value === true){  
                    localStorage.removeItem(key);
                    viewStorage();//localStorageからデータ取得とテーブルへ表示
                    let w_msg = "LocalStorageから" + key + " " + value + "を削除(delete)しました!";
                    Swal.fire({ 
                        title: "Memo app",          //タイトルをここに設定
                        html : w_msg,              //メッセージ内容をここに設定
                        type : "success",          //ダイアログにアイコンを表示したい場合に設定する引数
                        allowOutsideClick: false  //枠外クリックは許可しない
                    });
                    document.getElementById("textKey").value = "";
                    document.getElementById("textMemo").value = "";  
                }
            })
        }
    });
}

//4.LocalStorageからすべて削除
function allClearLocalStorage() {
    const allClear = document.getElementById("allClear");
    allClear.addEventListener("click",
        function(e) {
            e.preventDefault();  
            let w_msg = "LocalStorageのデータをすべて削除します。\nよろしいですか？";
            Swal.fire({ 
                title: "Memo app",       //タイトルをここに設定
                html : w_msg,            //メッセージ内容をここに設定
                type : "question",       //ダイアログにアイコンを表示したい場合に設定する引数
                showCancelButton: true,  //キャンセルボタンの表示
                imageUrl: 'img/question.gif',
                imageWidth: 200,
                imageHeight: 150,
            }).then(function(result)  {   
                if(result.value === true) {
                    localStorage.clear();
                    viewStorage();//localStorageからデータ取得とテーブルへ表示
                    let w_msg ="localStorageのデータを全て削除 (all Clear)しました。"; 
                    Swal.fire({ 
                        title: "Memo app",          //タイトルをここに設定
                        html : w_msg,              //メッセージ内容をここに設定
                        type : "success",          //ダイアログにアイコンを表示したい場合に設定する引数
                        allowOutsideClick: false,  //枠外クリックは許可しない
                        backdrop:`
                        url(img/ok.gif)
                        left top
                        no-repeat
                        `
                    });  
                    document.getElementById("textKey").value = "";
                    document.getElementById("textMemo").value = "";  
                }
            });
        },false
    );
};

//5.データ選択
function selectTable() {
    const select = document.getElementById("select");
    select.addEventListener("click",
        function(e){
            e.preventDefault();
            selectCheckBox("select");//テーブルからデータ選択
        },false
    );
};
//テーブルからデータ選択
function selectCheckBox(mode) {
    //let w_sel = "0"; //選択されていれば、”１”にする
    let w_cnt = 0;   //選択されているチェックボックスの数
    const chkbox1 = document.getElementsByName("chkbox1");
    const table1 = document.getElementById("table1");
    let w_textKey = "";
    let w_textMemo = "";
    
    for(let i=0; i < chkbox1.length; i++) {
        if(chkbox1[i].checked){
            if(w_cnt === 0) {
                w_textKey = table1.rows[i+1].cells[1].firstChild.data;            //document.getElementById("textKey").value = table1.rows[i+1].cells[1].firstChild.data;
                w_textMemo = table1.rows[i+1].cells[2].firstChild.data;           //document.getElementById("textMemo").value = table1.rows[i+1].cells[2].firstChild.data;
            }
            //return w_sel = "1";
            w_cnt++;
        }
    }
    
    document.getElementById("textKey").value = w_textKey;
    document.getElementById("textMemo").value = w_textMemo;
    
    if(mode === "select" ){ 
        if(w_cnt === 1){
            return w_cnt;
        }else{ 
            Swal.fire({ 
                title: "Memo app",   //タイトルをここに設定
                html : "１つ選択 (select) してください。",  //メッセージ内容をここに設定
                type : "error",  //ダイアログにアイコンを表示したい場合に設定する引数
                allowOutsideClick: false,  //枠外クリックは許可しない
                imageUrl: 'img/error2.gif',
                imageWidth: 200,
                imageHeight: 150,
            });
        }
    }
    if(mode === "del" ){
        if(w_cnt >= 1) {
            return w_cnt;
        }else{
            Swal.fire({ 
                title: "Memo app",   //タイトルをここに設定
                html : "１つ以上選択 (select) してください。",  //メッセージ内容をここに設定
                type : "error",  //ダイアログにアイコンを表示したい場合に設定する引数
                allowOutsideClick: false,  //枠外クリックは許可しない
                imageUrl: 'img/error2.gif',
                imageWidth: 200,
                imageHeight: 150,
            });  
        }
    }
    
};

//localStorage からのテーブル取得とテーブルへ表示
function viewStorage() {
    const list = document.getElementById("list");
    //htmlのテーブル初期化
    while(list.rows[0]) list.deleteRow(0);
    //localStorageすべての情報の取得
    for (let i=0; i < localStorage.length; i++) {
        let w_key = localStorage.key(i);
        //localStorageのキーと値を表示
        let tr = document.createElement("tr");
        let td1 = document.createElement("td");
        let td2 = document.createElement("td");
        let td3 = document.createElement("td");
        let td4 = document.createElement("td");  
        list.appendChild(tr);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        td1.innerHTML = "<input name='chkbox1' type='checkbox'>";
        td2.innerHTML = w_key;
        td3.innerHTML = localStorage.getItem(w_key);
        td4.innerHTML = "<img src='img/trash_icon.png' class='trash'>";
    }
        
    // JQueryのplugin tablesorterを使ってテーブルのソート
    //sortList: 引数 1 ...最初からソートしておく列を指定, 引数 2 ...0..昇順, 1..降順
    $("#table1").tablesorter({
        sortList: [[1, 0]]
    });

    $("#table1").trigger("update");
    
};
