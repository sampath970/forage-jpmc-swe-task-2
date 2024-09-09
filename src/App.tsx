import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

/**
 * State declaration for <App />
 */
interface IState {
  data: ServerRespond[],
  showGraph: boolean, // Added state to control graph visibility
}

/**
 * The parent element of the react app.
 * It renders title, button and Graph react element.
 */
class App extends Component<{}, IState> {
  intervalId: NodeJS.Timeout | null = null; // Added to keep track of interval

  constructor(props: {}) {
    super(props);

    this.state = {
      data: [],
      showGraph: false, // Initialize showGraph to false
    };
  }

  /**
   * Render Graph react component with state.data parse as property data
   */
  renderGraph() {
    if (this.state.showGraph) { // Conditionally render the graph
      return (<Graph data={this.state.data} />);
    }
    return null;
  }

  /**
   * Get new data from server and update the state with the new data
   */
  getDataFromServer() {
    if (this.intervalId) {
      clearInterval(this.intervalId); // Clear existing interval if any
    }
    this.intervalId = setInterval(() => {
      DataStreamer.getData((serverResponds: ServerRespond[]) => {
        // Update the state by creating a new array of data that consists of
        // Previous data in the state and the new data from server
        this.setState({ data: [...this.state.data, ...serverResponds] });
      });
    }, 100); // Request data every 100ms
  }

  /**
   * Render the App react component
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 2
        </header>
        <div className="App-content">
          <button className="btn btn-primary Stream-button"
            onClick={() => {
              this.setState({ showGraph: true }); // Show the graph when button is clicked
              this.getDataFromServer();
            }}>
            Start Streaming Data
          </button>
          <div className="Graph">
            {this.renderGraph()}
          </div>
        </div>
      </div>
    );
  }

  componentWillUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId); // Clear interval when component unmounts
    }
  }
}

export default App;
