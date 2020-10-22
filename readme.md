# xXchessdotcomXx

This is a injection for [chess.com](https://www.chess.com) which adds a text to speech system to tell the user the best move.

##### Motivations

I am really bad at chess, and I decided to win a few games against some of my friends! Since I was on Discord, I had to create a covert way of cheating. I decided to use text to speech so if they asked me to share screens they would **see** that I wasn’t cheating.

##### Instructions

1. Start the Python HTTP server (run the python script).
2. Inject the script into the chess.com game (this needs to be done every game, even rematches!).
   1. Open DevTools
   2. Copy the contents of main.js and insert it into the inspector interactive console.
   3. Enjoy!

 3. Play!

    *Note: The system doesn’t detect opening moves so make your opening moves using your brain! Also, sometimes crashes when the time is low (possibly due to Stockfish or the injected script not detecting the turn change).*

##### How It Works

There are two components, the [injected script](https://github.com/maximkha/xXchessdotcomXx/blob/master/main.js), and the [Stockfish server](https://github.com/maximkha/xXchessdotcomXx/blob/master/main.py).

The script knows when a move has been made by observing the clock at the bottom left.

<img src="Screenshot 2020-10-22 014451.png" alt="Screenshot 2020-10-22 014451" style="zoom: 50%;" />

When there is a change, the script will check if the clock has the `clock-player-turn` class, which, intuitively, means that it is the user’s turn.

Once it’s the player’s turn, the script waits for the move animation, and then creates a 2d array that represents the board. Each piece on the screen is a `div` with a class like  `piece bq square-83`. The piece’s type is a substring of the class, in our case, `bq`, `b` meaning it’s black’s piece and `q` meaning the piece is a queen. The position is described by the final string, `square-83`, `8` meaning the column H, and `3` meaning on row 3. Then we can enumerate all the `div`s with the `piece` class and dissect the class to get the position. Once the 2d array is created then the board is turned into a [FEN](https://en.wikipedia.org/wiki/Forsyth–Edwards_Notation) string to send to the API. An HTTP GET is sent to the Python server with the partial FEN string.

*Note: Only a partial FEN string is generated on the client side, including only the side the user is on (w or b) and the actual board layout.*

Since I did not want to implement all the logic for the FEN string, I set the halfmove clock, fullmove number to 0, and en passant disabled. The FEN is also set so both sides can castle.

The Python script runs a [Flask HTTP server](https://github.com/maximkha/xXchessdotcomXx/blob/master/main.py) which has one active URL, ‘localhost:5000/bestmove?fen=‘ followed by the partial FEN. Then, using [Stockfish](https://stockfishchess.org), the optimal move is found (the depth is set to 15 and 2 threads are allowed) and the API returns the best move in plain text. The injected script uses JavaScript's built in text to speech to announce the optimal move to the user and the cycle repeats.

##### Demo

Please excuse my slow moves, turn on audio to hear the text to speech.

Shoutout to [Zachary Tu](https://www.chess.com/member/zacharytu) for helping me test it out!

<video src="2020-10-22 01-20-28.mp4"></video>

