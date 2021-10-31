import { Component, ChangeDetectionStrategy } from '@angular/core';

const PHOTO_URL_PREFIX = '/assets/newsfeed/';
const convertPhotoNameToUrl = (name: string): string => PHOTO_URL_PREFIX + name;

const SEA_PHOTO_NAMES = [
  'morze_1.jpg',
  'morze_2.jpg',
  'morze_3.jpg',
  'morze_4.jpg',
  'morze_5.jpg',
  'morze_6.jpg',
];
const BOWLING_PHOTO_NAMES = [
  'bowling_1.jpg',
  'bowling_2.jpg',
  'bowling_3.jpg',
  'bowling_4.jpg',
];
const SHROOMS_PHOTO_NAMES = [
  'grzybobranie_1.jpg',
  'grzybobranie_2.jpg',
  'grzybobranie_3.jpg',
  'grzybobranie_4.jpg',
  'grzybobranie_5.jpg',
  'grzybobranie_6.jpg',
  'grzybobranie_7.jpg',
  'grzybobranie_8.jpg',
  'grzybobranie_9.jpg',
  'grzybobranie_10.jpg',
  'grzybobranie_11.jpg',
];
const PODCHODY_PHOTO_NAMES = [
  'podchody_1.jpg',
  'podchody_2.jpg',
  'podchody_3.jpg',
  'podchody_4.jpg',
  'podchody_5.jpg',
  'podchody_6.jpg',
];
const SHROOMS_2021_PHOTO_NAMES = [
  'grzybobranie_2021_1.jpg',
  'grzybobranie_2021_2.jpg',
  'grzybobranie_2021_3.jpg',
  'grzybobranie_2021_4.jpg',
  'grzybobranie_2021_5.jpg',
  'grzybobranie_2021_6.jpg',
  'grzybobranie_2021_7.jpg',
  'grzybobranie_2021_8.jpg',
];

@Component({
  selector: 'perfect-news-feed',
  templateUrl: './news-feed.component.html',
  styleUrls: ['./news-feed.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsFeedComponent {
  seaPhotoUrls = SEA_PHOTO_NAMES.map(convertPhotoNameToUrl);
  bowlingPhotoUrls = BOWLING_PHOTO_NAMES.map(convertPhotoNameToUrl);
  shroomsPhotoUrls = SHROOMS_PHOTO_NAMES.map(convertPhotoNameToUrl);
  podchodyPhotoUrls = PODCHODY_PHOTO_NAMES.map(convertPhotoNameToUrl);
  shrooms2021PhotoUrls = SHROOMS_2021_PHOTO_NAMES.map(convertPhotoNameToUrl);
}
