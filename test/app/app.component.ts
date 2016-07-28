import {Component, ViewChild, ViewContainerRef, ComponentResolver} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import { NG2_MAP_DIRECTIVES, Ng2MapComponent } from "ng2-map";

@Component({
  selector: 'my-app',
  directives: [ NG2_MAP_DIRECTIVES ],
  templateUrl: 'app/app.tpl.html'
})
export class AppComponent {
  public center ="Brampton, Canada";
  public positions=[];
  @ViewChild('mapComponents', {read: ViewContainerRef}) mapComponents;

  constructor(
    private compResolver:ComponentResolver
  ) {
    Ng2MapComponent.apiUrl = "https://maps.google.com/maps/api/js?key=AIzaSyCbMGRUwcqKjlYX4h4-P6t-xcDryRYLmCM";
  }

  ngAfterViewInit(){
    let componentId = window.location.hash ? window.location.hash.replace(/#/,'') : 'simple-marker';
    this.load(componentId);
  }

  // load a component remotely
  load(componentId) {
    let url: string  = `app/${componentId}.component.ts`;

    try {
      this.mapComponents.remove(0);
    } catch(e) {}

    let importer = url => Observable.fromPromise(System.import(url));
    let resolve = comp => Observable.fromPromise(this.compResolver.resolveComponent(comp));

    importer(url)
      .switchMap(comp => {
        return resolve(comp.TestComponent)
      })
      .subscribe(factory => {
        this.mapComponents.createComponent(factory, 0);
        window.location.hash = componentId;
      })
  }

}