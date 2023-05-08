import { useEffect, useState } from 'react';
import { Amplify, Auth, Hub } from 'aws-amplify';
import DubeButton from 'components/widgets/Button';

function SignInWithGoogle() {
  return (
    <div className="flex items-center">
      <DubeButton
        title={'Sign In'}
        primary={true}
        onClick={() => Auth.federatedSignIn()}
      ></DubeButton>
    </div>
  );
}

export default SignInWithGoogle;
