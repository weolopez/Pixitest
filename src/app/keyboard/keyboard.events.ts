import { Events } from '../services/event/event.service';


export class KeyboardEvents {
    constructor(events: Events) {
        document.addEventListener('keydown', (event) => events.publish('keydown ' + event.key) );
        document.addEventListener('keyup', (event) => events.publish('keyup ' + event.key) );
    }
}
