import { useState } from 'react';

import Cropper from 'react-easy-crop';
import type { Area, Point } from 'react-easy-crop';
import { ZoomMinusIcon, ZoomPlusIcon } from '@/assets/icons';

import type { ToUploadType } from '@/types/users.d.ts';

interface Props {
  toUpload: ToUploadType;
  imageSrc: string;
  setCroppedAreaPixels: (value: React.SetStateAction<Area | null>) => void;
}

function EditProfileCropper({ toUpload, imageSrc, setCroppedAreaPixels }: Props) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const aspect = toUpload === 'avatar' ? (1 / 1) : (3 / 1);

  function onCropCompleted(_croppedArea: Area, croppedAreaPixels: Area) {
    setCroppedAreaPixels(croppedAreaPixels);
  }

  return (
    <div className='flex-1 flex flex-col'>
      <div className='relative flex-1 overflow-hidden cursor-move'>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropCompleted}
        />
      </div>

      <div className='p-4 flex justify-center items-center gap-3'>
        <ZoomMinusIcon className='size-5 text-secondary' />
        <input
          type='range'
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          aria-labelledby='Zoom'
          onChange={(e) => setZoom(Number(e.currentTarget.value))}
          className='w-75'
        />
        <ZoomPlusIcon className='size-5 text-secondary' />
      </div>
    </div>
  );
}

export default EditProfileCropper;
