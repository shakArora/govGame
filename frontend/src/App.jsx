import { useState } from 'react'
import { welcomeMessage1 } from './logic'
import './App.css'

function App() {
  const [name, setName] = useState('')
  const [politicalParty, setPoliticalParty] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [errors, setErrors] = useState({})

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
    setGameStarted(true)
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
        <div className="game-screen">
          <h1 className="game-header">{welcomeMessage1()}</h1>
        </div>
      )}
    </div>
  )
}

export default App
