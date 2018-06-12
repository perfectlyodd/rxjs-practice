import { fromEvent, Subscription, Observable, never, NEVER } from "rxjs";
import { map, filter, delay, flatMap } from "rxjs/operators";
import * as $ from 'jquery';

var mouseSource = fromEvent(document, "mousemove")
    .pipe(
        map((e: MouseEvent) => {
            return {
                x: e.clientX,
                y: e.clientY
            }
        }),
        filter(val => val.x < 500),
        delay(300)
    );


export function logMouseMovements(status: Observable<boolean>) {
    status.pipe(
            flatMap(status => (status ? mouseSource : never()))
        ).subscribe(
            val => console.log(val),
            e => console.log(e),
            () => console.log("I think we're done here")
        );
}

export function moveCircle(status: Observable<boolean>) {
    status.pipe(
            flatMap(status => {
                if (status) {
                    addCircle();
                    return mouseSource;
                } else {
                    cleanupMouseDemos();
                }
                return never();
            })
        ).subscribe(
            circleResponse,
            e => console.log("Circle demo shat the bed"),
            () => console.log("Circle demo's done")
        );
}

function addCircle() {
    $('<div id="circle"></div>').appendTo('body');
}

function circleResponse(val) {
    $('#circle').css({
        "left": val.x + "px",
        "top": val.y + "px"
    });
}

function cleanupMouseDemos() {
    $('#circle').remove();
}

// Non-JQuery way of setting styles:
    // circle.style.left = val.x;
    // circle.style.top = val.y;
