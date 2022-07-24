# EMONITOR
This is the project of Mehul Goel (mehulg6th@gmail.com) and Kush Goel (kushgoel08@gmail.com) built for the Uber Global Hackahthon 2022 competition.

Emonitor is an application focused on improving users emotions and mental health within the digital world. It is a background application
that tracks emotions for the users and compiles the data. This data can be used to improve one's mental health, realize when they are angry,
and their online habits. Emonitor is built for everyone who wants to improve their lives.


Installing and Setting Up Enviroment
__Setting up python dependencies__
1. Install miniconda (conda) using this link: https://docs.conda.io/en/latest/miniconda.html 
2. Update conda: conda update conda
3. Create a new virtual enviroment for this project: conda create -n <Enviroment Name> python=3.8 anaconda
4. Activate conda enviroment with: conda activate <Enviroment Name>
8. (For Mac) Install AppKit: pip install pyobjc
4. Install FER using command: pip install fer
5. If using a macbook with M1/M2, skip to step 9
6. Install tensorflow using command: pip install tensorflow
7. Install Request: pip install request
(For M1/M2 Only)
12. Install the tensorflow wheel tensorflow-2.4.1-py3-none-any.whl at:
13. Assuming it was downloaded to Downloads run: pip install ~/Downloads/tensorflow-2.4.1-py3-none-any.whl
14. Install Request: pip install requests




__Settting up NodeJS dependencies__
1. Verify node and npm version using node --version and npm --version. If nonexistent, make sure to install node on local setup.
2. Create the package.json file using npm init
3. It will go through a list of requirements, press enter to skip ahead.
4. Install Electron globally: npm install --save electron
5. Install request-promise package: npm install request-promise

__Other Tips__
1. Allow Electron to access camera and notifications through systems preferences.
2. Also allow python to access camera if requested

__Running the Application__
1. Access the appropriate virtual enviroments.
2. type npm start, and being using the application!


