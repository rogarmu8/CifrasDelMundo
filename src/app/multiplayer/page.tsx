'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { questions, Question } from '@/data/questions'

interface Player {
  id: string
  name: string
  score: number
  isHost: boolean
  currentAnswer?: string
  hasAnswered: boolean
}

interface Room {
  id: string
  host_id: string
  status: 'waiting' | 'playing' | 'finished'
  question_count: number | null
  current_question_index: number
  current_question_id: string
  players: Player[]
  created_at: string
  game_state: 'lobby' | 'playing' | 'showing-results'
  time_left: number
  show_results: boolean
  results: {playerId: string, name: string, answer: number, correct: boolean, points: number}[]
}

export default function Multiplayer() {
  const [name, setName] = useState('')
  const [questionCount, setQuestionCount] = useState(10)
  const [isEndless, setIsEndless] = useState(false)
  const [joinRoomId, setJoinRoomId] = useState('')
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null)
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [currentInput, setCurrentInput] = useState('')
  const [copiedText, setCopiedText] = useState('')
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create')
  
  const timeRef = useRef<NodeJS.Timeout | null>(null)

  // Generate a 6-character room ID
  const generateRoomId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  // Subscribe to room changes
  useEffect(() => {
    if (!currentRoom) return

    const channel = supabase
      .channel(`room:${currentRoom.id}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'rooms' 
        }, 
        (payload) => {
          console.log('Room update:', payload)
          if (payload.new) {
            const updatedRoom = payload.new as Room
            
            // Only update local state if there are meaningful changes (excluding timer)
            const hasGameStateChange = currentRoom.game_state !== updatedRoom.game_state
            const hasQuestionChange = currentRoom.current_question_id !== updatedRoom.current_question_id
            const hasQuestionIndexChange = currentRoom.current_question_index !== updatedRoom.current_question_index
            const hasPlayerChange = JSON.stringify(currentRoom.players) !== JSON.stringify(updatedRoom.players)
            const hasResultsChange = currentRoom.show_results !== updatedRoom.show_results
            
            console.log('Room update detected:', { 
              hasGameStateChange, 
              hasQuestionChange, 
              hasQuestionIndexChange,
              hasPlayerChange, 
              hasResultsChange,
              oldState: currentRoom.game_state,
              newState: updatedRoom.game_state,
              oldQuestion: currentRoom.current_question_id,
              newQuestion: updatedRoom.current_question_id,
              oldPlayers: currentRoom.players.length,
              newPlayers: updatedRoom.players.length
            })
            
            // Always update room state for player changes
            if (hasPlayerChange) {
              console.log('Player change detected, updating room state')
              console.log('Old players:', currentRoom.players)
              console.log('New players:', updatedRoom.players)
              setCurrentRoom(updatedRoom)
              
              // Update current player state if player data changed
              const updatedPlayer = updatedRoom.players?.find(p => p.id === currentPlayer?.id)
              if (updatedPlayer) {
                console.log('Updating current player state:', updatedPlayer)
                setCurrentPlayer(updatedPlayer)
              }
            } else {
              // For non-player changes, update room state
              setCurrentRoom(updatedRoom)
            }
            
            // Only reset question state on meaningful changes (never reset input)
            if (hasGameStateChange || hasQuestionChange || hasQuestionIndexChange || hasResultsChange) {
              if (updatedRoom.game_state === 'playing') {
                const question = questions.find(q => q.question === updatedRoom.current_question_id)
                console.log('Setting new question:', question)
                if (question) {
                  setCurrentQuestion(question)
                  // Reset player's answered state for new question but keep input
                  setCurrentPlayer(prev => prev ? { ...prev, hasAnswered: false } : null)
                }
              } else if (updatedRoom.game_state === 'showing-results') {
                setCurrentQuestion(questions.find(q => q.question === updatedRoom.current_question_id) || null)
              } else if (updatedRoom.game_state === 'lobby') {
                setCurrentQuestion(null)
              }
            }
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentRoom?.id, currentPlayer?.id])

  // Polling mechanism to check if all players have answered (when host is waiting)
  useEffect(() => {
    if (!currentRoom || !currentPlayer?.isHost || currentRoom.game_state !== 'playing') {
      return
    }

    // Host checks every second if all players have answered
    const pollInterval = setInterval(async () => {
      try {
        const { data: room, error } = await supabase
          .from('rooms')
          .select('*')
          .eq('id', currentRoom.id)
          .single()

        if (!error && room) {
          console.log('=== DEBUG: POLLING CHECK ===')
          console.log('Room from database:', room)
          console.log('Players from database:', room.players)
          console.log('Each player details:')
          room.players.forEach((player: any) => {
            console.log(`- ${player.name}: hasAnswered=${player.hasAnswered}, currentAnswer="${player.currentAnswer}" (type: ${typeof player.currentAnswer})`)
          })
          
          const allAnswered = (room.players as Player[]).every((p: Player) => p.hasAnswered)
          console.log('All answered:', allAnswered)
          
          if (allAnswered) {
            console.log('All players have answered, showing results immediately')
            // Use the fresh room data from database for results
            const freshRoom = room as Room
            await showResultsForAllPlayersWithData(freshRoom)
            clearInterval(pollInterval)
          }
        }
      } catch (error) {
        console.error('Error polling for answers:', error)
      }
    }, 1000)

    return () => {
      clearInterval(pollInterval)
    }
  }, [currentRoom?.id, currentPlayer?.isHost, currentRoom?.game_state])

  // Clear input when question changes (separate from real-time updates)
  useEffect(() => {
    if (currentQuestion && currentRoom?.game_state === 'playing') {
      // Only clear input if we're starting a new question and player hasn't answered yet
      if (!currentPlayer?.hasAnswered) {
        setCurrentInput('')
      }
    }
  }, [currentQuestion?.question, currentRoom?.game_state])

  // Host timer management - separate from real-time updates
  useEffect(() => {
    if (!currentRoom || !currentPlayer?.isHost || currentRoom.game_state !== 'playing') {
      if (timeRef.current) {
        clearTimeout(timeRef.current)
      }
      return
    }

    // Only start timer if at least one player has answered AND timer has been started
    const hasAnyPlayerAnswered = currentRoom.players.some(p => p.hasAnswered)
    const timerStarted = currentRoom.time_left < 30 // Timer has been started (less than initial 30)
    
    if (!hasAnyPlayerAnswered || !timerStarted) {
      // No one has answered yet or timer hasn't been started, don't count down
      return
    }

    if (currentRoom.time_left > 0) {
      timeRef.current = setTimeout(async () => {
        const newTimeLeft = currentRoom.time_left - 1
        
        // Update local timer state immediately for smooth UI
        setCurrentRoom(prev => prev ? { ...prev, time_left: newTimeLeft } : null)
        
        // Update database every second for smooth timer updates
        const { error } = await supabase
          .from('rooms')
          .update({ time_left: newTimeLeft })
          .eq('id', currentRoom.id)

        if (!error && newTimeLeft === 0) {
          // Time's up - host shows results
          await showResultsForAllPlayers()
        }
      }, 1000)
    }

    return () => {
      if (timeRef.current) {
        clearTimeout(timeRef.current)
      }
    }
  }, [currentRoom?.time_left, currentPlayer?.isHost, currentRoom?.game_state, currentRoom?.players])

  // Host polling to detect when first player answers and start timer
  useEffect(() => {
    if (!currentRoom || !currentPlayer?.isHost || currentRoom.game_state !== 'playing') {
      return
    }

    // Check if timer should be started (when first player answers)
    const hasAnyPlayerAnswered = currentRoom.players.some(p => p.hasAnswered)
    const timerNotStarted = currentRoom.time_left === 30 // Timer hasn't started yet

    if (hasAnyPlayerAnswered && timerNotStarted) {
      // First player answered, start the timer
      const startTimer = async () => {
        const { error } = await supabase
          .from('rooms')
          .update({ time_left: 29 }) // Start at 29 since we're about to tick to 28
          .eq('id', currentRoom.id)

        if (!error) {
          setCurrentRoom(prev => prev ? { ...prev, time_left: 29 } : null)
        }
      }
      
      startTimer()
    }
  }, [currentRoom?.players, currentPlayer?.isHost, currentRoom?.game_state, currentRoom?.time_left])

  // Function to show results for all players (host only)
  const showResultsForAllPlayers = async () => {
    if (!currentRoom || !currentPlayer?.isHost || !currentQuestion) return

    const correctAnswer = currentQuestion.answer
    console.log('=== DEBUG: SHOWING RESULTS ===')
    console.log('Correct answer:', correctAnswer)
    console.log('All players:', currentRoom.players)
    
    const playerResults = currentRoom.players.map(player => {
      console.log(`Player ${player.name}: currentAnswer = ${player.currentAnswer}, type = ${typeof player.currentAnswer}`)
      
      if (player.currentAnswer === undefined || player.currentAnswer === null) {
        console.log(`Player ${player.name}: No answer provided`)
        return { playerId: player.id, name: player.name, answer: 0, correct: false, points: 0 }
      }

      // Check for exact string match first (handles large numbers perfectly)
      const isExactMatch = player.currentAnswer === correctAnswer.toString()
      
      let points = 0
      let numericAnswer = 0
      
      if (isExactMatch) {
        points = 2
        numericAnswer = correctAnswer
        console.log(`Player ${player.name}: Exact string match! +2 points`)
      } else {
        // For non-exact matches, try to convert to numbers for closest answer calculation
        numericAnswer = parseFloat(player.currentAnswer)
        if (isNaN(numericAnswer)) {
          console.log(`Player ${player.name}: Invalid numeric answer`)
          return { playerId: player.id, name: player.name, answer: 0, correct: false, points: 0 }
        }

        const difference = Math.abs(numericAnswer - correctAnswer)
        
        console.log(`Player ${player.name}: difference = ${difference}`)
        
        // Find all unique differences and sort them to determine ranking
        const allDifferences = currentRoom.players
          .filter(p => p.currentAnswer !== undefined && p.currentAnswer !== null)
          .map(p => {
            // Skip exact matches
            if (p.currentAnswer === correctAnswer.toString()) {
              return 0
            }
            const num = parseFloat(p.currentAnswer!)
            return isNaN(num) ? Infinity : Math.abs(num - correctAnswer)
          })
          .filter(diff => diff !== 0) // Remove exact matches from closest calculation
        
        // Sort differences to find the minimum (closest answer)
        const sortedDifferences = Array.from(new Set(allDifferences)).sort((a, b) => a - b)
        const minDifference = sortedDifferences[0] || Infinity
        
        console.log(`Player ${player.name}: allDifferences = ${allDifferences}, sortedDifferences = ${sortedDifferences}, minDifference = ${minDifference}`)
        
        // Check if this player's answer is among the closest answers
        if (Math.abs(difference - minDifference) < 0.0001) { // Use small epsilon for float comparison
          points = 1
          console.log(`Player ${player.name}: Closest answer! +1 point`)
        } else {
          console.log(`Player ${player.name}: Not closest, +0 points`)
        }
      }

      return {
        playerId: player.id,
        name: player.name,
        answer: numericAnswer,
        correct: isExactMatch,
        points
      }
    })

    console.log('Final results:', playerResults)

    // Update scores
    const updatedPlayers = currentRoom.players.map(player => {
      const result = playerResults.find(r => r.playerId === player.id)
      return {
        ...player,
        score: player.score + (result?.points || 0),
        currentAnswer: undefined,
        hasAnswered: false
      }
    })

    // Host updates the database with results and new scores
    const { error } = await supabase
      .from('rooms')
      .update({ 
        game_state: 'showing-results',
        show_results: true,
        results: playerResults,
        players: updatedPlayers
      })
      .eq('id', currentRoom.id)

    if (!error) {
      // Wait for host to press "Siguiente" button
    }
  }

  // Function to show results using provided room data
  const showResultsForAllPlayersWithData = async (roomData: Room) => {
    if (!currentPlayer?.isHost || !currentQuestion) return

    const correctAnswer = currentQuestion.answer
    console.log('=== DEBUG: SHOWING RESULTS WITH FRESH DATA ===')
    console.log('Correct answer:', correctAnswer)
    console.log('Room data:', roomData)
    console.log('All players from fresh data:', roomData.players)
    
    const playerResults = roomData.players.map(player => {
      console.log(`Player ${player.name}: currentAnswer = ${player.currentAnswer}, type = ${typeof player.currentAnswer}`)
      
      if (player.currentAnswer === undefined || player.currentAnswer === null) {
        console.log(`Player ${player.name}: No answer provided`)
        return { playerId: player.id, name: player.name, answer: 0, correct: false, points: 0 }
      }

      // Check for exact string match first (handles large numbers perfectly)
      const isExactMatch = player.currentAnswer === correctAnswer.toString()
      
      let points = 0
      let numericAnswer = 0
      
      if (isExactMatch) {
        points = 2
        numericAnswer = correctAnswer
        console.log(`Player ${player.name}: Exact string match! +2 points`)
      } else {
        // For non-exact matches, try to convert to numbers for closest answer calculation
        numericAnswer = parseFloat(player.currentAnswer)
        if (isNaN(numericAnswer)) {
          console.log(`Player ${player.name}: Invalid numeric answer`)
          return { playerId: player.id, name: player.name, answer: 0, correct: false, points: 0 }
        }

        const difference = Math.abs(numericAnswer - correctAnswer)
        
        console.log(`Player ${player.name}: difference = ${difference}`)
        
        // Find all unique differences and sort them to determine ranking
        const allDifferences = roomData.players
          .filter(p => p.currentAnswer !== undefined && p.currentAnswer !== null)
          .map(p => {
            // Skip exact matches
            if (p.currentAnswer === correctAnswer.toString()) {
              return 0
            }
            const num = parseFloat(p.currentAnswer!)
            return isNaN(num) ? Infinity : Math.abs(num - correctAnswer)
          })
          .filter(diff => diff !== 0) // Remove exact matches from closest calculation
        
        // Sort differences to find the minimum (closest answer)
        const sortedDifferences = Array.from(new Set(allDifferences)).sort((a, b) => a - b)
        const minDifference = sortedDifferences[0] || Infinity
        
        console.log(`Player ${player.name}: allDifferences = ${allDifferences}, sortedDifferences = ${sortedDifferences}, minDifference = ${minDifference}`)
        
        // Check if this player's answer is among the closest answers
        if (Math.abs(difference - minDifference) < 0.0001) { // Use small epsilon for float comparison
          points = 1
          console.log(`Player ${player.name}: Closest answer! +1 point`)
        } else {
          console.log(`Player ${player.name}: Not closest, +0 points`)
        }
      }

      return {
        playerId: player.id,
        name: player.name,
        answer: numericAnswer,
        correct: isExactMatch,
        points
      }
    })

    console.log('Final results:', playerResults)

    // Update scores
    const updatedPlayers = roomData.players.map(player => {
      const result = playerResults.find(r => r.playerId === player.id)
      return {
        ...player,
        score: player.score + (result?.points || 0),
        currentAnswer: undefined,
        hasAnswered: false
      }
    })

    // Host updates the database with results and new scores
    const { error } = await supabase
      .from('rooms')
      .update({ 
        game_state: 'showing-results',
        show_results: true,
        results: playerResults,
        players: updatedPlayers
      })
      .eq('id', roomData.id)

    if (!error) {
      // Wait for host to press "Siguiente" button
    }
  }

  const createRoom = async () => {
    if (!name.trim()) return

    const roomId = generateRoomId()
    const player: Player = {
      id: crypto.randomUUID(),
      name: name.trim(),
      score: 0,
      isHost: true,
      hasAnswered: false
    }

    const room: Room = {
      id: roomId,
      host_id: player.id,
      status: 'waiting',
      question_count: isEndless ? null : questionCount,
      current_question_index: 0,
      current_question_id: '',
      players: [player],
      created_at: new Date().toISOString(),
      game_state: 'lobby',
      time_left: 30,
      show_results: false,
      results: []
    }

    try {
      const { error } = await supabase
        .from('rooms')
        .insert([room])

      if (error) throw error

      setCurrentRoom(room)
      setCurrentPlayer(player)
      setCurrentInput('')
    } catch (error) {
      console.error('Error creating room:', error)
    }
  }

  const joinRoom = async () => {
    if (!name.trim() || !joinRoomId.trim()) return

    const player: Player = {
      id: crypto.randomUUID(),
      name: name.trim(),
      score: 0,
      isHost: false,
      hasAnswered: false
    }

    try {
      const { data: room, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', joinRoomId)
        .single()

      if (error || !room) {
        alert('Room not found')
        return
      }

      if (room.status !== 'waiting') {
        alert('Game already in progress')
        return
      }

      const updatedPlayers = [...room.players, player]
      
      const { error: updateError } = await supabase
        .from('rooms')
        .update({ players: updatedPlayers })
        .eq('id', joinRoomId)

      if (updateError) throw updateError

      setCurrentRoom({ ...room, players: updatedPlayers })
      setCurrentPlayer(player)
      setCurrentInput('')
    } catch (error) {
      console.error('Error joining room:', error)
    }
  }

  const startGame = async () => {
    if (!currentRoom || !currentPlayer?.isHost) return

    const shuffledQuestions = [...questions].sort(() => Math.random() - 0.5)
    const firstQuestion = shuffledQuestions[0]

    try {
      const { error } = await supabase
        .from('rooms')
        .update({
          status: 'playing',
          current_question_index: 0,
          current_question_id: firstQuestion.question,
          game_state: 'playing',
          time_left: 30,
          show_results: false,
          results: []
        })
        .eq('id', currentRoom.id)

      if (error) throw error
    } catch (error) {
      console.error('Error starting game:', error)
    }
  }

  const submitAnswer = async (answer: number) => {
    if (!currentRoom || !currentPlayer || currentRoom.game_state !== 'playing') return

    console.log('=== DEBUG: SUBMITTING ANSWER ===')
    console.log('Player:', currentPlayer.name)
    console.log('Answer:', answer, 'Type:', typeof answer)
    console.log('Current room players before update:', currentRoom.players)

    const updatedPlayers = currentRoom.players.map(p => 
      p.id === currentPlayer.id 
        ? { ...p, currentAnswer: answer.toString(), hasAnswered: true }
        : p
    )

    console.log('Updated players:', updatedPlayers)

    try {
      const { error } = await supabase
        .from('rooms')
        .update({ players: updatedPlayers })
        .eq('id', currentRoom.id)

      if (error) throw error

      // Update local state
      const updatedRoom = { ...currentRoom, players: updatedPlayers }
      setCurrentRoom(updatedRoom)
      setCurrentPlayer({ ...currentPlayer, currentAnswer: answer.toString(), hasAnswered: true })

      console.log('Answer submitted successfully')

      // The host polling mechanism will check if all players have answered
      // and show results immediately when they do
    } catch (error) {
      console.error('Error submitting answer:', error)
    }
  }

  const handleNumberInput = (num: number) => {
    if (currentInput.length < 15) { // Limit to 15 digits
      setCurrentInput(prev => prev + num.toString())
    }
  }

  const handleDecimalPoint = () => {
    if (!currentInput.includes('.') && currentInput.length < 14) {
      setCurrentInput(prev => prev + '.')
    }
  }

  const handleMinusSign = () => {
    if (currentInput.length === 0) {
      setCurrentInput('-')
    }
  }

  const handleBackspace = () => {
    setCurrentInput(prev => prev.slice(0, -1))
  }

  const handleSubmitAnswer = () => {
    if (currentInput && !currentPlayer?.hasAnswered && currentRoom?.game_state === 'playing') {
      const answer = parseFloat(currentInput)
      if (!isNaN(answer)) {
        submitAnswer(answer)
      }
    }
  }

  const nextQuestion = async () => {
    if (!currentRoom || !currentPlayer?.isHost) return

    console.log('nextQuestion called', { currentRoom, currentPlayer })

    const nextIndex = currentRoom.current_question_index + 1
    const questionLimit = currentRoom.question_count

    if (questionLimit && nextIndex >= questionLimit) {
      // Game finished
      console.log('Game finished, returning to lobby')
      const { error } = await supabase
        .from('rooms')
        .update({ 
          status: 'finished',
          game_state: 'lobby',
          show_results: false,
          results: []
        })
        .eq('id', currentRoom.id)

      if (!error) {
        setCurrentInput('')
      }
      return
    }

    const shuffledQuestions = [...questions].sort(() => Math.random() - 0.5)
    const nextQuestion = shuffledQuestions[nextIndex % questions.length]

    console.log('Moving to next question:', { nextIndex, nextQuestion: nextQuestion.question })

    try {
      const { error } = await supabase
        .from('rooms')
        .update({
          current_question_index: nextIndex,
          current_question_id: nextQuestion.question,
          game_state: 'playing',
          time_left: 30,
          show_results: false,
          results: []
        })
        .eq('id', currentRoom.id)

      if (error) {
        console.error('Error updating room for next question:', error)
        throw error
      }
      
      console.log('Successfully updated room for next question')
    } catch (error) {
      console.error('Error moving to next question:', error)
    }
  }

  const leaveRoom = async () => {
    if (!currentRoom || !currentPlayer) return

    try {
      const updatedPlayers = currentRoom.players.filter(p => p.id !== currentPlayer.id)
      
      if (updatedPlayers.length === 0) {
        // Delete room if empty
        await supabase
          .from('rooms')
          .delete()
          .eq('id', currentRoom.id)
      } else {
        // Update room with remaining players
        await supabase
          .from('rooms')
          .update({ players: updatedPlayers })
          .eq('id', currentRoom.id)
      }

      setCurrentRoom(null)
      setCurrentPlayer(null)
      setCurrentInput('')
    } catch (error) {
      console.error('Error leaving room:', error)
    }
  }

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (timeRef.current) clearTimeout(timeRef.current)
    }
  }, [])

  // Cleanup function to delete empty rooms and old rooms
  const cleanupOldRooms = async () => {
    try {
      // Delete empty rooms
      const { error: emptyError } = await supabase
        .from('rooms')
        .delete()
        .eq('players', '[]')
      
      if (emptyError) {
        console.error('Error deleting empty rooms:', emptyError)
      }

      // Delete rooms older than 2 days
      const twoDaysAgo = new Date()
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
      
      const { error: oldError } = await supabase
        .from('rooms')
        .delete()
        .lt('created_at', twoDaysAgo.toISOString())
      
      if (oldError) {
        console.error('Error deleting old rooms:', oldError)
      }

      console.log('Room cleanup completed')
    } catch (error) {
      console.error('Error in room cleanup:', error)
    }
  }

  // Run cleanup when component mounts
  useEffect(() => {
    cleanupOldRooms()
  }, [])

  if (currentRoom) {
    return (
      <div className="container">
        <header>
          <button onClick={leaveRoom} className="leave-room-btn" title="Leave Room">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
            </svg>
          </button>
          <div className="room-info">
            <h1 
              onClick={() => {
                if (currentRoom?.id) {
                  navigator.clipboard.writeText(currentRoom.id);
                  setCopiedText('Copiado!');
                  setTimeout(() => setCopiedText(''), 2000);
                }
              }}
              className={copiedText ? 'room-id-clicked' : 'room-id-clickable'}
              title="Click to copy Room ID"
            >
              {copiedText || currentRoom?.id}
            </h1>
            {currentRoom?.question_count && (
              <p>{currentRoom.question_count} Preguntas</p>
            )}
          </div>
        </header>

        {currentRoom.game_state === 'lobby' && (
          <div className="game-area">
            <div className="question-card">
              <div className="players-list">
                {currentRoom.players.map(player => (
                  <div key={player.id} className="player-item">
                    <span>{player.name}</span>
                    {player.isHost && <span className="host-badge">Host</span>}
                    <span className="score">{player.score} pts</span>
                  </div>
                ))}
              </div>
              {currentPlayer?.isHost && currentRoom.players.length > 1 && (
                <div className="start-game-container">
                  <button onClick={startGame} className="btn btn-primary">Empezar</button>
                </div>
              )}
              {!currentPlayer?.isHost && (
                <div className="start-game-container">
                  <p>Esperando a que el host inicie el juego...</p>
                </div>
              )}
            </div>
          </div>
        )}

        {currentRoom.game_state === 'playing' && currentQuestion && (
          <div className="game-area">
            <div className={`timer ${!(currentRoom.players.some(p => p.hasAnswered) && currentRoom.time_left < 30) ? 'waiting' : ''} ${currentRoom.time_left <= 5 && currentRoom.time_left > 0 ? 'critical' : ''}`}>
              {currentRoom.players.some(p => p.hasAnswered) && currentRoom.time_left < 30
                ? `${currentRoom.time_left}s` 
                : '30s'
              }
            </div>
            <div className="question-card">
              <div className="category-display category-{currentQuestion.category.toLowerCase()}">
                {currentQuestion.category.toUpperCase()}
              </div>
              <h2 id="currentQuestion">{currentQuestion.question}</h2>
            </div>
            
            <div className="button-card">
              <div className="numeric-keyboard">
                <div className="input-display">
                  <span className="input-label">Tu respuesta:</span>
                  <div className="input-value">
                    {currentPlayer?.hasAnswered 
                      ? currentPlayer.currentAnswer 
                      : (currentInput || '0')
                    }
                  </div>
                </div>
                <div className="keyboard-row">
                  {[1, 2, 3, 4, 5].map(num => (
                    <button
                      key={num}
                      onClick={() => handleNumberInput(num)}
                      className="keyboard-key"
                      disabled={currentPlayer?.hasAnswered}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <div className="keyboard-row">
                  {[6, 7, 8, 9, 0].map(num => (
                    <button
                      key={num}
                      onClick={() => handleNumberInput(num)}
                      className="keyboard-key"
                      disabled={currentPlayer?.hasAnswered}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <div className="keyboard-row">
                  <button 
                    onClick={handleMinusSign} 
                    className="keyboard-key minus-key"
                    disabled={currentPlayer?.hasAnswered}
                  >
                    −
                  </button>
                  <button 
                    onClick={handleDecimalPoint} 
                    className="keyboard-key decimal-key"
                    disabled={currentPlayer?.hasAnswered}
                  >
                    .
                  </button>
                  <button 
                    onClick={handleBackspace} 
                    className="keyboard-key backspace-key"
                    disabled={currentPlayer?.hasAnswered}
                  >
                    ←
                  </button>
                  <button 
                    onClick={handleSubmitAnswer} 
                    className="keyboard-key submit-key"
                    disabled={currentPlayer?.hasAnswered}
                  >
                    {currentPlayer?.hasAnswered ? 'Enviado' : 'Enviar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentRoom.game_state === 'showing-results' && currentRoom.show_results && (
          <div className="game-area">
            <div className="question-card">
              <div className="category-display category-{currentQuestion?.category.toLowerCase()}">
                {currentQuestion?.category.toUpperCase()}
              </div>
              <h2 id="currentQuestion">{currentQuestion?.question}</h2>
              
              <div className="answer-display visible">
                <div className="answer-number">{currentQuestion?.answer}</div>
                <div className="answer-explanation">
                  {currentQuestion?.explanation}
                </div>
              </div>
            </div>
            
            <div className="button-card">
              <div className="results-table">
                <div className="results-header">
                  <div className="header-cell">Pos</div>
                  <div className="header-cell">Nombres</div>
                  <div className="header-cell">Respuesta</div>
                  <div className="header-cell">Esta Ronda</div>
                  <div className="header-cell">Total</div>
                </div>
                {currentRoom.results.map((result, index) => {
                  const player = currentRoom.players.find(p => p.id === result.playerId)
                  const isCurrentPlayer = player?.id === currentPlayer?.id
                  return (
                    <div key={result.playerId} className={`results-row ${isCurrentPlayer ? 'current-player-row' : ''}`}>
                      <div className="cell position">#{index + 1}</div>
                      <div className="cell name">{result.name}</div>
                      <div className="cell">{result.answer}</div>
                      <div className={`cell points ${result.points === 2 ? 'gold' : result.points === 1 ? 'green' : 'white'}`}>
                        +{result.points}
                      </div>
                      <div className="cell total">{player?.score || 0} pts</div>
                    </div>
                  )
                })}
              </div>
              
              {currentPlayer?.isHost && (
                <div className="next-question-container">
                  <button onClick={nextQuestion} className="btn btn-primary">
                    Siguiente
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="container">
      <header>
        <h1>Multijugador</h1>
        <a href="/" className="back-link">← Volver</a>
      </header>

      <main className="game-area">
        <div className="question-card">
          
          <div className="player-name-section">
            <div className="form-group">
              <input
                id="playerName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre"
                required
              />
            </div>
          </div>
          
          <div className="mobile-tabs">
            <button 
              className={`tab-button ${activeTab === 'create' ? 'active' : ''}`}
              onClick={() => setActiveTab('create')}
            >
              Crear
            </button>
            <button 
              className={`tab-button ${activeTab === 'join' ? 'active' : ''}`}
              onClick={() => setActiveTab('join')}
            >
              Unirse
            </button>
          </div>
          
          <div className="room-options">
            <div className={`create-section ${activeTab === 'create' ? 'active' : ''}`}>
              <h3>Crear Sala</h3>
              <form onSubmit={(e) => { e.preventDefault(); createRoom(); }}>
                
                
                <div className="form-group">
                  <label htmlFor="questionCount">Número de Preguntas:</label>
                  <input
                    id="questionCount"
                    type="number"
                    min="1"
                    max="50"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                    disabled={isEndless}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={isEndless}
                      onChange={(e) => setIsEndless(e.target.checked)}
                    />
                    Modo Infinito
                  </label>
                </div>
                
                <button type="submit" className="btn btn-primary">Crear Sala</button>
              </form>
            </div>

            <div className="divider"></div>

            <div className={`join-section ${activeTab === 'join' ? 'active' : ''}`}>
              <h3>Unirse a Sala</h3>
              <form onSubmit={(e) => { e.preventDefault(); joinRoom(); }}>
                <div className="form-group">
                  <label htmlFor="roomId">ID de la Sala:</label>
                  <input
                    id="roomId"
                    type="text"
                    value={joinRoomId}
                    onChange={(e) => setJoinRoomId(e.target.value)}
                    placeholder="Ingresa el ID de la sala"
                    required
                  />
                </div>
                
                <button type="submit" className="btn btn-primary">Unirse</button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 