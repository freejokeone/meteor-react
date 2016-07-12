import React, { Component,PropTypes} from 'react';

import ReactDOM from 'react-dom';

import {Meteor} from 'meteor/meteor';

import {createContainer} from 'meteor/react-meteor-data';

import {Tasks} from '../api/tasks.js';

import Task from './Task.jsx';

import AccountsUIWrapper from './AccountsUIWrapper.jsx';

// App component - represents the whole app
class App extends Component {
  constructor(props){
    super(props);
    this.state={
      hideCompleted:false,
    };
  };

  toggleHideComplated(){
    this.setState({
      hideCompleted:!this.state.hideCompleted,
    });
  };

  handleSubmit(event){
    event.preventDefault();

    //find the text field via React ref
    const text=ReactDOM.findDOMNode(this.refs.textInput).value.trim();
    Meteor.call('tasks.insert',text);
    //clear from
    ReactDOM.findDOMNode(this.refs.textInput).value='';
  };

  getTasks() {
    return [
      { _id: 1, text: 'This is task 1' },
      { _id: 2, text: 'This is task 2' },
      { _id: 3, text: 'This is task 3' },
    ];
  };

  renderTasks() {
   let fillteredTasks=this.props.tasks;
   if(this.state.hideCompleted){
    fillteredTasks=fillteredTasks.filter(task=>!task.checked);
   }
   return fillteredTasks.map((task)=>{
    const currentUserId=this.props.currentUser&&this.props.currentUser._id;
    const showPrivateButton=task.owner===currentUserId;
    return (
       <Task key={task._id} task={task} showPrivateButton={showPrivateButton}/>
      );
   });
  };

  render() {
    return (
      <div className="container">
        <header>
          <h1>Todo List</h1>
          ({this.props.incompleteCount})
          <label className='hide-completed'>
            <input type='checkbox' readOnly checked={this.state.hideCompleted} 
            onClick={this.toggleHideComplated.bind(this)}/>
            Hide Completed Tasks
          </label>
          <AccountsUIWrapper/>
          {this.props.currentUser?
            <form className='new-task' onSubmit={this.handleSubmit.bind(this)}>
            <input type='text' ref='textInput' placeholder='Type to add tasks'/>
            </form>:''
          }
        </header>
        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    );
  };
}

App.propTypes={
  tasks:PropTypes.array.isRequired,
  showPrivateButton:React.PropTypes.bool.isRequired,
};

export default createContainer(()=>{
  Meteor.subscribe('tasks');
  return {
    tasks:Tasks.find({},{sort:{createAt:-1}}).fetch(),
    incompleteCount:Tasks.find({checked:{$ne:true}}).count(),
    currentUser:Meteor.user(),
  };
},App);

