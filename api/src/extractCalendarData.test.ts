const fs = require('fs');
const path = require('path');
import { extractCalendarData } from './extractCalendarData';

const file = path.join(__dirname, '../test-data', 'exampleCalendarData');
const sampleCalendarData = fs.readFileSync(
  file,
  'utf8',
  function (err: any, data: any) {
    return data;
  }
);
describe('extractCalendarData', () => {
  test('returns properly formatted calendar data', () => {
    const parsedData = extractCalendarData(sampleCalendarData);

    expect(parsedData.length).toEqual(10);

    expect(parsedData[0]).toEqual({
      date: 'Monday, 6 June',
      eventDescription: [
        'The Story Bridge will be lit Maroon to celebrate Queensland Day',
        'This Queensland Day, Monday 6 June 2022, marks 163 years since Queensland separated from New South Wales to become an independent colony on 6 June 1859.',
        'Commemorated annually, Queensland Day is an important celebration of our state’s culture and heritage and an opportunity to reflect on what Queensland means to you. It is an opportunity for businesses, community groups, organisations, schools, sporting teams and families to come together and share their state pride',
        'This Light Up is organised by: Queensland Government',
      ],
      eventTitle: 'Queensland Day',
      location: 'Story Bridge, Kangaroo Point',
    });
  });
});
