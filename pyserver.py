
from flask import Flask, request
import json 
   
# Setup flask server
app = Flask(__name__) 
  
# Setup url route which will calculate
# total sum of array.
@app.route('/arraysum', methods = ['POST']) 
def sum_of_array(): 
    data = request.get_json() 
    print(data)
  
    # Data variable contains the 
    # data from the node server
    ls = data['array'] 
    result = sum(ls) # calculate the sum
  
    # Return data in json format 
    return json.dumps({"result":result})
   
@app.route('/fibonacci', methods = ['POST']) 
def getFibonacci():
    data = request.get_json()
    print(data)
    index = data['index']
    i1 = 0
    i2 = 1
    while index > 0:
        i1, i2 = i2, i1 + i2
        index -= 1
    return json.dumps({"fibonacci":i2})

if __name__ == "__main__": 
    app.run(port=5000)