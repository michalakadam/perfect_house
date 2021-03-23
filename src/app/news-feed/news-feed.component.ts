import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

const PHOTO_URL_PREFIX = '/assets/newsfeed/';
const convertPhotoNameToUrl = (name: string): string => PHOTO_URL_PREFIX + name;

const SEA_PHOTO_NAMES = ['morze_1.jpg', 'morze_2.jpg', 'morze_3.jpg', 'morze_4.jpg', 'morze_5.jpg', 'morze_6.jpg'];
const BOWLING_PHOTO_NAMES = ['bowling_1.jpg', 'bowling_2.jpg', 'bowling_3.jpg', 'bowling_4.jpg'];

@Component({
  selector: 'perfect-news-feed',
  templateUrl: './news-feed.component.html',
  styleUrls: ['./news-feed.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewsFeedComponent {
  seaPhotoUrls = SEA_PHOTO_NAMES.map(convertPhotoNameToUrl);
  bowlingPhotoUrls = BOWLING_PHOTO_NAMES.map(convertPhotoNameToUrl);
}
