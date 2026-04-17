#  Methods type

#############################################################

#1) Instance Method
class Fan:
    def __init__(self):
        self.brand="usha"
        self.color="white"
    def rotate(self):
        print("Fan is rotating")
f1=Fan()
f1.rotate()

###############################################################

#2) Static method
class Fan:
    def __init__(self):
        self.brand="usha"
        self.color="white"

    @staticmethod
    def on():
        print("Fan is on")
Fan.on()

###############################################################

#3) Class method
class Fan:
    def __init__(self):
        self.brand="usha"
        self.color="white"

    @classmethod
    def off(cls):
        print("Fan is off")
Fan.off()

##############################################################