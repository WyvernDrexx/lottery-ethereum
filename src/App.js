import { useEffect, useState } from 'react'
import './App.css'
import web3 from './web3'
import Contract from './Contract'

function App() {
  const [players, setPlayers] = useState([])
  const [account, setAccount] = useState(null)
  const [message, setMessage] = useState(null)
  const [manager, setManager] = useState(null)
  const [balance, setBalance] = useState('0')
  const [etherInput, setEtherInput] = useState(0.2)

  const populateState = async () => {
    const manager = await Contract.methods.manager().call()
    const players = await Contract.methods.getPlayers().call()
    const balance = await web3.eth.getBalance(Contract.options.address)
    const accounts = await web3.eth.getAccounts()
    setManager(manager)
    setBalance(balance)
    setPlayers(players)
    setAccount(accounts[0])
  }

  const handleEnterClick = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    const accounts = await web3.eth.getAccounts()
    setMessage('Transaction has been sent!')
    await Contract.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(etherInput, 'ether')
    })
    setMessage('Transaction successfull!')
    setTimeout(() => {
      setMessage(null)
    }, 3000)
  }

  const handlePickWinner = async () => {
    setMessage('Winner being picked!')
    await Contract.methods.pickWinner().send({
      from: account
    })
    setMessage('Winner has been picked!! Money on the way!')
  }

  useEffect(() => {
    populateState()
    setInterval(() => {
      populateState()
    }, 3000)
  }, [])

  if (!manager) return <h1>Loading..</h1>
  return (
    <div className='App'>
      <h1>Lottery! OH YEA!</h1>
      <h4>[MANAGER]: {manager}</h4>
      <h4>[CURRENT ACCOUNT]: {account}</h4>
      <p>
        There are currently
        <strong>{` ${players.length}`}</strong> players, competing for <strong>{web3.utils.fromWei(balance)}ETH</strong>
      </p>
      <form>
        <label>Amount of ether to enter:</label>
        <br />
        <input
          placeholder='Ether Amount'
          value={etherInput}
          type='number'
          onChange={(e) => setEtherInput(e.target.value)}
        />
        <button onClick={handleEnterClick}>Enter!</button>
        <hr />
        {message && (
          <div>
            <h1>{message}</h1>
          </div>
        )}
      </form>
      <div>{account === manager && <button onClick={handlePickWinner}>PICK A WINNER</button>}</div>
    </div>
  )
}

export default App
