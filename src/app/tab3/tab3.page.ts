import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { CommonModule } from '@angular/common';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AppModule } from '../app.module';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonicModule, ExploreContainerComponent, CommonModule, AppModule],
})
export class Tab3Page {
  queries: any[] = [];
  constructor(public afStore: AngularFirestore) {
    this.getQueries();
  }
  getQueries() {
    this.afStore
      .collection('regForm')
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
