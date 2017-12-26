import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import 'hammerjs';
import { GameComponent } from './app/game/game.component'
import { Events } from './app/services/event/event.service';
import { Ezgui } from './app/pixi/ezgui';
import { EditSprites } from './app/gui/edit-sprites';
import { SpritesComponent } from './app/game/sprites.component';
import { BehaviorComponent } from './app/components/behavior/behavior.component';
import { FirebaseService } from './app/services/firebase/firebase.service';
if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
