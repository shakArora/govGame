import { useState, useEffect } from 'react'
import { Player, Bill, rollDice, rollDiceWeighted } from './logic'
import cardsData from '../../assets/cards.json'
import './App.css'

function App() {
  const [name, setName] = useState('')
  const [politicalParty, setPoliticalParty] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [errors, setErrors] = useState({})
  const [player, setPlayer] = useState(null)
  const [gameStage, setGameStage] = useState('draft')
  const [stageNumber, setStageNumber] = useState(1)
  const [billTitle, setBillTitle] = useState('')
  const [billDescription, setBillDescription] = useState('')
  const [currentBill, setCurrentBill] = useState(null)
  const [strategicChoice, setStrategicChoice] = useState('compromise')
  const [supporters, setSupporters] = useState(0)
  const [money, setMoney] = useState(0)
  const [energy, setEnergy] = useState(0)
  const [speed, setSpeed] = useState(0)
  const [voteResult, setVoteResult] = useState(null)
  const [committeeResult, setCommitteeResult] = useState(null)
  const [selectedCommittee, setSelectedCommittee] = useState('Rules')
  const [cards, setCards] = useState([])
  const [flippedCards, setFlippedCards] = useState([])
  const [selectedCard, setSelectedCard] = useState(null)
  const [gameLog, setGameLog] = useState([])
  const [rulesResult, setRulesResult] = useState(null)
  const [debateResult, setDebateResult] = useState(null)
  const [showCardModal, setShowCardModal] = useState(false)
  const [availableCards, setAvailableCards] = useState([])
  const [usedCardIndices, setUsedCardIndices] = useState([])
  const [isVoting, setIsVoting] = useState(false)
  const [votingProgress, setVotingProgress] = useState([])
  const [currentVoter, setCurrentVoter] = useState(0)
  const [senateVoteResult, setSenateVoteResult] = useState(null)
  const [presidentAction, setPresidentAction] = useState(null)
  const [presidentPending, setPresidentPending] = useState(false)
  const [failureReason, setFailureReason] = useState('')
  const [failureStage, setFailureStage] = useState('')

  const totalStages = 15
  const stageNames = {
    1: 'Draft Bill',
    2: 'Introduce in House',
    3: 'Committee Assignment',
    4: 'House Committee Action',
    5: 'Rules Committee',
    6: 'House Floor Debate',
    7: 'Introduce in Senate',
    8: 'Senate Committee',
    9: 'Senate Floor Leader',
    10: 'Senate Floor Debate',
    11: 'Conference Committee',
    12: 'Vote on Compromise',
    13: 'Presidential Action',
    14: 'Override Veto',
    15: 'Judicial Review'
  }

  const committees = ["Rules", "Agriculture", "Appropriations", "Armed Services", "Budget", "Education and Workforce", "Energy and Commerce", "Financial Services", "Foreign Affairs", "Judiciary", "Transportation and Infrastructure", "Ways and Means", "Testing 100%"]
  const committeeSizes = {
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
    "Testing 100%": 1
  }

  useEffect(() => {
    if (gameStarted) {
      const shuffled = [...cardsData].sort(() => Math.random() - 0.5)
      setCards(shuffled)
    }
  }, [gameStarted])

  useEffect(() => {
    if (isVoting && currentVoter < 435) {
      const timer = setTimeout(() => {
        const vote = Math.random() > 0.5 ? 'yes' : 'no'
        setVotingProgress(prev => [...prev, vote])
        setCurrentVoter(prev => prev + 1)
      }, 10)
      return () => clearTimeout(timer)
    }
  }, [isVoting, currentVoter])

  const assetUrl = (file) => `${import.meta.env.BASE_URL}assets/${file}`
  const getBackgroundForStage = () => {
      if (stageNumber >= 1 && stageNumber <= 12) {
        return assetUrl('congress.gif')
      } else if (stageNumber >= 13) {
        return assetUrl('whitehouse.gif')
      }
      return assetUrl('congress.gif')
  }

  const committeeSize = committeeSizes[selectedCommittee] || 25
  const committeeNeededVotes = Math.floor(committeeSize/2) + 1
  const committeeNeededPercent = Math.ceil((committeeNeededVotes/committeeSize) * 100)

  useEffect(() => {
    if (gameStage === 'president') {
      setPresidentPending(true)
      const timer = setTimeout(() => {
        const action = Math.random() < 0.6 ? 'sign' : 'veto'
        handlePresidentAction(action)
        setPresidentPending(false)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [gameStage])

  const validateForm = () => {
    const newErrors = {}
    if (!name.trim()) {
      newErrors.name = 'Name is required'
    }
    if (!politicalParty) {
      newErrors.politicalParty = 'Political party is required'
    }
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true)
      setErrors({})
    } else {
      setErrors(newErrors)
    }
  }

  const handlePartySelect = (party) => {
    setPoliticalParty(party)
    setErrors({ ...errors, politicalParty: '' })
  }

  const handleStartGame = () => {
    const newPlayer = new Player(name, politicalParty)
    setPlayer(newPlayer)
    setGameStarted(true)
    addLog(`${name} has entered the game as a ${politicalParty}!`)
  }

  const addLog = (message) => {
    setGameLog(prev => [...prev, { message, time: new Date().toLocaleTimeString() }])
  }

  const handleDraftBill = () => {
    if (!billTitle.trim() || !billDescription.trim()) {
      alert('Please enter both title and description')
      return
    }
    const bill = new Bill(billTitle, billDescription, player)
    setCurrentBill(bill)
    showCardSelection()
  }

  const showCardSelection = () => {
    const unusedCards = cards.filter((_, idx) => !usedCardIndices.includes(idx))
    const selected = unusedCards.sort(() => Math.random() - 0.5).slice(0, 3)
    setAvailableCards(selected)
    setShowCardModal(true)
  }

  const handleCardSelect = (card) => {
    const cardIndex = cards.findIndex(c => c.cardname === card.cardname)
    setUsedCardIndices([...usedCardIndices, cardIndex])
    applyCardEffect(card)
    setShowCardModal(false)
    advanceToNextStage()
  }

  const skipCard = () => {
    setShowCardModal(false)
    advanceToNextStage()
  }

  const advanceToNextStage = () => {
    if (gameStage === 'draft') {
      setGameStage('introduce')
      setStageNumber(2)
      addLog(`Bill "${billTitle}" has been drafted!`)
    } else if (gameStage === 'houseCommittee') {
      setGameStage('rules')
      setStageNumber(5)
    } else if (gameStage === 'rules') {
      setGameStage('houseFloor')
      setStageNumber(6)
    } else if (gameStage === 'houseFloor') {
      setGameStage('senateIntro')
      setStageNumber(7)
    } else if (gameStage === 'senateIntro') {
      setGameStage('senateCommittee')
      setStageNumber(8)
    } else if (gameStage === 'senateCommittee') {
      setGameStage('senateLeader')
      setStageNumber(9)
    } else if (gameStage === 'senateLeader') {
      setGameStage('senateFloor')
      setStageNumber(10)
    } else if (gameStage === 'senateFloor') {
      setGameStage('conference')
      setStageNumber(11)
    } else if (gameStage === 'conference') {
      setGameStage('compromise')
      setStageNumber(12)
    } else if (gameStage === 'compromise') {
      setGameStage('president')
      setStageNumber(13)
    } else if (gameStage === 'president') {
      if (presidentAction === 'veto') {
        setGameStage('override')
        setStageNumber(14)
      } else {
        setGameStage('judicial')
        setStageNumber(15)
      }
    } else if (gameStage === 'override') {
      setGameStage('judicial')
      setStageNumber(15)
    }
  }

  const handleIntroduceBill = () => {
    if (!currentBill) return
    setIsVoting(true)
    setVotingProgress([])
    setCurrentVoter(0)
    
    const betChoice = strategicChoice === 'compromise' ? 'even' : 'odd'
    
    setTimeout(() => {
      const result = currentBill.introduce(betChoice)
      setVoteResult(result)
      setIsVoting(false)
      addLog(`Bill introduced: ${result.peopleInFavor} in favor, ${result.peopleAgainst} against`)
      setGameStage('committee')
      setStageNumber(3)
    }, 5000)
  }

  const handleCommittee = () => {
    if (!currentBill || !voteResult) {
      console.log('Missing bill or vote result')
      return
    }
    
    try {
      const amendBet = strategicChoice === 'compromise' ? 'even' : 'odd'
      const voteBet = strategicChoice === 'aggressive' ? 'odd' : 'even'
      
      const result = currentBill.committeeAction(
        voteResult.peopleInFavor,
        voteResult.peopleAgainst,
        amendBet,
        billDescription,
        selectedCommittee,
        voteBet
      )
      
      setCommitteeResult(result)
      // CHANGE THIS TO RESULT.STATUS === 'pass'
      if (1==1) {
        addLog(`${selectedCommittee} Committee passed the bill!`)
        setStageNumber(4)
        setGameStage('houseCommittee')
        showCardSelection()
      } else {
        setGameStage('failed')
        setFailureStage(`Stage 4: ${selectedCommittee} Committee`)
        if (result.status === 'pigeonhole') {
          setFailureReason(`Committee chair refused to schedule a vote. Yes votes: ${result.passPercent?.toFixed(1)}%`)
        } else if (result.status === 'table') {
          setFailureReason(`Committee voted to table the bill. Yes votes: ${result.passPercent?.toFixed(1)}%`)
        } else {
          setFailureReason(`Committee rejected the bill during ${result.stage}. Yes votes: ${result.passPercent}`)
        }
        addLog(`Bill ${result.status} at ${result.stage} stage (${result.passPercent?.toFixed(1)}% in favor)`)        
      }
    } catch (error) {
      console.error('Committee error:', error)
      setGameStage('failed')
      setFailureStage('Stage 4: Committee Action')
      setFailureReason('An unexpected error occurred in committee. The bill could not proceed.')
      addLog('An error occurred in committee')
    }
  }

  const handleRulesCommittee = () => {
    if (!currentBill) return
    const debateLengthBet = strategicChoice === 'compromise' ? 'even' : 'odd'
    const whenBet = strategicChoice === 'aggressive' ? 'odd' : 'even'
    const result = currentBill.rulesCommitteeCheck(debateLengthBet, whenBet)
    setRulesResult(result)
    if (result.success) {
      addLog(`Rules Committee approved! Debate: ${result.debateLength} hours, ${result.whenWillBeDebated}`)
      setGameStage('houseFloor')
      setStageNumber(6)
    } else {
      setGameStage('failed')
      setFailureStage('Stage 5: Rules Committee')
      setFailureReason('The Rules Committee blocked your bill from reaching the House floor. The committee controls when and how bills are debated.')
      addLog('Failed at Rules Committee')
    }
  }

  const handleHouseFloorVote = () => {
    if (!currentBill) return
    const success = Math.random() > 0.0001 //change to 0.45
    
    if (success) {
      addLog('House Floor Vote PASSED! Moving to Senate...')
      setGameStage('senateIntro')
      setStageNumber(7)
    } else {
      setGameStage('failed')
      setFailureStage('Stage 6: House Floor Vote')
      setFailureReason('The bill failed to achieve a majority vote (218 votes needed out of 435). Representatives voted against it.')
      addLog('Bill failed on House Floor')
    }
  }

  const handleSenateIntro = () => {
    addLog('Bill introduced in Senate')
    setGameStage('senateCommittee')
    setStageNumber(8)
  }

  const handleSenateCommittee = () => {
    const baseKillChance = 0.001 //change to 0.45
    const killChance = baseKillChance
    const isKilled = Math.random() < killChance
    
    if (!isKilled) {
      addLog('Senate Committee approved the bill')
      setGameStage('senateLeader')
      setStageNumber(9)
    } else {
      setGameStage('failed')
      setFailureStage('Stage 8: Senate Committee')
      setFailureReason(`The Senate committee killed your bill. Kill chance: ${(killChance * 100).toFixed(1)}%`)
      addLog(`Bill died in Senate Committee (kill chance ${(killChance * 100).toFixed(1)}%)`)
    }
  }

  const handleSenateLeader = () => {
    addLog('Majority Leader scheduled floor debate')
    setGameStage('senateFloor')
    setStageNumber(10)
  }

  const handleSenateFloorVote = () => {
    const success = Math.random() > 0.001 //change to 0.45
    
    if (success) {
      addLog('Senate Floor Vote PASSED!')
      setGameStage('conference')
      setStageNumber(11)
    } else {
      setGameStage('failed')
      setFailureStage('Stage 10: Senate Floor Vote')
      setFailureReason('The bill failed to achieve a majority in the Senate (51 votes needed out of 100). A filibuster may have been used.')
      addLog('Bill failed in Senate')
    }
  }

  const handleConference = () => {
    const needsConference = Math.random() > 0.5
    if (needsConference) {
      addLog('House rejected changes - Conference Committee convened')
      setGameStage('compromise')
      setStageNumber(12)
    } else {
      addLog('Both chambers approved identical versions')
      setGameStage('compromise')
      setStageNumber(12)
    }
  }

  const handleCompromise = () => {
    const success = Math.random() > 0.35
    
    if (success) {
      addLog('Both chambers approved compromise version!')
      setGameStage('president')
      setStageNumber(13)
    } else {
      setGameStage('failed')
      setFailureStage('Stage 12: Conference Committee Compromise')
      setFailureReason('The House and Senate could not agree on a compromise version. Both chambers must pass identical bills.')
      addLog('Compromise failed - Bill dies')
    }
  }

  const handlePresidentAction = (action) => {
    setPresidentAction(action)
    if (action === 'sign') {
      addLog('President SIGNED the bill into law!')
      setGameStage('judicial')
      setStageNumber(15)
    } else {
      addLog('President VETOED the bill!')
      setGameStage('override')
      setStageNumber(14)
    }
  }

  const handleOverride = () => {
    const success = Math.random() > 0.7
    
    if (success) {
      addLog('Veto OVERRIDDEN! Bill becomes law!')
      setGameStage('judicial')
      setStageNumber(15)
    } else {
      setGameStage('failed')
      setFailureStage('Stage 14: Veto Override')
      setFailureReason('Congress failed to achieve 2/3 majority in both chambers (290 House + 67 Senate). Override attempts rarely succeed.')
      addLog('Override failed - Bill dies')
    }
  }

  const handleJudicialReview = () => {
    const success = Math.random() > 0.3
    
    if (success) {
      addLog('Supreme Court: Law is CONSTITUTIONAL!')
      setGameStage('passed')
    } else {
      setGameStage('failed')
      setFailureStage('Stage 15: Judicial Review')
      setFailureReason('The Supreme Court ruled your law UNCONSTITUTIONAL. The law violated the Constitution and is struck down.')
      addLog('Supreme Court: Law is UNCONSTITUTIONAL')
    }
  }

  const applyCardEffect = (card) => {
    if (card.effects.supporters) {
      setSupporters(prev => prev + card.effects.supporters)
    }
    
    if (card.effects.money) {
      setMoney(prev => prev + card.effects.money)
    }
    
    if (card.effects.speed) {
      setSpeed(prev => prev + card.effects.speed)
    }
    
    if (card.effects.energy) {
      setEnergy(prev => prev + card.effects.energy)
    }
    
    addLog(`${card.cardname} applied`)
  }

  const handleRestart = () => {
    setGameStage('draft')
    setStageNumber(1)
    setBillTitle('')
    setBillDescription('')
    setCurrentBill(null)
    setStrategicChoice('compromise')
    setVoteResult(null)
    setCommitteeResult(null)
    setRulesResult(null)
    setDebateResult(null)
    setSenateVoteResult(null)
    setPresidentAction(null)
    setFlippedCards([])
    setSelectedCard(null)
    setShowCardModal(false)
    setIsVoting(false)
    setVotingProgress([])
    setCurrentVoter(0)
    setSupporters(0)
    setMoney(0)
    setEnergy(0)
    setSpeed(0)
    setFailureReason('')
    setFailureStage('')
    addLog('Starting new bill...')
  }

  return (
    <div className="App">
      {!submitted ? (
        <div className="login-container">
          <div className="login-header">
            <h1 className="game-title">LawTopia</h1>
            <p className="game-subtitle">By Shivum, Charan, and Jasraj</p>
          </div>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label>Political Party</label>
              <div className="party-buttons">
                <button
                  type="button"
                  className={`party-button ${politicalParty === 'Democrat' ? 'selected democrat' : ''}`}
                  onClick={() => handlePartySelect('Democrat')}
                >
                  Democrat
                </button>
                <button
                  type="button"
                  className={`party-button ${politicalParty === 'Republican' ? 'selected republican' : ''}`}
                  onClick={() => handlePartySelect('Republican')}
                >
                  Republican
                </button>
                <button
                  type="button"
                  className={`party-button ${politicalParty === 'Independent' ? 'selected independent' : ''}`}
                  onClick={() => handlePartySelect('Independent')}
                >
                  Independent
                </button>
              </div>
              {errors.politicalParty && <span className="error-message">{errors.politicalParty}</span>}
            </div>
            <button type="submit" className="submit-button">
              Enter Game
            </button>
          </form>
        </div>
      ) : !gameStarted ? (
        <div className="welcome-container">
          <div className="welcome-card">
            <div className="checkmark">✓</div>
            <h2 className="welcome-title">Welcome to LawTopia!</h2>
            <div className="player-info">
              <div className="info-item">
                <span className="info-label">Player Name:</span>
                <span className="info-value">{name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Political Party:</span>
                <span className="info-value">{politicalParty}</span>
              </div>
            </div>
            <div className="action-buttons">
              <button className="play-button" onClick={handleStartGame}>Start Playing</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="game-screen" style={{ backgroundImage: `url(${getBackgroundForStage()})` }}>
          {showCardModal && (
            <div className="card-modal-overlay">
              <div className="card-modal">
                <h2>Choose a Power Card</h2>
                <p className="modal-subtitle">Select one card to boost your campaign</p>
                <div className="modal-cards">
                  {availableCards.map((card, index) => (
                    <div key={index} className="modal-card" onClick={() => handleCardSelect(card)}>
                      <h3>{card.cardname}</h3>
                      <p className="modal-card-desc">{card.description}</p>
                      <div className="card-effects">
                        {card.effects.supporters && <span className="effect">Supporters: {card.effects.supporters > 0 ? '+' : ''}{card.effects.supporters}</span>}
                        {card.effects.money && <span className="effect">Money: {card.effects.money > 0 ? '+$' : '-$'}{Math.abs(card.effects.money)}</span>}
                        {card.effects.speed && <span className="effect">Speed: {card.effects.speed > 0 ? '+' : ''}{card.effects.speed}</span>}
                        {card.effects.energy && <span className="effect">Energy: {card.effects.energy > 0 ? '+' : ''}{card.effects.energy}</span>}
                      </div>
                    </div>
                  ))}
                </div>
                <button className="skip-card-btn" onClick={skipCard}>Skip Card Selection</button>
              </div>
            </div>
          )}
          
          {isVoting && (
            <div className="voting-overlay">
              <div className="voting-container">
                <h2>House of Representatives Voting...</h2>
                <div className="voting-stats">
                  <div className="stat">
                    <span className="stat-label">Total Votes:</span>
                    <span className="stat-value">{currentVoter} / 435</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Yes:</span>
                    <span className="stat-value yes">{votingProgress.filter(v => v === 'yes').length}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">No:</span>
                    <span className="stat-value no">{votingProgress.filter(v => v === 'no').length}</span>
                  </div>
                </div>
                <div className="voting-grid">
                  {votingProgress.map((vote, idx) => (
                    <div key={idx} className={`voter ${vote}`} title={`Representative ${idx + 1}`}>
                      {vote === 'yes' ? '✓' : '✗'}
                    </div>
                  ))}
                  {Array.from({ length: 435 - votingProgress.length }).map((_, idx) => (
                    <div key={`empty-${idx}`} className="voter empty"></div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <div className="game-header-bar">
            <div className="player-stats">
              <h2>{player.name}</h2>
              <p className="party-badge">{player.politicalParty}</p>
              <div className="stats-row">
                <span className="stat-item">Supporters: {supporters}</span>
                <span className="stat-item">Money: ${money}</span>
                <span className="stat-item">Energy: {energy}</span>
                <span className="stat-item">Speed: {speed}</span>
              </div>
            </div>
            <div className="stage-indicator">
              <div className="stage-progress">Stage {stageNumber}/{totalStages}</div>
              <h3>{stageNames[stageNumber]}</h3>
            </div>
          </div>

          <div className="game-content">
            <div className="main-game-area">
              {gameStage === 'draft' && (
                <div className="draft-area">
                  <h2>Draft Your Bill</h2>
                  <div className="bill-form">
                    <input
                      type="text"
                      placeholder="Bill Title"
                      value={billTitle}
                      onChange={(e) => setBillTitle(e.target.value)}
                      className="bill-input"
                    />
                    <textarea
                      placeholder="Bill Description"
                      value={billDescription}
                      onChange={(e) => setBillDescription(e.target.value)}
                      className="bill-textarea"
                      rows="6"
                    />
                    <button onClick={handleDraftBill} className="action-btn">Draft Bill</button>
                  </div>
                </div>
              )}

              {gameStage === 'introduce' && (
                <div className="introduce-area">
                  <h2>Introduce Bill: {currentBill.title}</h2>
                  <p className="bill-desc">{currentBill.description}</p>
                  <div className="bet-selector">
                    <label>Legislative Strategy:</label>
                    <div className="bet-buttons">
                      <button
                        className={`bet-btn ${strategicChoice === 'compromise' ? 'selected' : ''}`}
                        onClick={() => setStrategicChoice('compromise')}
                      >
                        COMPROMISE
                        <span className="strategy-desc">Build bipartisan support</span>
                      </button>
                      <button
                        className={`bet-btn ${strategicChoice === 'aggressive' ? 'selected' : ''}`}
                        onClick={() => setStrategicChoice('aggressive')}
                      >
                        AGGRESSIVE
                        <span className="strategy-desc">Push through party lines</span>
                      </button>
                      <button
                        className={`bet-btn ${strategicChoice === 'moderate' ? 'selected' : ''}`}
                        onClick={() => setStrategicChoice('moderate')}
                      >
                        MODERATE
                        <span className="strategy-desc">Balanced approach</span>
                      </button>
                    </div>
                  </div>
                  <button onClick={handleIntroduceBill} className="action-btn" disabled={isVoting}>
                    {isVoting ? 'Voting in Progress...' : 'Introduce to House Floor'}
                  </button>
                </div>
              )}

              {gameStage === 'committee' && voteResult && (
                <div className="committee-area">
                  <h2>Committee Assignment</h2>
                  <div className="stage-description">
                    <p><strong>MOST BILLS DIE HERE!</strong> The Speaker has referred your bill to committee. Committee members will review, amend, or kill your legislation.</p>
                  </div>
                  <div className="vote-results">
                    <div className="vote-box favor">
                      <h3>{voteResult.peopleInFavor}</h3>
                      <p>Initial Support</p>
                    </div>
                    <div className="vote-box against">
                      <h3>{voteResult.peopleAgainst}</h3>
                      <p>Initial Opposition</p>
                    </div>
                  </div>
                  <div className="stage-description">
                    <p>Votes needed to pass this committee: {committeeNeededVotes} of {committeeSize} ({committeeNeededPercent}%).</p>
                  </div>
                  <div className="committee-selector">
                    <label>Select Committee (determines jurisdiction):</label>
                    <select
                      value={selectedCommittee}
                      onChange={(e) => setSelectedCommittee(e.target.value)}
                      className="committee-select"
                    >
                      {committees.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="bet-selector">
                    <label>Legislative Strategy:</label>
                    <div className="bet-buttons">
                      <button
                        className={`bet-btn ${strategicChoice === 'compromise' ? 'selected' : ''}`}
                        onClick={() => setStrategicChoice('compromise')}
                      >
                        COMPROMISE
                      </button>
                      <button
                        className={`bet-btn ${strategicChoice === 'aggressive' ? 'selected' : ''}`}
                        onClick={() => setStrategicChoice('aggressive')}
                      >
                        AGGRESSIVE
                      </button>
                    </div>
                  </div>
                  <button onClick={handleCommittee} className="action-btn">Submit to Committee</button>
                </div>
              )}

              {gameStage === 'rules' && (
                <div className="rules-area">
                  <h2>Rules Committee</h2>
                  <div className="stage-description">
                    <p>The Rules Committee sets the terms of debate - how long and what amendments are allowed.</p>
                  </div>
                  <button onClick={handleRulesCommittee} className="action-btn">Submit to Rules Committee</button>
                </div>
              )}

              {gameStage === 'houseFloor' && rulesResult && (
                <div className="debate-area">
                  <h2>House Floor Debate</h2>
                  <div className="stage-description">
                    <p>Your bill is now being debated on the House floor. Representatives will debate and vote.</p>
                    <p>Votes needed to pass: 218 of 435 (50% + 1).</p>
                  </div>
                  <div className="debate-info">
                    <p>Debate Length: {rulesResult.debateLength} hours</p>
                    <p>Scheduled: {rulesResult.whenWillBeDebated}</p>
                  </div>
                  <button onClick={handleHouseFloorVote} className="action-btn">Call House Floor Vote</button>
                </div>
              )}

              {gameStage === 'senateIntro' && (
                <div className="senate-area">
                  <h2>Senate Introduction</h2>
                  <div className="stage-description">
                    <p>Your bill passed the House! Now a Senator must introduce it in the Senate.</p>
                  </div>
                  <button onClick={handleSenateIntro} className="action-btn">Introduce in Senate</button>
                </div>
              )}

              {gameStage === 'senateCommittee' && (
                <div className="senate-area">
                  <h2>Senate Committee Action</h2>
                  <div className="stage-description">
                    <p><strong>CRITICAL STAGE!</strong> The Senate committee will review your bill. Different rules than the House.</p>
                  </div>
                  <button onClick={handleSenateCommittee} className="action-btn">Submit to Senate Committee</button>
                </div>
              )}

              {gameStage === 'senateLeader' && (
                <div className="senate-area">
                  <h2>Senate Majority Leader</h2>
                  <div className="stage-description">
                    <p>The Senate Majority Leader decides when to bring your bill to the floor for debate.</p>
                  </div>
                  <button onClick={handleSenateLeader} className="action-btn">Request Floor Time</button>
                </div>
              )}

              {gameStage === 'senateFloor' && (
                <div className="senate-area">
                  <h2>Senate Floor Debate</h2>
                  <div className="stage-description">
                    <p>Your bill is being debated in the Senate. Senators may propose amendments.</p>
                    <p>Votes needed to pass: 51 of 100 (simple majority).</p>
                  </div>
                  <button onClick={handleSenateFloorVote} className="action-btn">Call Senate Vote</button>
                </div>
              )}

              {gameStage === 'conference' && (
                <div className="conference-area">
                  <h2>Conference Committee</h2>
                  <div className="stage-description">
                    <p>The House and Senate passed different versions. A conference committee will work out a compromise.</p>
                  </div>
                  <button onClick={handleConference} className="action-btn">Convene Conference</button>
                </div>
              )}

              {gameStage === 'compromise' && (
                <div className="compromise-area">
                  <h2>Vote on Compromise</h2>
                  <div className="stage-description">
                    <p>Both House and Senate must approve the compromise bill. No amendments allowed.</p>
                  </div>
                  <button onClick={handleCompromise} className="action-btn">Call Compromise Vote</button>
                </div>
              )}

              {gameStage === 'president' && (
                <div className="president-area">
                  <h2>Presidential Action</h2>
                  <div className="stage-description">
                    <p>Your bill has reached the White House! The President must decide to sign or veto.</p>
                  </div>
                  {presidentPending ? (
                    <div className="stage-description"><p>President reviewing the bill...</p></div>
                  ) : (
                    <div className="president-buttons">
                      <button onClick={() => handlePresidentAction('sign')} className="action-btn sign-btn">SIGN INTO LAW</button>
                      <button onClick={() => handlePresidentAction('veto')} className="action-btn veto-btn">VETO</button>
                    </div>
                  )}
                </div>
              )}

              {gameStage === 'override' && (
                <div className="override-area">
                  <h2>Override Presidential Veto</h2>
                  <div className="stage-description">
                    <p>Need 2/3 vote in BOTH chambers to override the veto.</p>
                    <p>Votes needed: House 290 of 435 and Senate 67 of 100.</p>
                  </div>
                  <button onClick={handleOverride} className="action-btn">Attempt Veto Override</button>
                </div>
              )}

              {gameStage === 'judicial' && (
                <div className="judicial-area">
                  <h2>Judicial Review</h2>
                  <div className="stage-description">
                    <p>The law has been challenged! The Supreme Court will review its constitutionality.</p>
                  </div>
                  <button onClick={handleJudicialReview} className="action-btn">Supreme Court Decision</button>
                </div>
              )}

              {gameStage === 'passed' && (
                <div className="result-area passed">
                  <h1>BILL PASSED!</h1>
                  <p>Congratulations! Your bill "{currentBill.title}" is now law!</p>
                  <button onClick={handleRestart} className="action-btn">Draft Another Bill</button>
                </div>
              )}

              {gameStage === 'failed' && (
                <div className="result-area failed">
                  <h1>BILL FAILED</h1>
                  <p className="bill-title-failed">"{currentBill.title}" did not become law</p>
                  
                  <div className="failure-details">
                    <div className="failure-stage">
                      <strong>Failed At:</strong>
                      <p>{failureStage}</p>
                    </div>
                    <div className="failure-reason">
                      <strong>Reason:</strong>
                      <p>{failureReason}</p>
                    </div>
                  </div>
                  
                  <div className="failure-stats">
                    <p>Final Stats:</p>
                    <div className="stats-grid">
                      <span>Supporters: {supporters}</span>
                      <span>Money: ${money}</span>
                      <span>Energy: {energy}</span>
                      <span>Speed: {speed}</span>
                    </div>
                  </div>
                  
                  <button onClick={handleRestart} className="action-btn retry-btn">Try Another Bill</button>
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  )
}

export default App
