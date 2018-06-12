import { Observable, defer, from } from "rxjs";
import { delay, takeWhile, scan, retryWhen } from "rxjs/operators";
import * as $ from 'jquery';

export function loadMovies(moviesUrl: string) {
    return Observable.create(
        obs => {                
            let xhr = $.ajax({
                url: moviesUrl,
                dataType: 'json',
                success: (data, status, xhr) => {
                    obs.next(data);
                    obs.complete();
                },
                error: (xhr, status, error) => {
                    obs.error(status);
                },      
                type: 'get'
            });
            return () => {
                xhr.abort();
            }
        }
    ).pipe(
        retryWhen(retryStrategy({attempts: 3, delayTime: 1500}))
    );
}

export function loadMoviesWithFetch(moviesUrl: string) {
    return defer(() => from(
        fetch(moviesUrl).then(
            response => {
                if (response.status === 200) {
                    return response.json()                          // This will return a promise that successfully
                                                                    // resolves to the deserialized JSON
                } else {
                    return Promise.reject(response);                // This will return a rejected promise containing
                                                                    // the response object for inspection
                }
            }
        ))
    ).pipe(
        retryWhen(retryStrategy())
    );
}

function retryStrategy({attempts = 4, delayTime = 1000} = {}) {
    return function(errors) {
        return errors.pipe(
            scan((acc, val) => {
                    if (acc++ < attempts) {
                        return acc;
                    } else {
                        throw new Error("" + val);
                    }
                }, 0),
            delay(delayTime)
        );
    }
}