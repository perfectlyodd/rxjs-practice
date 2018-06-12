import { Observer, from, Observable, never } from "rxjs";
import { flatMap } from "rxjs/operators";

let nums = [1, 2, 3];
//let source = Observable.from(nums);
// let source = Observable.create((observer) => {
//     nums.forEach((num) => observer.next(num));
//     observer.complete();
// });
let source = from(nums);

class ExampleObserver implements Observer<number> {
    next(val) {
        console.log(`Observed value: ${val}`);
    }

    error(e) {
        console.log(`Error encountered: ${e}`)
    }

    complete() {
        console.log("Observable is complete");
    }
}

export function module1Example(module1Status: Observable<boolean>) {
    module1Status.pipe(
        flatMap(status => (status ? source : never()))
    ).subscribe(new ExampleObserver());
}