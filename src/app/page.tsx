'use client'

import { useState, useEffect, useRef } from 'react'
import { questions, Question } from '@/data/questions'

export default function Home() {
  const [unseenQuestions, setUnseenQuestions] = useState<Question[]>([])
  const [seenQuestions, setSeenQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [questionsSeen, setQuestionsSeen] = useState(0)
  const [state, setState] = useState<'respuesta' | 'siguiente'>('respuesta')
  const [isClickable, setIsClickable] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileHint, setShowMobileHint] = useState(false)
  const [isHolding, setIsHolding] = useState(false)
  
  const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isClickableRef = useRef(isClickable)
  const hasIncrementedRef = useRef(false)
  const counterRef = useRef(0)

  const HOLD_TIME = 600
  const CLICK_DEBOUNCE = 500

  // Detect mobile device
  const detectMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }

  // Normalize category name
  const normalizeCategory = (category: string) => {
    return category.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '').toLowerCase()
  }

  // Shuffle array
  const shuffle = (array: Question[]) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Initialize game
  const initGame = () => {
    console.log('initGame called')
    const shuffled = shuffle(questions)
    setUnseenQuestions(shuffled)
    setSeenQuestions([])
    setQuestionsSeen(0)
    counterRef.current = 0
    hasIncrementedRef.current = false
    // Get first question without incrementing counter
    const firstQuestion = shuffled.pop()!
    setCurrentQuestion(firstQuestion)
    setSeenQuestions([firstQuestion])
    setQuestionsSeen(1) // Set to 1 for first question
    counterRef.current = 1
    setState('respuesta')
    setUnseenQuestions(shuffled)
    console.log('initGame: counter set to 1')
  }

  // Show next question
  const showNextQuestion = () => {
    console.log('showNextQuestion called, current counter:', questionsSeen)
    
    setUnseenQuestions(prev => {
      if (prev.length === 0) {
        // Reset if all questions seen
        console.log('Resetting questions')
        const newUnseen = shuffle(seenQuestions)
        setSeenQuestions([])
        setQuestionsSeen(0)
        counterRef.current = 0
        hasIncrementedRef.current = false
        const nextQ = newUnseen.pop()!
        setCurrentQuestion(nextQ)
        setSeenQuestions([nextQ])
        setQuestionsSeen(1) // Set to 1 for the first question after reset
        counterRef.current = 1
        console.log('Reset: counter set to 1')
        return newUnseen
      } else {
        const nextQ = prev.pop()!
        setCurrentQuestion(nextQ)
        setSeenQuestions(prevSeen => [...prevSeen, nextQ])
        
        // Use ref to track actual counter value - only increment once
        if (!hasIncrementedRef.current) {
          counterRef.current += 1
          hasIncrementedRef.current = true
          const newCounter = counterRef.current
          console.log('Setting counter to', newCounter)
          setQuestionsSeen(newCounter)
        }
        
        setState('respuesta')
        return prev
      }
    })
  }

  // Show answer
  const showAnswer = () => {
    console.log('showAnswer called, counter stays at:', questionsSeen)
    setState('siguiente')
  }

  // Handle hold start
  const handleHoldStart = () => {
    setIsHolding(true)
    holdTimeoutRef.current = setTimeout(() => {
      if (state === 'respuesta') {
        showAnswer()
      } else if (state === 'siguiente') {
        hasIncrementedRef.current = false // Reset flag before next question
        showNextQuestion()
      }
      setIsHolding(false)
    }, HOLD_TIME)
  }

  // Handle hold end
  const handleHoldEnd = () => {
    setIsHolding(false)
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current)
      holdTimeoutRef.current = null
    }
  }

  // Handle click
  const handleClick = () => {
    // On mobile, only show hint, don't execute the action
    if (isMobile) {
      setShowMobileHint(true)
      setTimeout(() => setShowMobileHint(false), 3000)
      return
    }
    
    // On desktop, allow clicks
    if (!isClickableRef.current) return
    
    setIsClickable(false)
    isClickableRef.current = false
    
    if (state === 'respuesta') {
      showAnswer()
    } else if (state === 'siguiente') {
      hasIncrementedRef.current = false // Reset flag before next question
      showNextQuestion()
    }
    
    setTimeout(() => {
      setIsClickable(true)
      isClickableRef.current = true
    }, CLICK_DEBOUNCE)
  }

  // Initialize on mount
  useEffect(() => {
    setIsMobile(detectMobile())
    initGame()
  }, [])

  // Update ref when isClickable changes
  useEffect(() => {
    isClickableRef.current = isClickable
  }, [isClickable])

  if (!currentQuestion) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Cargando...</p>
      </div>
    )
  }

  const normalizedCategory = normalizeCategory(currentQuestion.category)

  return (
    <div className="container">
      <header>
        <div className="counter">
          <span id="questionsSeen">{questionsSeen}</span>
        </div>
        <p className="site-title">cifrasdelmundo.com</p>
      </header>
      
      <main className="game-area">
        <div className="question-card">
          <div 
            id="categoryDisplay" 
            className={`category-display category-${normalizedCategory}`}
          >
            {currentQuestion.category}
          </div>
          <h2 id="currentQuestion">{currentQuestion.question}</h2>
          <div 
            id="answerDisplay" 
            className={`answer-display ${state === 'siguiente' ? 'visible' : 'answer-placeholder'}`}
          >
            <div className="answer-number" id="answerNumber">
              {state === 'siguiente' ? currentQuestion.answer : ''}
            </div>
            <div className="answer-explanation" id="answerExplanation">
              {state === 'siguiente' ? currentQuestion.explanation : ''}
            </div>
          </div>
        </div>
        
        <div className="button-card">
          <div className="button-group">
            <button 
              id="mainBtn" 
              className={`btn ${isHolding ? 'holding' : ''}`}
              onMouseDown={handleHoldStart}
              onMouseUp={handleHoldEnd}
              onMouseLeave={handleHoldEnd}
              onTouchStart={handleHoldStart}
              onTouchEnd={handleHoldEnd}
              onClick={handleClick}
            >
              <span id="btnLabel">{state === 'respuesta' ? 'Respuesta' : 'Siguiente'}</span>
            </button>
          </div>
          {showMobileHint && (
            <div id="mobileHint" className="mobile-hint">
              Mantén apretado
            </div>
          )}
        </div>
      </main>
      
      <footer>
        <a href="/multiplayer" className="multiplayer-link">Multijugador</a>
        <p>
          ¿Cuánto sabes sobre el mundo en números? 
          <a href="/about" className="about-link">Sobre el proyecto</a>
        </p>
      </footer>
    </div>
  )
} 