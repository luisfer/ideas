import React, { Component } from 'react';
import './App.css';
import Ideas from './components/Ideas.js';
import axios from 'axios';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ideas: [
        {
          id: 1,
          title: 'Visit Nantes',
          body: 'Go to Jules Verne Museum, ride a bike and go to the planetarium and the cathedral',
          created_date: new Date()
        },
        {
          id: 2,
          title: 'Learn to play the tin whistle',
          body: 'Buy a songbook and find a tutor',
          created_date: new Date()
        },
        {
          id: 3,
          title: 'Read pending books',
          body: 'Wild sheep chase by Haruki Murakami, and Ubik by Philip K. Dick',
          created_date: new Date()
        }
      ],
      showNotification: false
    };
    this.addNewIdea = this.addNewIdea.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.sortIdeas = this.sortIdeas.bind(this);
    this.localStorageUpdate = this.localStorageUpdate.bind(this);
    this.showNotification = this.showNotification.bind(this);
  }

  componentDidMount(){

    // Setting up dropdown for 'sort by'
    // and checking if localStorage has the latest version of the ideas

    /*
    If there was a real REST API behind it, this method would be called
    this.getIdeas();

    */
    let dropdown = document.querySelector('.dropdown');
    dropdown.addEventListener('click', function(event) {
      dropdown.classList.toggle('is-active');
    });

    if (localStorage.getItem('ideas')){
      let localIdeas = JSON.parse(localStorage.getItem('ideas'));

      this.setState({ ideas: localIdeas});
    } else {
      this.localStorageUpdate();
    }
  }

  // These methods would be relevant if I had a real REST API

  getIdeas(){

    axios.get(`my-api/ideas`)
      .then(res => {
        const ideas = res.data;
        // this can be set here or later, in componentDidMount
        this.setState({ ideas: ideas });
      })
      .catch(error => { // error handling goes here
      })
  }

  updateIdea(idea){
    axios.post(`my-api/idea/update`, idea)
      .then(res => {
        // refreshes ideas
        this.getIdeas()
      })
      .catch(error => { // error handling goes here
      })
  }

  deleteIdea(id){
    axios.post(`my-api/idea/delete`, id)
      .then(res => {
        // refreshes ideas
        this.getIdeas()
      })
      .catch(error => { // error handling goes here
      })
  }

  getNewIdea(){
    axios.get(`my-api/idea/new`)
      .then(res => {
        let otherFields = {
          created_date: new Date(),
          title: '',
          body: ''
        }
        let newIdea = {...res.data, ...otherFields};
        let ideas = [...this.state.ideas, newIdea];
        this.setState({ ideas: ideas });
      })
      .catch(error => { // error handling goes here
      })
  }


  // setting localStorage variables with the current state of the ideas

  localStorageUpdate(){
    localStorage.setItem('ideas', JSON.stringify(this.state.ideas));
    let localIdeas = JSON.parse(localStorage.getItem('ideas'));
    this.setState({ ideas: localIdeas});
  }

  // onChange and onDelete event handlers, passed to component Ideas as props,
  // and then back to update state and localStorage

  onChange(input, idea, field){
    let ideas = [...this.state.ideas];
    let index = ideas.findIndex(obj => obj.id === idea.id);
    if (field == 'body'){
      ideas[index].body = input;
    } else if (field == 'title'){
      ideas[index].title = input;
    }
    this.showNotification();

    // If I had a REST API:
    // this.updateIdea(idea);

    this.setState({ideas: ideas}, () => {
      this.localStorageUpdate();
    });
  }

  onDelete(e, idea){
    let ideas = [...this.state.ideas];
    let index = ideas.findIndex(obj => obj.id === idea.id);
    ideas.splice(index, 1);

    // If I had a REST API:
    // this.deleteIdea(idea.id);

    this.setState({ideas: ideas}, () => {
      this.localStorageUpdate();
      this.showNotification();
    });
  };

  // adding new idea after clicking button

  addNewIdea(){
    let newIdea = {
      id: this.generateGuid(),
      created_date: new Date(),
      title: '',
      body: ''
    }
    let ideas = [...this.state.ideas, newIdea];
    this.setState({ ideas: ideas});

    // If I had a REST API:
    // this.getNewIdea(idea);
  }

  // Sorting ideas by date or by title, depending on dropdown selection

  sortIdeas(field){
    let ideas = [...this.state.ideas];

    if (field === 'title'){
      ideas.sort((a, b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0));
    } else if (field === 'date'){
      ideas.sort((a, b) => (a.created_date > b.created_date) ? 1 : ((b.created_date > a.created_date) ? -1 : 0));
    }
    this.setState({
      ideas: [...ideas]
    });
  }

  // show Notification of succesful edit handler

  showNotification(){
    this.setState({ showNotification: true}, () => {
      setTimeout(function() {
        this.setState({showNotification: false});
      }.bind(this),
      1500);
    });
  }

  // Auxiliar function to create ids for new ideas

  generateGuid(){
    let s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  render() {

    let notification = null;

    if (this.state.showNotification) {
      notification = <div className="button is-primary fade">Idea succesfully saved&nbsp;<i className="fas fa-check"></i></div>;
    }

    return (
      <div className="App">
        <nav className="level small-padding">
        <div className="title-text title level-left"><i className="far fa-lightbulb"></i>&nbsp;Ideas</div>
        <div className="level-right">
        {notification}
        <div className="dropdown small-padding">
          <div className="dropdown-trigger">
            <button className="button" aria-haspopup="true" aria-controls="dropdown-menu2">
              <span>Sort by</span>
              <span className="icon is-small">
                <i className="fas fa-angle-down" aria-hidden="true"></i>
              </span>
            </button>
          </div>
          <div className="dropdown-menu" id="dropdown-menu2" role="menu">
            <div className="dropdown-content">
              <div className="dropdown-item" onClick={() => this.sortIdeas('date')}>
                <p>Date</p>
              </div>
              <div className="dropdown-item" onClick={() => this.sortIdeas('title')}>
                <p>Title</p>
              </div>
            </div>
          </div>
        </div>
        <div className="button is-info" onClick={this.addNewIdea}>Add New Idea + </div>
        </div>
        </nav>
        <Ideas ideas={this.state.ideas} onChange={this.onChange} onDelete={this.onDelete} />
      </div>
    );
  }
}

export default App;
