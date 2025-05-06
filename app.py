from flask import Flask, render_template, request, jsonify
from pytrends.request import TrendReq
import pandas as pd

app = Flask(__name__)
pytrends = TrendReq(hl='en-IN', tz=330)

@app.route("/", methods=["GET", "POST"])
def index():
    return render_template("index.html")

@app.route("/search", methods=["POST"])
def search():
    keywords = request.json.get("keywords", [])
    if not keywords:
        return jsonify({"error": "No keywords provided"}), 400

    pytrends.build_payload(keywords, timeframe="today 12-m", geo="IN")
    data = pytrends.interest_over_time().reset_index()

    if 'isPartial' in data.columns:
        data.drop(columns=['isPartial'], inplace=True)

    # Convert datetime to string for JSON serialization
    data["date"] = data["date"].astype(str)

    return jsonify(data.to_dict(orient="records"))

if __name__ == "__main__":
    app.run(debug=True)
