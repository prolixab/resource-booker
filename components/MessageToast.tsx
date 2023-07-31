'use client';

import { Button, Toast } from 'flowbite-react';
import {useState} from 'react';

export default function MessageToast({ toastText,showToast, setShowToast }:{toastText:string,showToast:boolean,setShowToast:Function}) {
//const props = { showToast, setShowToast };

setTimeout(() => {
                setShowToast(false);
            }, 12000);

  return (<>
      {showToast && 
      <Toast>
        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-cyan-500 dark:bg-cyan-800 dark:text-cyan-200">
        👍
        </div>
        <div className="ml-3 text-sm font-normal">{toastText}</div>
        <Toast.Toggle onDismiss={() => setShowToast(false)} />
        </Toast>
  }
  </>
  )
}


