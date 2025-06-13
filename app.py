from flask import Flask, render_template, request
from src.formatpilot import markdown_to_linkedin

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def index():
    converted_text = None
    if request.method == "POST":
        markdown_text = request.form.get("markdown_text", "")
        converted_text = markdown_to_linkedin(markdown_text)
    return render_template("index.html", converted_text=converted_text)

if __name__ == "__main__":
    app.run(debug=True)
