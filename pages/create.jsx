/* eslint-disable  */
import Title from '@components/Title';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getSession } from 'next-auth/client';
import { useContext, useRef, useState } from 'react';
import { default as ImageNext } from 'next/image';
import NotificationContext from '@context/notificationContext';
import LabelInput from '@components/LabelInput';
import Button from '@components/Button';
import LabelSelect from '@components/LabelSelect';
import Select from '@components/Select';
import Input from '@components/Input';
import uuid from 'react-uuid';
import { useRouter } from 'next/router';
import { fetchApi } from '@lib/fetchingData';

export default function CreatePage({ session }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const inputBannerRef = useRef(null);
  const [imgBanner, setImgBanner] = useState();
  const notificationCtx = useContext(NotificationContext);
  const [event, setEvent] = useState({
    name: '',
    type: '',
    caption: '',
    startTime: '',
    endTime: '',
    fee: '',
    contactPersons: [{
      name: '',
      app: '',
      value: '',
    }],
    link: '',
    banner: '',
  });
  const [error, setError] = useState({
    eventName: '',
    eventType: '',
    eventCaption: '',
    eventStartTime: '',
    eventEndTime: '',
    eventFee: '',
    eventContactPerson: '',
    eventLink: '',
  });
  const [eventType] = useState([
    {
      value: 'webinar',
      label: 'Webinar'
    },
    {
      value: 'workshop',
      label: 'Workshop'
    }
  ]);
  const [contactPersonApp] = useState([
    {
      value: 'whatsapp',
      label: 'WhatsApp',
    },
    {
      value: 'line',
      label: 'Line',
    },
    {
      value: 'instagram',
      label: 'Instagram',
    },
    {
      value: 'telegram',
      label: 'Telegram',
    },
    
  ]);

  const setData = (setFunction, field, message) => {
    setFunction((current) => ({
      ...current,
      [field]: message,
    }));
  };

  const setContactPersons = (e, index, name) => {
    const contactPersons = [...event.contactPersons];
    contactPersons[index][name] = e.target.value;
    setEvent((current) => ({
      ...current,
      contactPersons,
    }));
  };

  const handleChangeBanner = () => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        const image = new Image();
        image.src = reader.result;

        image.onload = function () {
          const { width, height } = this;

          if (width % 16 === 0 && height % 9 === 0) {
            setImgBanner(reader.result);
          } else {
            inputBannerRef.current.value = '';
            notificationCtx.showNotification({
              message: 'Image must be with ratio 16:9',
              status: notificationCtx.status.DANGER,
            });
          }
        };
      }
    };

    reader.readAsDataURL(inputBannerRef.current.files[0]);
  };

  const handlePlusContactPersons = (e, index) => {
    setEvent((current) => ({
      ...current,
      contactPersons: [
        ...current.contactPersons,
        {
          name: '',
          app: '',
          value: '',
        },
      ],
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let contactPersonsString = '';
    event.contactPersons.forEach((contactPerson) => {
      contactPersonsString += `${contactPerson.name}, ${contactPerson.app}, ${contactPerson.value}, `;
    });

    const response = await fetchApi(`/events`, {
      method: 'POST',
      headers: {
        'content-type': undefined,
      },
      body: {
        name: event.name,
        type: event.type,
        caption: event.caption,
        startTime: event.startTime,
        endTime: event.endTime,
        fee: event.fee.length ? +event.fee : 0,
        contactPersons: contactPersonsString,
        link: event.link,
        banner: inputBannerRef.current.files[0],
      },
    });

    setLoading(false);

    if (response.success) {
      return router.replace(`/${session.user.name}`);
    }

    notificationCtx.showNotification({
      message: 'Somethin went wrong, please try again',
      status: notificationCtx.status.DANGER,
    });
  }


  return (
    <>
      <Title>Create Event</Title>

      <form className="grid gap-5 mt-5" onSubmit={handleSubmit}>
        <div>
          <Title heading="2">Banner Event</Title>

          <div className="mt-3">
            <label htmlFor="banner-image">
              {(!inputBannerRef?.current || inputBannerRef?.current?.value === '') && (
                <div className="w-full bg-ev-gray img-banner-ratio flex flex-col justify-center items-center text-ev-dark-gray cursor-pointer">
                  <FontAwesomeIcon icon={faImage} size="2x" />
                  <p>Browse an image</p>
                </div>
              )}
              {inputBannerRef && inputBannerRef?.current?.value !== '' && imgBanner && (
                <div className="relative w-full img-banner-ratio">
                  <ImageNext
                    src={imgBanner}
                    layout="fill"
                    loading="lazy"
                  />
                </div>
              )}
            </label>
            <input
              type="file"
              id="banner-image"
              className="hidden"
              accept="image/png, image/jpeg, image/jpg"
              ref={inputBannerRef}
              onChange={handleChangeBanner}
            />

            <p className="mt-2"><span className="text-ev-red">*</span>Maximum size of 1mb with 16:9 image ratio</p>
          </div>
        </div>

        <div>
          <Title heading="2">Information Event</Title>

          <div className="flex flex-col gap-4 mt-5">
            <LabelInput
              label="Event Name"
              id="event_name"
              required
              placeholder="Your event name"
              value={event.name}
              errorMessage={error.eventName}
              onChange={(e) => setData(setEvent, 'name', e.target.value)}
            />
            <LabelSelect
              label="Event Type"
              id="event_type"
              required
              options={eventType}
              value={event.type}
              placeholder="Your event type"
              errorMessage={error.eventType}
              onChange={(e) => setData(setEvent, 'type', e.target.value)}
            />
            <LabelInput
              label="Caption"
              id="event_caption"
              required
              large
              placeholder="Your event caption"
              value={event.caption}
              errorMessage={error.eventCaption}
              onChange={(e) => setData(setEvent, 'caption', e.target.value)}
            />
            <div className="grid gap-4 grid-flow-col">
              <LabelInput
                type="datetime-local"
                label="Start Date Time"
                id="event_start_date_time"
                placeholder="Your event start"
                required
                value={event.startTime}
                errorMessage={error.eventStartTime}
                onChange={(e) => setData(setEvent, 'startTime', e.target.value)}
              />
              <LabelInput
                type="datetime-local"
                label="End Date Time"
                id="event_end_date_time"
                placeholder="Your event end"
                required
                value={event.endTime}
                errorMessage={error.eventEndTime}
                onChange={(e) => setData(setEvent, 'endTime', e.target.value)}
              />
            </div>
            <LabelInput
              label="Fee"
              id="event_fee"
              placeholder="Your event fee (blank for free)"
              value={event.fee}
              errorMessage={error.eventFee}
              onChange={(e) => setData(setEvent, 'fee', e.target.value)}
            />
            <div>
              <div className="flex flex-col gap-2">
                {event.contactPersons.map((contactPerson, index) => (
                  <div key={uuid()} className="flex flex-col gap-2">
                    <LabelInput
                      label="Contact Person"
                      id={`event_contact_person_${index+1}`}
                      required
                      placeholder="Name contact person"
                      value={contactPerson.name}
                      onChange={(e) => setContactPersons(e, index, 'name')}
                    />
                    <div className="flex gap-2">
                      <Select
                        required
                        value={event.contactPersons[index].app}
                        options={contactPersonApp}
                        placeholder="App"
                        onChange={(e) => setContactPersons(e, index, 'app')}
                      />
                      <div className="w-full">
                        <Input
                          id="contact_person_value"
                          placeholder="Value"
                          value={contactPerson.value}
                          onChange={(e) => setContactPersons(e, index, 'value')}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {event.contactPersons.length < 3 && (
                <div className="mt-3">
                  <Button typeButton="secondary" onClick={handlePlusContactPersons}>+ Plus</Button>
                </div>
              )}
            </div>
            <LabelInput
              label="Registration Link"
              id="event_registration_link"
              required
              placeholder="Your event registration link"
              value={event.link}
              errorMessage={error.eventLink}
              onChange={(e) => setData(setEvent, 'link', e.target.value)}
            />
          </div>
        </div>

        <div>
          <Button type="submit" full loading={loading}>Create Event</Button>
        </div>
      </form>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}
