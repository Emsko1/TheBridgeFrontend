import * as signalR from '@microsoft/signalr'

let connection = null

// Initialize SignalR connection
export const initializeSignalR = async () => {
  if (connection && connection.state === signalR.HubConnectionState.Connected) {
    return connection
  }

  const hubUrl = 'https://thebridgebackend.onrender.com'

  connection = new signalR.HubConnectionBuilder()
    .withUrl(`${hubUrl}/hub/marketplace`)
    .withAutomaticReconnect([0, 0, 0, 3000, 5000, 10000]) // Retry delays in ms
    .withHubProtocol(new signalR.JsonHubProtocol())
    .configureLogging(signalR.LogLevel.Information)
    .build()

  // Handle connection events
  connection.onreconnecting((error) => {
    console.log('SignalR reconnecting...', error)
  })

  connection.onreconnected((connectionId) => {
    console.log('SignalR reconnected with connection ID:', connectionId)
  })

  connection.onclose((error) => {
    console.log('SignalR connection closed:', error)
    connection = null
  })

  try {
    await connection.start()
    console.log('SignalR connected successfully')
  } catch (err) {
    console.error('Failed to start SignalR connection:', err)
    throw err
  }

  return connection
}

// Get connection
export const getConnection = () => connection

// Listen for new listings
export const onListingCreated = (callback) => {
  if (!connection) return
  connection.on('ListingCreated', (listing) => {
    console.log('New listing received:', listing)
    callback(listing)
  })
}

// Listen for listing updates
export const onListingUpdated = (callback) => {
  if (!connection) return
  connection.on('ListingUpdated', (listing) => {
    console.log('Listing updated:', listing)
    callback(listing)
  })
}

// Listen for listing deletion
export const onListingDeleted = (callback) => {
  if (!connection) return
  connection.on('ListingDeleted', (listingId) => {
    console.log('Listing deleted:', listingId)
    callback(listingId)
  })
}

// Emit events to server
export const notifyListingCreated = async (listing) => {
  if (!connection) return
  try {
    await connection.invoke('BroadcastListingCreated', listing)
  } catch (err) {
    console.error('Failed to broadcast listing created:', err)
  }
}

export const notifyListingUpdated = async (listing) => {
  if (!connection) return
  try {
    await connection.invoke('BroadcastListingUpdated', listing)
  } catch (err) {
    console.error('Failed to broadcast listing updated:', err)
  }
}

export const notifyListingDeleted = async (listingId) => {
  if (!connection) return
  try {
    await connection.invoke('BroadcastListingDeleted', listingId)
  } catch (err) {
    console.error('Failed to broadcast listing deleted:', err)
  }
}

// Disconnect
export const disconnectSignalR = async () => {
  if (connection) {
    try {
      await connection.stop()
      connection = null
      console.log('SignalR disconnected')
    } catch (err) {
      console.error('Error disconnecting SignalR:', err)
    }
  }
}
