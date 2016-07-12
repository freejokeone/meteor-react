import {Mongo} from 'meteor/mongo';

import {Meteor} from 'meteor/meteor';

import {check} from 'meteor/check';

export const Tasks=new Mongo.Collection('tasks');

Meteor.methods({
	'tasks.insert'(text){
		check(text,String);

		//make usre the user is logged in before inserting a task
		if(!this.userId){
			throw new Meteor.Error('not-anthorized');
		}
		Tasks.insert({
			text,
			craeteAt:new Date(),
			owner:this.userId,
			username:Meteor.users.findOne(this.userId).username,
		})
	},
	'tasks.remove'(taskId){
		check(taskId,String);
		Tasks.remove(taskId);
	},
	'tasks.setChecked'(taskId,setChecked){
		check(taskId,String);
		check(setChecked,Boolean);
		tasks.update(taskId,{$set:{check:setChecked}});
	},
});

if(Meteor.isServer){
	Meteor.publish('tasks',function tasksPublication(){
		return Tasks.find();
	})
}