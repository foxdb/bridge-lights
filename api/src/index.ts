const unescape = require('unescape-js');
import axios from 'axios';
import { extractCalendarData } from './extractCalendarData';

const fetchCalendarBody = async (
  calendarName: string,
  searchString: string
) => {
  const res = await axios.get<string>(
    `https://www.trumba.com/s.aspx?search=${searchString}&calendar=${calendarName}`
  );

  const cleanString = res.data
    .split('<body>')[1]
    .split('</body>')[0]
    .replace(/<script.*?<\/script>/g, '');

  return unescape(cleanString);
};

const getAndParseCalendar = async () => {
  const body = await fetchCalendarBody('light-up-brisbane', 'story');
  return extractCalendarData(body);
};
export function bridgeLights(req: { method: string }, res: any) {
  getAndParseCalendar().then((calendarData) => {
    // CORS stuff
    res.set('Access-Control-Allow-Origin', '*');

    if (req.method === 'OPTIONS') {
      // Send response to OPTIONS requests
      res.set('Access-Control-Allow-Methods', 'GET');
      res.set('Access-Control-Allow-Headers', 'Content-Type');
      res.set('Access-Control-Max-Age', '3600');
      res.status(204).send('');
    } else {
      res.send({ events: calendarData });
    }
  });
}
