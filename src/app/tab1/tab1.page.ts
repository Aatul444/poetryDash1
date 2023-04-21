import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { finalize } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { CommonModule } from '@angular/common';
import { AppModule } from '../app.module';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  AngularFireAuth,
  AngularFireAuthModule,
} from '@angular/fire/compat/auth';
import * as firebase from 'firebase/auth';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    ExploreContainerComponent,
    CommonModule,
    AppModule,
    HttpClientModule,
    AngularFireAuthModule,
  ],
})
export class Tab1Page {
  downloadURL: any;
  fb: any;
  imageuploaded = false;
  images: any[] = [];
  rotationAngle = 0;
  sliderImgs: string[] = [];

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private http: HttpClient,
    public afStore: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {
    this.fetchAllGalleryImages();
    this.fetchAllSliderImages();
  }
  async loginWithFacebook() {
    const provider = new firebase.FacebookAuthProvider();
    const result: any = await this.afAuth.signInWithPopup(provider);

    if (result.user) {
      console.log('User:', result.user);
      const accessToken = result.credential.accessToken;
      console.log('Access token:', accessToken);
      // Use the access token to access Facebook posts
    } else {
      console.log('Error:', result);
    }
  }
  fetchAllSliderImages() {
    const storageRef = this.storage.storage.ref().child('slider');
    storageRef
      .listAll()
      .then((res: any) => {
        const promises = res.items.map((item: any) => item.getDownloadURL());
        Promise.all(promises)
          .then((downloadURLs: string[]) => {
            console.log(downloadURLs);
            this.sliderImgs = downloadURLs;
          })
          .catch((error: any) => {
            console.error(error);
          });
      })
      .catch((error: any) => console.log(error));
  }

  fetchAllGalleryImages() {
    const storageRef = this.storage.storage.ref().child('gallery');
    storageRef
      .listAll()
      .then((res: any) => {
        const promises = res.items.map((item: any) => item.getDownloadURL());
        Promise.all(promises)
          .then((downloadURLs: string[]) => {
            console.log(downloadURLs);
            this.images = downloadURLs;
          })
          .catch((error: any) => {
            console.error(error);
          });
      })
      .catch((error: any) => console.log(error));
  }

  rotateImage() {
    this.rotationAngle += 90;
  }

  onFileSelected(event: any) {
    var n = Date.now();
    const file = event.target.files[0];
    const filePath = `gallery/${n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`gallery/${n}`, file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe((url: any) => {
            if (url) {
              this.fb = url;
              this.imageuploaded = true;
            }
            console.log(this.fb);
          });
        })
      )
      .subscribe((url: any) => {
        if (url) {
          console.log(url);
        }
      });
    this.getPostsNews();
  }
  onSlideSelected(event: any) {
    var n = Date.now();
    const file = event.target.files[0];
    const filePath = `slider/${n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`slider/${n}`, file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe((url: any) => {
            if (url) {
              this.fb = url;
              this.imageuploaded = true;
            }
            console.log(this.fb);
          });
        })
      )
      .subscribe((url: any) => {
        if (url) {
          console.log(url);
        }
      });
    this.getPostsNews();
  }
  getPostsNews() {
    this.db
      .collection('posts')
      .get()
      .subscribe((posts) => {
        posts.docs.forEach((post) => {
          console.log(post.data());
        });
      });
  }

  refresh() {
    this.images = [];
    this.fetchAllGalleryImages();
    this.fetchAllSliderImages();
  }

  youtubeVideosData() {
    const apiKey = 'AIzaSyAyhP7cM8J8QkxSl3geGaaHMZjQsC1yGfE';
    const channelId = 'UCMgty2VEtNUtgDemXw4WVIQ';
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=10`;
    return this.http.get(apiUrl);
  }

  async getYoutubeVideos() {
    await this.youtubeVideosData().subscribe((res: any) => {
      console.log(res.items);
      this.afStore
        .collection('website')
        .doc('pichhili_Bahar_Youtube')
        .update({ response: res.items })
        .then(() => {
          console.log('Document updated successfully.');
        })
        .catch((error) => {
          console.log('Error updating document: ', error);
        });
    });
  }
}
