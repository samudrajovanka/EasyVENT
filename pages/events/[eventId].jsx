import Badge from '@components/Badge';
import Title from '@components/Title';
import { faAddressCard, faCalendarAlt, faMoneyBillAlt } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
<<<<<<< HEAD
import fetchData from '@lib/fetchData';
=======
>>>>>>> develop
import Image from 'next/dist/client/image';
import { useRouter } from 'next/dist/client/router';
import { useEffect, useState } from 'react';
import rupiahFormat from '@lib/currencyFormat';
import moment from 'moment';
import {
  faInstagram, faLine, faTelegramPlane, faWhatsapp,
} from '@fortawesome/free-brands-svg-icons';
import Link from 'next/link';
import Button from '@components/Button';
import uuid from 'react-uuid';
<<<<<<< HEAD
=======
import { fetchApi } from '@lib/fetchingData';
>>>>>>> develop

export default function DetailEventPage() {
  const router = useRouter();
  const { eventId } = router.query;
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState({});

<<<<<<< HEAD
  useEffect(() => {
    if (!eventId) {
      return;
    }
    setEvent(fetchData.getEventById(eventId));
=======
  useEffect(async () => {
    if (!eventId) {
      return;
    }

    const response = await fetchApi(`/events/${eventId}`);

    const { event: eventResponse } = response.data;

    setEvent(eventResponse);
>>>>>>> develop
    setLoading(false);
  }, [eventId]);

  return (
    <div className="grid lg:grid-cols-12 gap-5">
      {!loading && event && (
        <>
          <div className="lg:col-span-8">
            <div className="relative w-full img-banner-ratio">
              <Image
<<<<<<< HEAD
                src={event?.banner}
                layout="fill"
                loading="lazy"
=======
                src={event?.banner.url ?? '/images/blank.png'}
                layout="fill"
                loading="lazy"
                objectFit="cover"
>>>>>>> develop
                alt="banner_event"
              />
            </div>
            <div className="flex flex-col gap-8 lg:p-5">
              <header className="flex flex-col gap-2">
                <h1 className="text-2xl">{event?.eventName}</h1>
                <div className="flex">
<<<<<<< HEAD
                  <Badge>{event?.eventType}</Badge>
=======
                  <Badge>{event?.type}</Badge>
>>>>>>> develop
                </div>
              </header>
              <p>{event?.caption}</p>
            </div>
          </div>

          <div className="lg:col-span-4">
            <Title>Information Event</Title>
            <div className="flex flex-col gap-10 mt-2">
              <div>
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faMoneyBillAlt} size="lg" />
                  <p className="font-bold text-xl">Fee</p>
                </div>
                <p>{event?.fee === 0 ? 'Free' : rupiahFormat(event?.fee)}</p>
              </div>

              {/* startdate */}
              <div>
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faCalendarAlt} size="lg" />
                  <p className="font-bold text-xl">Start Date</p>
                </div>
<<<<<<< HEAD
                <p>{moment(event?.startDateTime).format('dddd, DD MMMM YYYY')}</p>
                <p>{moment(event?.startDateTime).format('HH:mm')}</p>
=======
                <p>{moment(event?.start_time).format('dddd, DD MMMM YYYY')}</p>
                <p>{moment(event?.start_time).format('HH:mm')}</p>
>>>>>>> develop
              </div>

              {/* enddate */}
              <div>
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faMoneyBillAlt} size="lg" />
                  <p className="font-bold text-xl">End Date</p>
                </div>
<<<<<<< HEAD
                <p>{moment(event?.endDateTime).format('dddd, DD MMMM YYYY')}</p>
                <p>{moment(event?.endDateTime).format('HH:mm')}</p>
=======
                <p>{moment(event?.end_time).format('dddd, DD MMMM YYYY')}</p>
                <p>{moment(event?.end_time).format('HH:mm')}</p>
>>>>>>> develop
              </div>

              {/* contactperson */}
              <div>
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faAddressCard} size="lg" />
                  <p className="font-bold text-xl">Contact Person</p>
                </div>
<<<<<<< HEAD
                {event?.contactPersons.map((contactperson) => {
=======
                {event?.contact_persons.map((contactperson) => {
>>>>>>> develop
                  if (contactperson.app === 'whatsapp') {
                    return (
                      <Link href={`https://wa.me/${contactperson.value}`} key={uuid()}>
                        <a className="flex items-center gap-2" target="_blank">
                          <FontAwesomeIcon icon={faWhatsapp} size="lg" />
                          <p>{contactperson.name}</p>
                        </a>
                      </Link>
                    );
                  }

                  if (contactperson.app === 'line') {
                    return (
                      <Link href={`https://line.me/R/ti/p/${contactperson.value}`} key={uuid()}>
                        <a className="flex items-center gap-2" target="_blank">
                          <FontAwesomeIcon icon={faLine} size="lg" />
                          <p>{contactperson.name}</p>
                        </a>
                      </Link>
                    );
                  }

                  if (contactperson.app === 'telegram') {
                    return (
                      <Link href={`https://telegram.me/${contactperson.value}`} key={uuid()}>
                        <a className="flex items-center gap-2" target="_blank">
                          <FontAwesomeIcon icon={faTelegramPlane} size="lg" />
                          <p>{contactperson.name}</p>
                        </a>
                      </Link>
                    );
                  }

                  if (contactperson.app === 'instagram') {
                    return (
                      <Link href={`https://www.instagram.com/${contactperson.value}`} key={uuid()}>
                        <a className="flex items-center gap-2" target="_blank">
                          <FontAwesomeIcon icon={faInstagram} size="lg" />
                          <p>{contactperson.name}</p>
                        </a>
                      </Link>
                    );
                  }

                  return null;
                })}
              </div>
<<<<<<< HEAD
              <Button href={event?.registrationLink} target="_blank">Register Now</Button>
=======
              <Button href={event?.link} target="_blank">Register Now</Button>
>>>>>>> develop
            </div>
          </div>
        </>
      )}
    </div>
  );
}
