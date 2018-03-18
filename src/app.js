
import css from './app.css';
import scss from './app.scss';


import $ from 'jquery';
import './jquery.changeStyle';



import React from 'react';
import ReactDOM from 'react-dom';
import Root from './Root';

ReactDOM.render(
  <Root></Root>,
  document.getElementById('root')
);




$("#hello").text('change to other text');
$("#hello").changeStyle('pink');

console.log('hello,webpack123')
console.log(__dirname)