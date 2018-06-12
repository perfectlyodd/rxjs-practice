import { Observable, of, from, throwError, onErrorResumeNext } from 'rxjs';
import * as $ from 'jquery';
import { merge, catchError } from 'rxjs/operators';

let simpleSource = Observable.create(obs => {
    obs.next(1);
    obs.next(2);
    obs.error("Error!");
    obs.next(3);
    obs.complete();
});

let mergedSource = of(1).pipe(
    merge(
        from([2, 3, 4]),
        throwError(new Error("Error message!")),
        of(5)
    ),
);

let errorBypassingSource = onErrorResumeNext(
    of(1),
    from([2, 3, 4]),
    throwError(new Error("This message shouldn't appear in console")),
    of(5)
);

let errorCatchingSource = of(1).pipe(
    merge(
        from([2, 3, 4]),
        throwError(new Error("Error message!")),
        of(5)
    ),
    catchError(err => {
        console.log(`Caught: ${err}`);
        return of(101);
    })
)

export function errorExamples() {
    simpleSource.subscribe(
        val => console.log(`value: ${val}`),
        err => console.log(`error: ${err}`),
        () => console.log("Complete")
    );
    
    mergedSource.subscribe(
        val => console.log(`value: ${val}`),
        err => console.log(`error: ${err}`),
        () => console.log("Complete")
    );

    errorBypassingSource.subscribe(
        val => console.log(`value: ${val}`),
        err => console.log(`error: ${err}`),
        () => console.log("Complete")
    );

    errorCatchingSource.subscribe(
        val => console.log(`value: ${val}`),
        err => console.log(`error: ${err}`),
        () => console.log("Complete")
    );
}