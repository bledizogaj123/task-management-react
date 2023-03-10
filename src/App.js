import './App.css'

import React, { Component } from 'react'
import Board from 'react-trello'
import axios from 'axios'

const data = require('./data.json')
const API_ENDPOINT = 'http://board-laravel-app.test/api/task-management';
const handleDragStart = (cardId, laneId) => {
}

const handleDragEnd = (cardId, sourceLaneId, targetLaneId) => {
  axios.patch(API_ENDPOINT+'/'+cardId, { list: targetLaneId })
  .then(response => {
    console.log(response);
  })
  .catch(error => {
    console.log(error);
  });
}

class App extends Component {
  state = { boardData: { lanes: [] } }
  
  setEventBus = (eventBus) => {
    this.setState({ eventBus })
  }

  async componentDidMount() {

    try {
      const taskRequest = await axios.get(API_ENDPOINT);
      taskRequest.data.forEach(task => {
        data.lanes[task.list].cards.push({
          id: task.id.toString(),
          title: task.item,
          description: task.description?  task.description: "not set",
          "cardStyle": { "width": 270, "maxWidth": 270, "margin": "auto", "marginBottom": 5 }
        });
      });
    } catch (error) {
      console.error(error);
    }
    const response = await this.getBoard()
    this.setState({ boardData: response })
  }

  getBoard() {
    return new Promise((resolve) => {
      resolve(data)
    })
  }


  onCardDelete = (cardId, lineId) => {
    axios.delete(API_ENDPOINT + '/' +cardId)
    .catch(error => {
          console.error('Error deleting row:', error);
        });
  }

  onCardUpdate = (cardId, data) => {
      if (data.title) {
        data = {item: data.title, id: data.id};
      }
      axios.patch(API_ENDPOINT + '/' + data.id, data)
      .then(response => {
        console.log('Card updated:', response.data);
      })
      .catch(error => {
        console.error('Error updating card:', error);
      });
  }
  
  handleCardAdd = async (card, laneId) => {
    try {
      const response = await axios.post(API_ENDPOINT, {list: laneId, item: card.title, description: card.description});
      console.log(response.data); // The newly created task
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h3>Task Management</h3>
        </div>
        <div className="App-intro">
          <Board
            editable
            onCardAdd={this.handleCardAdd}
            data={this.state.boardData}
            onCardDelete={this.onCardDelete}
            draggable
            onCardUpdate={this.onCardUpdate}
            eventBusHandle={this.setEventBus}
            handleDragStart={handleDragStart}
            handleDragEnd={handleDragEnd}
          />
        </div>
      </div>
    )
  }
}

export default App
