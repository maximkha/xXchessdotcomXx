var domBoard = document.getElementsByClassName("board")[0];
var domClock = document.getElementsByClassName("clock-bottom")[0];

function isMyTurn()
{
    return domClock.classList.contains('clock-player-turn');
}

function side()
{
    return domBoard.classList.contains('flipped') ? "b" : "w";
}

function boardToFEN(board)
{
    var FENstr = "";
    var emptyCounter = 0;
    for (var i = 0; i < 8; i++)
    {
        for (var j = 0; j < 8; j++)
        {
            var curPiece = board[7 - i][j];
            if (curPiece != "")
            {
                if (emptyCounter > 0)
                {
                    FENstr += emptyCounter.toString();
                    emptyCounter = 0;
                }

                FENstr += curPiece;
            }
            else
            {
                emptyCounter += 1;
            }
        }

        if (emptyCounter > 0)
        {
            FENstr += emptyCounter.toString();
            emptyCounter = 0;
        }

        FENstr += "/";
    }
    return FENstr.substr(0, FENstr.length - 1) + "%20" + side();
}

function getBoard()
{
    var pieces = Array.from(document.getElementsByClassName("piece"));
    // var cols = ["a", "b", "c", "d", "e", "f", "g", "h"];
    // var rows = [1, 2, 3, 4, 5, 6, 7, 8]

    // if (domBoard.classList.contains('flipped'))
    // {
    //     cols = cols.reverse();
    //     rows = rows.reverse();
    // }
    
    //var boardFlipped = domBoard.classList.contains('flipped');

    var board = [...new Array(8)].map(elem => new Array(8).fill(""));

    for (var i = 0; i < pieces.length; i++)
    {
        var pieceType = pieces[i].getAttribute("class").split(" ")[1];        
        pieceType = pieceType[0] == "w" ? pieceType[1].toUpperCase() : pieceType[1];
        
        var chessComPos = pieces[i].getAttribute("class").split("square-")[1].split("").map((x) => parseInt(x) - 1);
        // board[row][col]

        //if (boardFlipped) board[7 - chessComPos[1]][7 - chessComPos[0]] = pieceType;
        //else board[chessComPos[1]][chessComPos[0]] = pieceType;
        board[chessComPos[1]][chessComPos[0]] = pieceType;
    }

    return board;
}

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}

function TTS(text)
{
    var msg = new SpeechSynthesisUtterance();
    msg.text = text;
    window.speechSynthesis.speak(msg);
}

function getBoardMakeGuess()
{
    if (isMyTurn())
    {
        var fenQuery = boardToFEN(getBoard());
        httpGetAsync("http://localhost:5000/bestmove?fen=" + fenQuery, (move) => { console.log(move); TTS(move.substr(0, 2).split("").join(",")  + " to " + move.substr(2).split("").join(",")); });
    }
}

playerTurnChange = function (changes) {
    console.log(isMyTurn());
    console.log(changes);

    setTimeout(getBoardMakeGuess, 750);
};

var observer = new MutationObserver(playerTurnChange);
observer.observe(domClock, { attributes: true });