import random
import numpy as np
import matplotlib.pyplot as plt
import scipy.stats

peaks = []
peakCount = 10
difPeak = 700/peakCount
lower = 0
upper = 1
mu = 0.17
sigma = 0.3
for i in range(6):
    x = []
    for j in range(peakCount):
        x.append(random.uniform(difPeak * j,difPeak * (j+1) ))
    y = scipy.stats.truncnorm.rvs((lower-mu)/sigma, (upper-mu)/sigma, loc = mu, scale =sigma, size = peakCount)
    peaks.append((x,y))



# plt.show()

mu = 0.001
sigma = 0.001
data = []
for i in range(6):
    peakX = peaks[i][0]
    peakY = list(peaks[i][1])
    values = [0]
    x = [0]
    for i in range(1,700):
        default = 0.166666
        x.append(i)
        if peakX and peakY and ( i > peakX[0] or peakY[0] - values[-1] < 0.005):
            values.append(peakY[0])
            peakX.pop(0)
            peakY.pop(0)
            continue
        
        if not peakY:
            if abs(default - values[-1]) < 0.0001:
                default *= 2
            upper = default - values[-1]
            rangeVal = max(0.0001, (default - values[-1])/(300 - i) * 2)
        else:
            upper = peakY[0] - values[-1]
            rangeVal = max(0.0001, (peakY[0] - values[-1])/(peakX[0] - i) * 2)


        lower = 0
        print(upper, lower)
        if upper < lower:
            lower, upper = upper, 0
            mu = rangeVal
        elif upper > lower:
            lower = 0
            mu = rangeVal
        print("MU: " + str(mu))
        print("SIGMA: {}".format(sigma))
        print("PEAK Y: " + str(peakY))
        values.append(values[-1] + list(scipy.stats.truncnorm.rvs((lower-mu)/sigma, (upper-mu)/sigma, loc = mu, scale =sigma, size = 1))[0])
        print("VALUES: " + str(values))
        print()
    data.append((x, values))



for i in range(6):
    plt.plot(data[i][0], data[i][1], label = str(i))

plt.show()

""" from os import major
from random import randint
import random
import numpy as np

import matplotlib.pyplot as plt


dataAmount = 1001

data = [[]]
majorPoints = [[[]]]

peaksX1 = []
peaksY1= np.random.normal(loc=0.5, scale=1.0, size=10)

x=[]
y=[]

# x2 = []
# y2= np.random.normal(loc=0.5, scale=1.0, size=10)

# x3 = []
# y3= np.random.normal(loc=0.5, scale=1.0, size=10)

def generatePoints(peaksX, peaksY):
    for peak in range(1, peaksX.length):
        for point in range(peaksX[peak-1], peaksX[peak]):
            print("hi")


def generateMajorPoints(x):
    pointPosition = 0
    majorDataAmount =10
    structuredPointPosition = []
    for point in range(0, majorDataAmount):
        structuredPointPosition.append(point*(dataAmount/majorDataAmount))
    for point in range(0, majorDataAmount):
        previousPointPosition = pointPosition
        pointPosition = randint(int(structuredPointPosition[point]*0.9), int(structuredPointPosition[point]*1.1))
        if pointPosition<previousPointPosition:
                pointPosition = randint(int(structuredPointPosition[point]*0.9), int(structuredPointPosition[point]*1))
        x.append(pointPosition)


generateMajorPoints(x1)
# generateMajorPoints(x2)
# generateMajorPoints(x3)


plt.plot(x1, y1, label = "1")
# plt.plot(x2, y2, label = "2")
# plt.plot(x3, y3, label = "3")
  
# naming the x axis
plt.xlabel('x - axis')
# naming the y axis
plt.ylabel('y - axis')
  
# giving a title to my graph
plt.title('My first graph!')
  
# function to show the plot
plt.show() """