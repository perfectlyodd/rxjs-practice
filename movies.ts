import { fromEvent, Observable, defer, from, never, empty } from "rxjs";
import { retryWhen, scan, takeWhile, delay, flatMap, take, map } from "rxjs/operators";
import * as $ from 'jquery';

import { loadMovies, loadMoviesWithFetch } from "./loader";



function addMoviesElements() {
    console.log("Rendering movie elements");
    let movieButtonHTML = "<button id='movieButton'>Get Movies</button>";
    let outputDivHTML = "<div id='output'></div>";
    let cancelButtonHTML = "<button id='cancelButton'>Cancel network request</div>";
    $('body').append(movieButtonHTML).append(cancelButtonHTML).append(outputDivHTML);
}

function removeMoviesElements() {
    console.log("Removing movie elements");
    $('#movieButton').remove();
    $('#output').remove();
    $('#cancelButton').remove();
}

export function displayMovies(url: string, status: Observable<boolean>) {

    status.pipe(
        map(status => {
            if (status) {
                addMoviesElements();
                return fromEvent($('#movieButton'), "click")
                    .pipe(
                        map(click => loadMovies(url)),
                    );
                
            } else {
                removeMoviesElements();
            }
            return never();
        })
    ).subscribe(
        (statusObservable) => {
            statusObservable.subscribe(
                clickObservable => {
                    let clickSubscription = clickObservable.subscribe(
                        renderMovies,
                        err => console.log(`Error while fetching / rendering movies: ${err}`),
                        () => console.log("Data fetching and rendering is complete")
                    );
                    fromEvent($('#cancelButton'), "click")
                        .pipe(
                            take(1)
                        ).subscribe(
                            (cancelClick) => {
                                clickSubscription.unsubscribe();
                                console.log("Network request canceled");
                            },
                            err => console.log("Some kind of button-clicky error occurred"),
                            () => console.log("Cancel button observable completed")
                    );
                },
                err => console.log("Error while observing 'get movies' button"),
                () => console.log("'Get movies' button observable complete")
            );
        },
        err => console.log(`Error while observing status observable`),
        () => console.log("Status observable is complete")
    );

    function renderMovies(movies) {
        movies.forEach(m => {
            $("#output").append(
                '<div>' + m.title + '</div>'
            );
        });
    }
}


// Non-JQuery element selection:

                //Non-JQuery way:

                // let outputDiv = document.getElementById("output");
                // let movieButton = document.getElementById("movieButton");

// Non-JQuery element rendering:

                //Non-JQuery:
                // movies.forEach(m => {
                //     let div = document.createElement("div");
                //     div.innerText = m.title;
                //     outputDiv.appendChild(div);
                // });

// Code for loadMovies without JQuery:

                // Without JQuery:

                // let xhr = new XMLHttpRequest();
                
                // xhr.addEventListener("load", () => {
                //     if (xhr.status === 200) {
                //         let data = JSON.parse(xhr.responseText);
                //         obs.next(data);
                //         obs.complete();
                //     } else {
                //         obs.error(xhr.statusText);
                //     }
                // });
            
                // xhr.open("GET", url);
                // xhr.send();

// First version of loadMovies:

                //Pre-refactoring of "load" method
                // buttonClick.subscribe(
                //     event => loadMovies("movies.json"),
                //     error => console.log(error),
                //     () => console.log("We're done here")
                // );
                
// Version of displayMovies using flatMap rather than Map.  This resulted in a subtle issue:  The completion
// handler was never called.  Instead of this, the above implementation uses Map to produce an Observable of Observables;
// the inner Observables' completion handlers will be called when data is returned, resulting in a useful console message.

                // status.pipe(
                //     flatMap(status => {
                //         if (status) {
                //             addMoviesElements();
                //             return fromEvent($('#movieButton'), "click")
                //                     .pipe(
                //                         take(1),
                //                         flatMap(event => loadMoviesWithFetch(url))
                //                     );
                //         } else {
                //             removeMoviesElements();
                //         }
                //         return never();
                //     })
                // ).subscribe(
                //     renderMovies,
                //     err => console.log(`Error while fetching / rendering movies: ${err}`),
                //     () => console.log("Data fetching and rendering is complete")
                // );

// Old code:
                // buttonClick.pipe(
                //     flatMap(event => loadMoviesWithFetch(url))
                // ).subscribe(
                //     renderMovies,
                //     err => console.log(`Error while fetching / rendering movies: ${err}`),
                //     () => console.log("Data fetching and rendering is complete")
                // );