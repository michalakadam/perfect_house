const YOUTUBE_WATCH_HOSTS = [
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
];
const YOUTUBE_SHORT_HOSTS = ['youtu.be', 'www.youtu.be'];
const YOUTUBE_ID_PATTERN = /^[\w-]{11}$/;
const YOUTUBE_PATH_PREFIXES = ['/embed/', '/v/', '/shorts/', '/live/'];

export const YOUTUBE_EMBED_ORIGIN = 'https://www.youtube-nocookie.com';

// The links come from the Galactica Virgo feed and their shape is not
// controlled here, so every known YouTube URL form has to be accepted and
// anything else has to be rejected rather than guessed at.
export function extractYoutubeVideoId(link: string | null): string | null {
  if (!link) {
    return null;
  }

  let url: URL;
  try {
    url = new URL(link.trim());
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    return null;
  }

  const hostname = url.hostname.toLowerCase();

  if (YOUTUBE_SHORT_HOSTS.includes(hostname)) {
    return validateId(url.pathname.slice(1).split('/')[0]);
  }
  if (!YOUTUBE_WATCH_HOSTS.includes(hostname)) {
    return null;
  }

  const watchId = url.searchParams.get('v');
  if (watchId) {
    return validateId(watchId);
  }

  const prefix = YOUTUBE_PATH_PREFIXES.find((candidate) =>
    url.pathname.startsWith(candidate),
  );
  if (prefix) {
    return validateId(url.pathname.slice(prefix.length).split('/')[0]);
  }
  return null;
}

// youtube-nocookie.com does not write tracking storage on load, but it still
// contacts Google, so the caller must keep this frame behind a click.
export function buildYoutubeEmbedUrl(link: string | null): string | null {
  const videoId = extractYoutubeVideoId(link);

  return videoId
    ? `${YOUTUBE_EMBED_ORIGIN}/embed/${videoId}?autoplay=1&rel=0`
    : null;
}

function validateId(candidate: string | undefined): string | null {
  return candidate && YOUTUBE_ID_PATTERN.test(candidate) ? candidate : null;
}
