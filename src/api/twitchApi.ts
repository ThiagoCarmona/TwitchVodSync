import axios from 'axios';

const twitchApi = axios.create({
  baseURL: 'https://gql.twitch.tv/gql',
  headers: {
    'Client-Id': 'kimne78kx3ncx6brgo4mv6wki5h1ko',
  },
});

export const getVideoInfo = async (videoId: string) => {
  const query = `
      query($videoID: ID) {
        video(id: $videoID) {
          id\n
          creator {displayName}\n
          recordedAt\n
          duration\n
        }
      }
  `;

  const variables = {
    videoID: videoId,
  }

  const response = await twitchApi.post('', { query, variables });

  return response.data.data.video;
}