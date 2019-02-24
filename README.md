# Story Time
## https://storytime.tech/
## Created at Hack the Valley 3

A web app that will record user's speech and generate a story using images. The app also performs sentiment analysis on your speech and does facial emotion recogntion to further improve image results.

### Technologies
React, Flask, MongoDB, Docker, Nginx, Azure, Google Cloud Platform

![Image](https://i.imgur.com/uBJGTHU.png)

### Instructions to Run
Prerequisites: You must have Docker and MongoDB installed and you must have a setup.py file containing the azure and google cloud platform service keys, and the google service file in the backend folder. The app only works on google chrome.

Clone the repo. cd into the project directory. Run `docker-compose up --build` and go to localhost:80

Note: Allow camera & mic permissions. Page refresh will solve image generation issues.
