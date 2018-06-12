import { Observable, Observer, fromEvent, from, fromEventPattern, defer } from 'rxjs';
import { map, filter, delay, flatMap, retryWhen, scan, takeWhile } from 'rxjs/operators';
import * as $ from 'jquery';

import { module1Example } from './module1';
import { logMouseMovements, moveCircle } from './mouse-movement';
import { displayMovies } from './movies';
import { errorExamples } from './error-handling-demo';


const moviesUrl: string = './movies.json';

var module1DemoButtonHTML = "<button id='module1Button'>Module 1 demos</button>";
var mouseMovementDemoButtonHTML = "<button id='mouseMovementDemoButton'>Mouse movement demos</button>";
var moviesDemoButtonHTML = "<button id='moviesDemoButton'>Movies demo</button>";
$('body').append(module1DemoButtonHTML).append(mouseMovementDemoButtonHTML).append(moviesDemoButtonHTML);

var module1Status = fromEvent($('#module1Button'), 'click')
    .pipe(
        map((event, index) => (index % 2) === 0)      
    );

var mouseMovementStatus = fromEvent($('#mouseMovementDemoButton'), 'click')
    .pipe(
        map((event, index) => (index % 2) === 1)
    );

var moviesStatus = fromEvent($('#moviesDemoButton'), 'click')
    .pipe(
        map((event, index) => (index % 2) === 0)
    );

module1Example(module1Status);
moveCircle(mouseMovementStatus);
displayMovies(moviesUrl + "bwahhaha", moviesStatus);
errorExamples();

