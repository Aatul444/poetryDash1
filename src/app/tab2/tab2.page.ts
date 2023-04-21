import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { CommonModule } from '@angular/common';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AppModule } from '../app.module';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, ExploreContainerComponent, CommonModule, AppModule],
})
export class Tab2Page {
  queries: any[] = [];
  constructor(public afStore: AngularFirestore) {
    this.getQueries();
  }

  getQueries() {
    this.afStore
      .collection('queries')
      .get()
      .subscribe((res) => {
        const queryary: any[] = [];
        res.forEach((r: any) => {
          const rData = {
            id: r.id,
            data: r.data(),
          };
          queryary.push(rData);
        });
        this.queries = queryary;
      });
  }
}
