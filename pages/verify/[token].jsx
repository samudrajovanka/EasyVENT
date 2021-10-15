import Button from '@components/Button';
import Card from '@components/Card';
import { TOKEN_INVALID_ERR, USER_ACTIVE_ERR } from '@lib/constantErrorType';
import { fetchApi } from '@lib/fetchingData';
import { useRouter } from 'next/dist/client/router';
import { useEffect, useState } from 'react';

export default function VerifyPage() {
  const router = useRouter();
  const { token } = router.query;
  const [isSuccessVerify, setIsSuccessVerify] = useState(true);
  const [unsuccessType, setUnsuccessType] = useState(null);

  useEffect(async () => {
    if (token) {
      const response = await fetchApi(`/auth/verify/${token}`, {
        method: 'POST',
      });

      if (response.success) {
        router.replace('/login');
      } else if (!response.success) {
        setIsSuccessVerify(false);

        if (response.type === TOKEN_INVALID_ERR) {
          setUnsuccessType(TOKEN_INVALID_ERR);
        } else if (response.type === USER_ACTIVE_ERR) {
          setUnsuccessType(USER_ACTIVE_ERR);
        }
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

        {!isSuccessVerify && unsuccessType === TOKEN_INVALID_ERR && (
          <>
            <p className="text-xl text-center">Token expired or invalid</p>
            <Button href="/register">Register Again</Button>
          </>
        )}
        {!isSuccessVerify && unsuccessType === USER_ACTIVE_ERR && (
          <>
            <p className="text-xl text-center">Your account already active</p>
            <Button href="/">Go Home</Button>
          </>
        )}
      </Card>
    </div>
  );
}
