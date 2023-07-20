export const convertDurationToSeconds = (duration: string) => {
  const durationArray = duration.split('');
  let seconds = 0;

  durationArray.forEach((char, index) => {
    if (char === 'h') {
      seconds += parseInt(durationArray[index - 1]) * 3600;
    } else if (char === 'm') {
      seconds += parseInt(durationArray[index - 1]) * 60;
    } else if (char === 's') {
      seconds += parseInt(durationArray[index - 1]);
    }
  });

  return seconds;
}

export const extractVideoId = (url: string) => {
  const vodUrlRegex = /https:\/\/www\.twitch\.tv\/videos\/(\d{10})/
  const vodIdregex = /(\d{10})/

  if (vodUrlRegex.test(url)) {
    return url.match(vodUrlRegex)![1]
  }
  if (vodIdregex.test(url)) {
    return url.match(vodIdregex)![1]
  }
  return null
};