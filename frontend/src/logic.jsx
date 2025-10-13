let gameScore = 0
let billNumber = 0;
let speakerOfTheHouse = "Mike Johnson";

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

  switchParty(new_party) {
    this.party = new_party;
    return this.party;
  }

  switchName(new_name) {
    this.name = new_name;
    return this.name;
  }
}

export class Bill {
  constructor(title = "My Bill", description = "This is a bill I drafted", player) {
    this.title = title;
    this.description = description;
    this.player = player; 
  }

  addTitle(title = "My Bill") {
    this.title = title;
    return this.title;
  }

  addDescription(description = "This is a bill I drafted") {
    this.description = description;
    return this.description;
  }

  introduce(bet) {
    // bet must be "even" or "odd"
    let peopleInFavor = 0;
    for (let i = 0; i < 435; i++) {
      if (rollDice(bet).success) {
        peopleInFavor++;
      }
    }
    billNumber++; 
    return {
      peopleInFavor: peopleInFavor,
      peopleAgainst: 435 - peopleInFavor,
    }
  }

  sendToCommittee() {
    return `Your bill (${this.title}) has been sent to a Committee by the Speaker of the House (${speakerOfTheHouse})`;
  }

  // HELPER FUNCTIONS FOR COMMITTEE ACTION

  getPublicOpinion(chanceOfSuccess) {
    // this goes into committee action (part 1 is public reponse, then committee does smth)
    let n = chanceOfSuccess;
    let d = [0, 0, 0, 0];
    while (d[0] + d[1] + d[2] + d[3] != n) {
      d[0] = Math.floor(Math.random() * 100) / 100;
      d[1] = Math.floor(Math.random() * 100) / 100;
      d[2] = Math.floor(Math.random() * 100) / 100;
      d[3] = Math.floor(Math.random() * 100) / 100;
    }
    return {
      expertsRawInFavor: d[0],
      publicRawInFavor: d[1],
      expertsWithAmends: d[2],
      publicWithAmends: d[3]
    }
  }

  committeeMarkup(publicOpinion, bet) {
    let weights = [publicOpinion.expertsRawInFavor + publicOpinion.publicRawInFavor,
    publicOpinion.expertsWithAmends + publicOpinion.publicWithAmends];
    let roll = rollDiceWeighted(bet, ["Keep", "Amend"], weights);
    if (!roll.success) {
      return "The committee will amend your bill";
    } else if (roll.res === "Keep" && bet == "odd") {
      return "The committee is keeping your bill";
    } else {
      return "The committee will substantially change the bill."; 
    }
  }

  committeeAction(peopleInFavor, peopleAgainst, amendBet, desc = "", category = "Rules", voteBet = "even") {
    /**
     * return {
     *  status: "fail", 
     *  stage: "markup"
     * }
     * POSSIBLE status: "fail", "pass", "pigeonhole", "table"
     * POSSIBLE stage: "markup", null, "vote"
     *    null means it passed
     */
    let publicOpinion = this.getPublicOpinion(peopleInFavor / peopleAgainst);
    let willBeAmended = this.committeeMarkup(publicOpinion, amendBet); 
    while (willBeAmended === "The committee has amended your bill") {
      // SAY PLEASE AMEND YOUR BILL & ADD A DESCRIPTION USING SM INPUTS
      this.addDescription(desc); 
      willBeAmended = this.committeeMarkup(publicOpinion, amendBet); 
    }
    if (willBeAmended == "The committee will substantially change the bill.") {
      return {
        status: "fail", 
        stage: "markup"
      }
    }
    votes_from_committee = []; 
    const houseCommitteeSizes = {
      "Agriculture": 54,
      "Appropriations": 63,
      "Armed Services": 57,
      "Budget": 37,
      "Education and Workforce": 37,
      "Energy and Commerce": 54,
      "Ethics": 10,
      "Financial Services": 54,
      "Foreign Affairs": 53,
      "Homeland Security": 33,
      "House Administration": 12,
      "Judiciary": 44,
      "Natural Resources": 45,
      "Oversight and Government Reform": 47,
      "Rules": 13,
      "Science, Space, and Technology": 40,
      "Small Business": 27,
      "Transportation and Infrastructure": 67,
      "Veterans’ Affairs": 25,
      "Ways and Means": 45,
      "Permanent Select Committee on Intelligence": 25,
      "Select Committee on the Strategic Competition Between the United States and the Chinese Communist Party": 16,
      "Joint Economic Committee": 10,
      "Joint Committee on the Library": 5,
      "Joint Committee on Printing": 5,
      "Joint Committee on Taxation": 5,
    };
    let size = houseCommitteeSizes[category];
    let votesFor = 0; 
    for (let i = 0; i < size; i++) {
      votes_from_committee[i] = rollDiceWeighted(voteBet, ["for", "against"], [0.1, 0.9]); 
      if (votes_from_committee[i] === "for") {
        votesFor++; 
      }
    }
    if (votesFor/size > 0.5) {
      return {
        status: "pass",
        stage: null, 
      }
    } else if ((size - votesFor)/size > 0.8) {
      return {
        status: "table",
        stage: "vote"
      }
    } else {
      return {
        status: "pigeonhole", 
        stage: "vote"
      }
    }
  }

  rulesCommitteeCheck(debateLengthBet, whenBet) {
    let debateLength; let whenWillBeDebated; let successInComm; 
    if (this.player.politicalParty === "Republican") {
      debateLength = rollDiceWeighted(debateLengthBet, [6, 5.5, 5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.67], [60, 55, 50, 45, 40, 35, 30, 25, 20, 15, 10, 6.7]); 
      whenWillBeDebated = rollDiceWeighted(whenBet, ["Tommorow", "Today"], [0.5, 1]); 
      
    } else {
      debateLength = rollDiceWeighted(debateLengthBet, [6, 5.5, 5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.67], [6.7, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60]); 
      whenWillBeDebated = rollDiceWeighted(whenBet, ["Today", "Tommorow"], [0.5, 1]); 
    }
    if (debateLength && whenWillBeDebated.success) {
        successInComm = true; 
      }
    return {
      debateLength: debateLength.res,
      whenWillBeDebated: whenWillBeDebated.res,
      success: successInComm
    }
  }
    
  secondHouseVote(bet) {
    let n = rollDiceWeighted(bet, ["Agree", "Disagree"], [3, 1]); 
    if (n.res === "Disagree") {
      return conferenceCommittee(bet); 
    }
    return true; 
  }

  conferenceCommittee(bet) {
    while (!rollDice(bet).success) {
      // FIND A WAY TO GET THE DESCRIPTION FROM HTML (innerhtml)
      this.addDescription(desc); 
    }
    return true; 
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

export function rollDiceWeighted(bet, items, weights) {
  // copied from https://dev.to/jacktt/understanding-the-weighted-random-algorithm-581p
  let total = 0;
  weights.forEach(weight => {
    total += weight;
  })
  const random = Math.random() * total; // [0,total]
  let cursor = 0;
  let res; 
  for (let i = 0; i < weights.length; i++) {
    cursor += weights[i];
    if (cursor >= random) {
      res = items[i];
      break; 
    }
  }
  return {
    success: (typeof res === 'number'? ((res%2 === 0 && bet == "even") || (res%2 === 1 && bet == "odd")): (Math.random() > 0.5 ? (bet == "even" ? true : false) : (bet == "even" ? false : true))),
    roll: res
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

export function draftBill(title, description) {
  let myBill = new Bill(title, description);
  return myBill;
}