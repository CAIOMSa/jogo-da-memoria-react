import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [cartaGrupo, setCartaGrupo] = useState([])
  const [cartasSelecionadas, setCartasSelecionadas] = useState([])
  const [tamanhoJogo, setTamanhoJogo] = useState(8)
  const [pontos, setPontos] = useState(0)

  const emojis = [
    '🍕', '🍔', '🌭', '🌮', '🍟', '🥪', '🥙', '🍣',
    '🍱', '🍙', '🍜', '🍛', '🍚', '🍘', '🥟', '🍢',
    '🥠', '🧁', '🍰', '🍩', '🍪', '🍫', '🍬', '🍮',
    '🍿', '🥧', '🧀', '🍖', '🥓', '🍗', '🍞', '🥞'
  ]

  function shuffle(array) {
    let currentIndex = array.length
    while (currentIndex !== 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex--
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]
      ]
    }
  }

  useEffect(() => {
    iniciarJogo()
  }, [tamanhoJogo])

  function iniciarJogo() {
    let cards = []
    let values = emojis.slice(0, tamanhoJogo / 2)
    let uniqueId = 1

    values.forEach(value => {
      cards.push(
        {
          id: uniqueId++,
          value,
          opened: false,
          matched: false
        },
        {
          id: uniqueId++,
          value,
          opened: false,
          matched: false
        }
      )
    })

    shuffle(cards)
    setCartaGrupo(cards)
    setCartasSelecionadas([])
    setPontos(0)
  }

  function handleClick(card) {
    if (card.opened || card.matched || cartasSelecionadas.length === 2) return

    const updatedCartas = cartaGrupo.map(c =>
      c.id === card.id ? { ...c, opened: true } : c
    )

    const novasSelecionadas = [...cartasSelecionadas, card]

    setCartaGrupo(updatedCartas)
    setCartasSelecionadas(novasSelecionadas)

    if (novasSelecionadas.length === 2) {
      setTimeout(() => {
        verificarPar(novasSelecionadas)
      }, 1000)
    }
  }

  function verificarPar([c1, c2]) {
    if (c1.value === c2.value) {
      const atualizadas = cartaGrupo.map(c =>
        c.value === c1.value ? { ...c, matched: true } : c
      )
      setCartaGrupo(atualizadas)
      setPontos(p => p + 1)
    } else {
      const atualizadas = cartaGrupo.map(c =>
        c.id === c1.id || c.id === c2.id ? { ...c, opened: false } : c
      )
      setCartaGrupo(atualizadas)
    }
    setCartasSelecionadas([])
  }

  return (
    <div className="container">
      <h1>Jogo da Memória - Pontos: {pontos}</h1>

      <div className="controls">
        <label>
          Tamanho do jogo:{" "}
          <select value={tamanhoJogo} onChange={(e) => setTamanhoJogo(Number(e.target.value))}>
            <option value={8}>8 cartas</option>
            <option value={16}>16 cartas</option>
            <option value={32}>32 cartas</option>
            <option value={64}>64 cartas</option>
          </select>
        </label>
        <button onClick={iniciarJogo}>Reiniciar Jogo</button>
      </div>

      <div className="tabuleiro">
        {cartaGrupo.map((card) => (
          <div
            key={card.id}
            className={`carta ${card.opened || card.matched ? 'aberta' : ''}`}
            onClick={() => handleClick(card)}
          >
            {card.opened || card.matched ? card.value : "?"}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
