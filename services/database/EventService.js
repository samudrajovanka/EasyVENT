import Event from '@models/EventModel';
import FirebaseStorageService from '@servicesStorage/FirebaseStorageService';

class EventService {
  async createEvent({
    owner,
    name,
    type,
    caption,
    startTime,
    endTime,
    fee,
    contactPersons,
    link,
    banner,
  }) {
    const firebaseStorageService = new FirebaseStorageService();

    const { url, pathName } = await firebaseStorageService.uploadImage(banner, 'event');

    const captionRaw = caption.replace(/\n/g, '<br>');

    const contactPersonsArray = contactPersons.split(', ').filter((item) => item !== '');
    const contactPersonsArrayObject = [];
    contactPersonsArray.forEach((item, index) => {
      if (index % 3 === 0) {
        contactPersonsArrayObject.push({
          name: item,
          app: contactPersonsArray[index + 1],
          value: contactPersonsArray[index + 2],
        });
      }
    });

    const newEvent = new Event({
      owner,
      name,
      type,
      caption: captionRaw,
      start_time: startTime,
      end_time: endTime,
      fee,
      contact_persons: contactPersonsArrayObject,
      link,
      banner: {
        url,
        path: pathName,
      },
      created_at: new Date(),
      updated_at: new Date(),
    });

    const event = await newEvent.save();

    return event._id;
  }

  async getEvents(username) {
    let events = [];
    if (username) {
      events = await Event.find({ owner: username }).sort({ created_at: -1 });
    } else {
      events = await Event.find().sort({ created_at: -1 });
    }

    return events;
  }

  async getEventById(id) {
    const event = await Event.findById(id);

    return event;
  }
}

export default EventService;
