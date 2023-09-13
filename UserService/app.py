from flask import Flask

app = Flask(__name__)

@app.route("/users")
def hello_world2():
    return "<p>Welcome to the User Service!</p>"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)