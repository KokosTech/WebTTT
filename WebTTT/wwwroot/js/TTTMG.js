let hubConnection;
let gameId;


const createGame = () => {
    let inputInstance = M.Chips.getInstance($('#create__tags-input'))
    let tags = inputInstance.chipsData.map(a => a.tag)

    // Clear input
    for (var i = inputInstance.chipsData.length - 1; i >= 0; i--)
        inputInstance.deleteChip(i)

    createGameRequest(Date.now().toString(), tags.join("\n"))
    showGameScreen()
}

const createGameRequest = async (id, tags) => {
    await connectToHub(id)

    hubConnection.invoke('CreateGame', id, tags)

    tableInit()
}

const connectToGame = async (id) => {
    await connectToGameRequest(id)
    showGameScreen()
    let inputInstance = M.Chips.getInstance($('#connect__tags-input'))
    let tags = inputInstance.chipsData.map(a => a.tag)

    // Clear input
    for (var i = inputInstance.chipsData.length - 1; i >= 0; i--)
        inputInstance.deleteChip(i)
}

const connectToGameRequest = async (id) => {
    await connectToHub(id)

    hubConnection.invoke('ConnectToGame', id)

    tableInit()
}


const connectToHub = async (id) => {
    hubConnection = new signalR.HubConnectionBuilder().withUrl("/hub").build()
    gameId = id.toString();

    async function start() {
        try {
            await hubConnection.start()
            console.log("SignalR Connected.")
        } catch (err) {
            console.log(err)
            setTimeout(start, 3000)
        }
    }
    hubConnection.onclose(start)
    await start()

    return Promise.resolve(true)
}

// -----------------------------------------------------------------------------------

const tableInit = () => {
    const gameboard = document.getElementById('gameboard')
    const gameOverMsg = document.getElementById('gameover-msg')
    const winner = document.getElementById('winner')
    const gameIdElement = document.getElementById('game-id')

    const $ivory = '#F6F7EB'
    const $green = '#16b550'

    gameIdElement.textContent = gameId
    const defaultTilesArray = [0, 1, 2, 3, 4, 5, 6, 7, 8]

    const addTiles = () => {
        defaultTilesArray.forEach((index) => {
            const tile = document.createElement('div')
            tile.id = index
            tile.classList.add('tile')
            tile.addEventListener('click', () => handleClick(tile))
            gameboard.appendChild(tile)
        })
    }

    addTiles()
    const tiles = document.querySelectorAll('.tile')

    const displayMessage = (message) => {
        gameOverMsg.style.display = 'block'
        winner.textContent = message
        setTimeout(() => {
            showConnectScreen()
            resetTable()
        }, 2500)
    }

    const resetTable = () => {
        tiles.forEach((tile) => {
            tile.textContent = ''
            tile.style.color = $ivory
        })
        gameId = ""

        gameOverMsg.style.display = 'none'
    }


    // Hub functions

    const handleClick = (tile) => {
        if (tile.textContent === '') {
            hubConnection.invoke('HandlePlayerTurn', gameId, parseInt(tile.id))
        }
    }

    hubConnection.on('ReceiveMessage', function (message) {
        console.log(message)
    })

    hubConnection.on('ReceiveYourSymbol', function (symbol) {
        document.getElementById('playerX').textContent = 'Opponent'
        document.getElementById('playerO').textContent = 'Opponent'
        document.getElementById('player' + symbol).textContent = 'You'
    })

    hubConnection.on('ReceiveTileValues', function (tileServerValues) {
        console.log(tileServerValues)
        for (var i = 0; i < tiles.length; i++) {
            tiles[i].textContent = tileServerValues[i]
            defaultTilesArray[i] = tileServerValues[i]
        }
    })

    hubConnection.on('ReceiveGameOver', function (message, winTiles) {
        console.log(message + winTiles)

        if (winTiles.length > 0) winTiles.forEach(t => tiles[t].style.color = $green)
        displayMessage(message)
    })
}