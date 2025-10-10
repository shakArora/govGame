## Game file for flask website
import random

bills_passed = []
score = 0


def roll_dice(bet): 
  roll = random.randint(1, 6)
  if (roll % 2 == 0 and bet == "even"): 
    return True # Bet passed
  elif (roll % 2 == 1 and bet == "odd"): 
    return True
  else: 
    return False
  # bet is "even" or "odd" on D6

def pass_bill(bill): 
  bills_passed.append(bill)
  print(f"The bill: {bill} has been passed")

def loop(): 


if __name__ == "__main__"

class Player:
  def __init__(self, color):
    self.color = color
  def roll_dice(self):
    return roll_dice(bet)
  def 
