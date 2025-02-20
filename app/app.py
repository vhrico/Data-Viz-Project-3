import pandas as pd
import plotly.express as px
import matplotlib.pyplot as plt
from flask import Flask, jsonify, render_template
from sql_helper import SQLHelper
import os 

# Initialize Flask app
app = Flask(__name__)

# Flask app config
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE_PATH = os.path.join(BASE_DIR, "database", "meteorites.sqlite")

app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{DATABASE_PATH}"

# SQL Helper
sql_helper = SQLHelper()

# STATIC ROUTES

@app.route("/")
def welcome():
    return render_template("index.html")

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

@app.route("/map")
def map():
    return render_template("map.html")

@app.route("/about_us")
def about_us():
    return render_template("about_us.html")

@app.route("/works_cited")
def works_cited():
    return render_template("works_cited.html")

# API ROUTES

@app.route("/api/v1.0/meteorite_counts/<int:min_year>/<int:max_year>")
def meteorite_counts(min_year, max_year):
    # Execute the query to get meteorite counts
    results = sql_helper.query_meteorite_counts(min_year, max_year)

    # Convert the DataFrame to a List of Dictionaries
    data = results.to_dict(orient="records")

    # Return the data as a JSON response
    return jsonify(data)



@app.route("/api/v1.0/data/<int:min_year>/<int:max_year>")  # Ensures min_year is an integer
# you have to type "/api/v1.0/data/2000" to get the json data
def data(min_year, max_year):
    results = sql_helper.query_data(min_year, max_year)
    data = results.to_dict(orient="records")
    return jsonify(data)

@app.route("/api/v1.0/map_data/<int:min_year>/<int:max_year>")  # Ensures min_year is an integer
def map_data(min_year, max_year):
    results = sql_helper.map_data(min_year, max_year)
    data = results.to_dict(orient="records")
    return jsonify(data)

@app.route("/api/v1.0/sunburst_data/<int:min_year>/<int:max_year>")  # Ensures min_year is an integer
def sunburst_data(min_year, max_year):
    results = sql_helper.sunburst_data(min_year, max_year)
    data = results.to_dict(orient="records")
    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True, port = 8000)



