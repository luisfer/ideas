import React, { Component } from 'react';
import '../App.css';


class Ideas extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ideaHovered: null,
      maxChars: 140,
      charsLeft: 140,
      colors: [
        '#FEF2EE',
        '#FFF9EC',
        '#ECF8FD',
        '#F5F9EC',
        '#E5E8E9',
        '#D7E4EA',
        '#CBE1EB'
      ]
    };
    this.lastInput = React.createRef();
    this.onIdeaHover = this.onIdeaHover.bind(this);
    this.onIdeaHoverOut = this.onIdeaHoverOut.bind(this);
  }

  // To make the added new idea input have focus
  componentDidUpdate(prevProps, prevState){
    if (this.props.ideas.length === prevProps.ideas + 1){
      this.lastInput.focus();
    }
  }

  // so every new idea box has a different color

  getColor(i){
    let j = i % 7;
    return this.state.colors[j];
  }

  // Sets logic to determine the hovered idea, when mouse enters and leaves,
  // and restarts remaining chars when switching ideas

  onIdeaHover(idea){
    if (this.state.ideaHovered !== idea.id){
      this.setState({ideaHovered: idea.id});
    }
  }

  onIdeaHoverOut(idea){
    if (this.state.ideaHovered === idea.id){
      this.setState({ideaHovered: null, charsLeft: this.state.maxChars});
    }
  }

  // Implements the onChange event for the title and body and sends it to props
  // also updates the remaining characters counter

  onIdeaChange(event, idea, field) {
    this.props.onChange(event.target.value, idea, field);
    this.setState({
      charsLeft: this.state.maxChars - event.target.value.length
    });
  }

  // Implements the onBlur event for the title and body and sends it to props
  // also updates the remaining characters counter

  onBlur(event, idea, field){
    this.props.onChange(event.target.value, idea, field);
  }

 render(){

   return (
     <div className="columns small-padding is-variable is-multiline">
      {this.props.ideas.map((idea, i) =>
        <div className="column is-3 box custom-box" style={{ backgroundColor: this.getColor(i)}} key={i} onMouseEnter={() => this.onIdeaHover(idea)} onMouseLeave={() => this.onIdeaHoverOut(idea)}>
          <div className="custom-level columns">
          <div className="column is-11">
          <input placeholder="New Great Idea" autoFocus ref={(input) => { this.lastInput = input; }} style={{ width: '100%', backgroundColor: this.getColor(i)}} onBlur={e => this.onBlur(e, idea, 'title')} onChange={e => this.onIdeaChange(e, idea, 'title')} className="title is-5" type="text" value={idea.title} />
          </div>
          {this.state.ideaHovered === idea.id &&
            <div onClick={(e) => this.props.onDelete(e, idea)} className="column is-1">
            <i className="fa fa-trash" aria-hidden="true"></i>
            </div>
          }
          </div>
          <textarea placeholder="New Content for my Idea" style={{ backgroundColor: this.getColor(i)}} onBlur={e => this.onBlur(e, idea, 'body')} rows="3" type="text" className="is-size-6" maxLength="140" onChange={e => this.onIdeaChange(e, idea, 'body')} value={idea.body} />
          {this.state.ideaHovered === idea.id && this.state.charsLeft < 16 && <div className="is-pulled-right">Remaining characters: {this.state.charsLeft}</div>}
        </div>
      )}
      </div>
    )
  }
}

export default Ideas
