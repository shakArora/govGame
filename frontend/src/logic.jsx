let gameScore = 0

export class Player {
  constructor(name, politicalParty) {
    this.name = name
    this.politicalParty = politicalParty
    this.score = 0
  }

  getInfo() {
    return {
      name: this.name,
      politicalParty: this.politicalParty,
      score: this.score
    }
  }

  updateScore(points) {
    this.score += points
    return this.score
  }
}

export function rollDice(bet) {
  const roll = Math.floor(Math.random() * 6) + 1
  
  if (roll % 2 === 0 && bet === "even") {
    return { success: true, roll: roll }
  } else if (roll % 2 === 1 && bet === "odd") {
    return { success: true, roll: roll }
  } else {
    return { success: false, roll: roll }
  }
}

export function getGameScore() {
  return gameScore
}

export function updateGameScore(points) {
  gameScore += points
  return gameScore
}

export function resetGame() {
  gameScore = 0
}

export function createPlayer(name, politicalParty) {
  return new Player(name, politicalParty)
}

export function welcomeMessage1() {
  return "Welcome to Lawtopia! This is where you will start a bill"
}
