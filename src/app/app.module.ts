import { PixiService } from './services/pixi/pixi.service';
import { Events } from './services/event/event.service';
import { FirebaseService } from './services/firebase/firebase.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { FormsModule } from '@angular/forms';
import { environment } from './../environments/environment';
import { SpritesComponent } from './components/sprites/sprites.component';
import { BehaviorComponent } from './components/behavior/behavior.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTabsModule} from '@angular/material/tabs';
import {MatGridListModule} from '@angular/material/grid-list';
import { GuiComponent } from './components/gui/gui.component';
import { WindowComponent } from './components/gui/window/window.component';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    SpritesComponent,
    BehaviorComponent,
    GuiComponent,
    WindowComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatGridListModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule
  ],
  providers: [Events, FirebaseService, PixiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
