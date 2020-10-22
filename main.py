from flask import Flask, render_template, make_response
from flask import request
app = Flask(__name__)
from stockfish import Stockfish

# rnbqkbnr/2pppp2/p5pp/1p6/8/P2PPPPP/1PP5/RNBQKBNR
@app.route("/bestmove", methods=["GET"])
def index():
    if 'fen' not in request.args.keys():
        return "no fen"
    stockfish = Stockfish(r"stockfish_20090216_x64_bmi2.exe", parameters = {"Threads": 2})
    stockfish.set_depth(15)
    stockfish.set_fen_position(request.args.get('fen') + "KQkq - 0 0")
    bestMove = stockfish.get_best_move() #stockfish.get_best_move_time(2000)
    del stockfish
    return bestMove

@app.after_request
def after_request_func(response):
    origin = request.headers.get('Origin')
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Headers', 'x-csrf-token')
        response.headers.add('Access-Control-Allow-Methods',
                            'GET, POST, OPTIONS, PUT, PATCH, DELETE')
        if origin:
            response.headers.add('Access-Control-Allow-Origin', origin)
    else:
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        if origin:
            response.headers.add('Access-Control-Allow-Origin', origin)

    return response

if __name__ == "__main__":
    app.run(host="localhost", threaded=True)
