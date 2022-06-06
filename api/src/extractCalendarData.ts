import * as cheerio from 'cheerio';

interface ItemHeader {
  date: string;
  location: string;
}

interface ItemDescription {
  eventDescription: string;
  eventDescription2?: string;
  eventDescription3?: string;
  eventDescription4?: string;
  eventDescription5?: string;
}

interface ItemTitle {
  eventTitle: string;
}

interface ParsedCalendarItem {
  date: string;
  location: string;
  eventTitle: string;
  eventDescription: string[];
}

export const extractCalendarData = (
  unescapedCalendarBody: string
): ParsedCalendarItem[] => {
  const $ = cheerio.load(unescapedCalendarBody);

  // parse headers (dates + locations)
  const itemHeaders: ItemHeader[] = $('.twRyoPhotoEventsItemHeader')
    .map((idx, element) => {
      return {
        date: $(element).find('.twRyoPhotoEventsItemHeaderDate').text(),
        location: $(element).find('.twLocation').text(),
      };
    })
    .get();

  const itemTitles: ItemTitle[] = $('.twRyoPhotoEventsCalDesc')
    .map((idx, element) => {
      return {
        eventTitle: $(element).find('.twRyoPhotoEventsDescription').text(),
      };
    })
    .get();

  const itemDescriptions: ItemDescription[] = $('.twRyoPhotoEventsNotes')
    .map((idx, element) => {
      return {
        eventDescription: $(element).find('.onlyp').next().text(),
        eventDescription2: $(element).find('.onlyp').next().next().text(),
        eventDescription3: $(element)
          .find('.onlyp')
          .next()
          .next()
          .next()
          .text(),
        eventDescription4: $(element)
          .find('.onlyp')
          .next()
          .next()
          .next()
          .next()
          .text(),
      };
    })
    .get();

  // sanity checks
  // console.log('DESC. COUNT: ', itemDescriptions.length)
  // console.log('TITLES COUNT: ', itemTitles.length)
  // console.log('HEADERS COUNT: ', itemHeaders.length)

  const consolidatedData = itemHeaders.reduce((acc: any, current, idx) => {
    acc.push({
      date: itemHeaders[idx] ? itemHeaders[idx].date : 'Not Found',
      location: itemHeaders[idx] ? itemHeaders[idx].location : 'Not Found',
      eventTitle: itemTitles[idx] ? itemTitles[idx].eventTitle : 'Not Found',
      eventDescription: [
        itemDescriptions[idx].eventDescription,
        itemDescriptions[idx].eventDescription2,
        itemDescriptions[idx].eventDescription3,
        itemDescriptions[idx].eventDescription4,
      ],
    });
    return acc;
  }, []);

  return consolidatedData;
};
