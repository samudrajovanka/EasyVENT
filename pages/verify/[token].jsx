import Button from '@components/Button';
import Card from '@components/Card';
import { fetchApi } from '@lib/fetchingData';
import { useRouter } from 'next/dist/client/router';
import { useEffect, useState } from 'react';

export default function VerifyPage() {
  const router = useRouter();
  const { token } = router.query;
  const [isSuccessVerify, setIsSuccessVerify] = useState(true);

  useEffect(async () => {
    if (token) {
      const response = await fetchApi(`/auth/verify/${token}`, {
        method: 'POST',
      });

      if (response.success) {
        router.replace('/login');
      } else if (!response.success) {
        setIsSuccessVerify(false);
      }
    }
  }, [token]);

  return (
    <div className="absolute sm:relative top-0 left-0 h-screen sm:h-auto w-full p-4 sm:p-0 flex items-center justify-center">
      <Card width="w-full lg:w-6/12" padding="p-5 lg:p-8" gap="gap-5">
        <h1 className="text-xl text-center font-bold">Verification Email</h1>
        {isSuccessVerify && (
          <p className="text-xl text-center">Please wait</p>
        )}

        {!isSuccessVerify && (
          <>
            <p className="text-xl text-center">Token expired or invalid</p>
            <Button href="/register">Register Again</Button>
          </>
        )}
      </Card>
    </div>
  );
}
