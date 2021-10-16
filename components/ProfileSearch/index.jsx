import Image from 'next/image';
import Link from 'next/link';

export default function ProfileSearch({ data }) {
  return (
    <Link href={`/${data.username}`}>
      <a>
        <div className="flex items-center gap-5">
          <div className="relative w-12 img-square-ratio rounded-full overflow-hidden">
            <Image
              src={data.avatar}
              layout="fill"
              loading="lazy"
            />
          </div>

          <div>
            <p>{data.name}</p>
            <p className="text-ev-dark-gray">{data.username}</p>
          </div>
        </div>
      </a>
    </Link>
  );
}
