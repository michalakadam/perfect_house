import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'youtubeEmbedUrl',
})
export class YoutubeEmbedUrlPipe implements PipeTransform {
  transform(value: string): string {
    const videoId = value.split('v=')[1];
    return `https://www.youtube.com/embed/${videoId}`;
  }
}
