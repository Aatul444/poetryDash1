import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { finalize } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { CommonModule } from '@angular/common';
import { AppModule } from '../app.module';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
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
    FormsModule,
  ],
})
export class Tab1Page {
  downloadURL: any;
  fb: any;
  imageuploaded = false;
  images: any[] = [];
  rotationAngle = 0;
  sliderImgs: string[] = [];
  instasPosts: any;
  facebookKey: string = '';
  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private http: HttpClient,
    public afStore: AngularFirestore
  ) {
    this.fetchAllGalleryImages();
    this.fetchAllSliderImages();
  }
  getFBposts(key: any) {
    const fbKey = key.toString();
    if (fbKey != '') {
      this.http
        .get(
          'https://graph.facebook.com/v16.0/110662868634128?fields=created_time%2Cdescription%2Cid%2Cname%2Cphotos%7Blink%2Cname_tags%2Cimages%2Calt_text%2Calt_text_custom%2Cbackdated_time%2Cbackdated_time_granularity%2Ccreated_time%2Cfrom%2Cheight%2Cicon%2Cid%2Cname%2Cpage_story_id%2Cplace%2Ctarget%2Cupdated_time%2Cwebp_images%2Cwidth%2Ccomments%2Cpicture%2Clikes%7Busername%2Cpicture%2Cname%2Cid%2Cpic%2Cpic_square%7D%7D&access_token=' +
            fbKey
        )
        .subscribe((fbPost: any) => {
          console.log(fbPost.photos.data);
          this.instasPosts = fbPost.photos.data;
          this.afStore
            .collection('website')
            .doc('pichhili_Bahar_Facebook')
            .update({ response: fbPost.photos.data })
            .then(() => {
              console.log(this.instasPosts, 'Document updated successfully.');
            })
            .catch((error) => {
              console.log('Error updating document: ', error);
            });
        });
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

  // facebookData() {
  //   const apiKey = 'AIzaSyAyhP7cM8J8QkxSl3geGaaHMZjQsC1yGfE';
  //   const channelId = 'UCMgty2VEtNUtgDemXw4WVIQ';
  //   const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=10`;
  //   return this.http.get(apiUrl);
  // }

  // async facebookDatas() {
  //   await this.facebookData().subscribe((res: any) => {
  //     console.log(res.items);
  //     this.afStore
  //       .collection('website')
  //       .doc('pichhili_Bahar_Youtube')
  //       .update({ response: res.items })
  //       .then(() => {
  //         console.log('Document updated successfully.');
  //       })
  //       .catch((error) => {
  //         console.log('Error updating document: ', error);
  //       });
  //   });
  // }
}
